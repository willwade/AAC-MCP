import { Tool } from "fastmcp";
import { z } from "zod";

import { AAC_PAGESETS, findPageset, findPagesetsBySystem } from "../data/aacPagesets.js";
import { findSystemProfile } from "../data/aacSystems.js";
import { buildCustomPages } from "./shared/customPages.js";
import { clampGridToSystem } from "./shared/systemSupport.js";

const parameters = z.object({
    sourceSystem: z.string().describe("Source AAC system (e.g., Grid for iPad, TouchChat, Proloquo2Go)").optional(),
    sourcePageset: z.string().describe("Specific pageset name on the source system (e.g., Super Core 50)").optional(),
    targetSystem: z
        .string()
        .describe("Target AAC system to convert to (e.g., Grid for iPad, TouchChat, Proloquo2Go)"),
    targetRows: z
        .number()
        .int()
        .positive()
        .describe("Override for target grid rows; defaults to target pageset or source grid")
        .optional(),
    targetColumns: z
        .number()
        .int()
        .positive()
        .describe("Override for target grid columns; defaults to target pageset or source grid")
        .optional(),
    symbolSet: z
        .string()
        .describe("Requested symbol library (e.g., PCS, SymbolStix, Text-only). Used to tailor conversion notes.")
        .optional(),
    includeAlphabet: z
        .boolean()
        .describe("Include an alphabet/spelling page in the custom output")
        .default(true)
        .optional(),
    includeQuickPhrases: z
        .boolean()
        .describe("Include quick phrases/navigation page in the custom output")
        .default(true)
        .optional(),
    customVocabulary: z
        .array(z.string())
        .describe("Optional custom vocabulary to seed fringe or topic pages")
        .default([])
        .optional(),
});

const tool: Tool<undefined, typeof parameters> = {
    name: "aac_pageset_converter",
    description:
        "Convert AAC pagesets between systems and propose custom grid pages (core, alphabet, quick phrases, and fringe).",
    annotations: {
        title: "AAC Pageset Converter",
        openWorldHint: false,
        readOnlyHint: true,
    },
    parameters,
    execute: async (args) => {
        const sourceInfo = findPageset(args.sourceSystem, args.sourcePageset);
        const targetCandidates = findPagesetsBySystem(args.targetSystem);
        const targetInfo =
            (args.sourcePageset &&
                targetCandidates.find(
                    (entry) => entry.pageset.toLowerCase() === args.sourcePageset?.toLowerCase(),
                )) || targetCandidates[0];

        const baseGrid = targetInfo?.defaultGrid ?? sourceInfo?.defaultGrid ?? { rows: 6, columns: 10 };
        const requestedGrid = {
            rows: args.targetRows ?? baseGrid.rows,
            columns: args.targetColumns ?? baseGrid.columns,
        };

        const { grid: targetGrid, compatibilityNotes } = clampGridToSystem(requestedGrid, args.targetSystem);

        const steps: string[] = [];

        if (sourceInfo) {
            steps.push(
                `Export vocabulary from ${sourceInfo.pageset} (${sourceInfo.system}) using CSV/TXT if available to preserve categories and stored phrases.`,
            );
            steps.push(
                `Replicate navigation anchors from ${sourceInfo.pageset} (e.g., home/back positions) before resizing grids in ${args.targetSystem}.`,
            );
            steps.push(...sourceInfo.conversionNotes.map((note) => `${sourceInfo.pageset}: ${note}`));
        } else if (args.sourceSystem) {
            steps.push(`Map high-frequency core from ${args.sourceSystem} into the target grid first to preserve motor plans.`);
        } else {
            steps.push("Start with core + navigation placement, then layer fringe/topics and morphology popups.");
        }

        const targetProfile = findSystemProfile(args.targetSystem);
        if (targetInfo) {
            steps.push(...targetInfo.conversionNotes.map((note) => `${targetInfo.pageset}: ${note}`));
        }
        if (targetProfile) {
            steps.push(...targetProfile.conversionTips.map((tip) => `${targetProfile.system}: ${tip}`));
        }

        if (args.symbolSet) {
            steps.push(
                `Ensure symbol library compatibility: requested ${args.symbolSet}. Remap incompatible symbols to text labels where needed.`,
            );
        }

        const sourceSection = sourceInfo
            ? {
                system: sourceInfo.system,
                pageset: sourceInfo.pageset,
                defaultGrid: sourceInfo.defaultGrid,
                symbolLibraries: sourceInfo.symbolLibraries,
            }
            : args.sourceSystem
                ? { system: args.sourceSystem, pageset: args.sourcePageset ?? "(unspecified)" }
                : undefined;

        const targetSection = targetInfo
            ? {
                system: targetInfo.system,
                pageset: targetInfo.pageset,
                defaultGrid: targetInfo.defaultGrid,
                symbolLibraries: targetInfo.symbolLibraries,
            }
            : {
                system: args.targetSystem,
                pageset: "(custom)",
                defaultGrid: targetGrid,
                symbolLibraries: args.symbolSet ? [args.symbolSet] : [],
            };

        const response = {
            source: sourceSection,
            target: targetSection,
            targetGrid,
            conversionSteps: steps,
            customPages: buildCustomPages({
                targetGrid,
                symbolSet: args.symbolSet,
                includeAlphabet: args.includeAlphabet,
                includeQuickPhrases: args.includeQuickPhrases,
                customVocabulary: args.customVocabulary,
            }),
            compatibility: {
                targetSystem: args.targetSystem,
                symbolSupport: targetProfile?.supportedSymbols ?? [],
                symbolRequest: args.symbolSet,
                gridAdjustments: compatibilityNotes,
                importFormats: targetProfile?.importFormats ?? [],
                exportFormats: targetProfile?.exportFormats ?? [],
                notableFeatures: targetProfile?.notableFeatures ?? [],
            },
            catalogPreview: AAC_PAGESETS.filter(
                (entry) =>
                    entry.system.toLowerCase() === args.targetSystem.toLowerCase() ||
                    (args.sourceSystem && entry.system.toLowerCase() === args.sourceSystem.toLowerCase()),
            ).map((entry) => ({
                system: entry.system,
                pageset: entry.pageset,
                defaultGrid: entry.defaultGrid,
                symbolLibraries: entry.symbolLibraries,
                typicalUseCases: entry.typicalUseCases,
            })),
        };

        return JSON.stringify(response, null, 2);
    },
};

export default tool;
