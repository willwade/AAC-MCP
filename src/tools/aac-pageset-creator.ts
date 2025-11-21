import { Tool } from "fastmcp";
import { z } from "zod";

import { AAC_PAGESETS } from "../data/aacPagesets.js";
import { findSystemProfile } from "../data/aacSystems.js";
import { buildCustomPages } from "./shared/customPages.js";
import { clampGridToSystem } from "./shared/systemSupport.js";

const parameters = z.object({
    targetSystems: z
        .array(z.string())
        .nonempty()
        .describe("List of AAC systems to build the pageset for (e.g., Grid for iPad, TouchChat, Proloquo2Go)"),
    pagesetName: z.string().describe("Name for the custom pageset").default("Custom Portable Pageset").optional(),
    baseRows: z.number().int().positive().describe("Base grid rows before system-specific clamping").optional(),
    baseColumns: z.number().int().positive().describe("Base grid columns before system-specific clamping").optional(),
    symbolSet: z
        .string()
        .describe("Preferred symbol library (PCS, SymbolStix, Text-only); compatibility will be reported per system.")
        .optional(),
    vocabulary: z.array(z.string()).describe("Vocabulary to seed fringe/topic pages").default([]).optional(),
    includeAlphabet: z
        .boolean()
        .describe("Include an alphabet/spelling page in each generated system plan")
        .default(true)
        .optional(),
    includeQuickPhrases: z
        .boolean()
        .describe("Include quick phrases/navigation in each generated system plan")
        .default(true)
        .optional(),
    accessMethod: z
        .string()
        .describe("Access method to tailor spacing (e.g., touch, eye gaze, switch)")
        .optional(),
});

const tool: Tool<undefined, typeof parameters> = {
    name: "aac_pageset_creator",
    description:
        "Design a portable AAC pageset layout across systems with compatible grid sizes, symbol guidance, and custom pages.",
    annotations: {
        title: "AAC Pageset Creator",
        openWorldHint: false,
        readOnlyHint: true,
    },
    parameters,
    execute: async (args) => {
        const baseGrid = {
            rows: args.baseRows ?? 6,
            columns: args.baseColumns ?? 10,
        };

        const systems = [...new Set(args.targetSystems.map((name) => name.trim()).filter(Boolean))];

        const systemPlans = systems.map((systemName) => {
            const profile = findSystemProfile(systemName);
            const { grid, compatibilityNotes } = clampGridToSystem(baseGrid, systemName);

            const creationSteps: string[] = [];
            if (profile) {
                creationSteps.push(...profile.conversionTips);
                creationSteps.push(
                    `${profile.system}: use supported symbol libraries (${profile.supportedSymbols.join(", ")}) or fall back to text labels for unsupported graphics.`,
                );
                creationSteps.push(
                    `${profile.system}: recommended import formats ${profile.importFormats.join(", ")} — export backups before editing to preserve motor plans.`,
                );
            }

            if (args.accessMethod) {
                creationSteps.push(
                    `Adjust spacing for ${args.accessMethod}: increase cell padding for eye gaze, ensure generous hit targets for touch, or keep consistent dwell timing for switch scanning.`,
                );
            }

            if (compatibilityNotes.length > 0) {
                creationSteps.push(...compatibilityNotes);
            }

            const catalog = AAC_PAGESETS.filter((entry) => entry.system.toLowerCase() === systemName.toLowerCase()).map(
                (entry) => ({
                    pageset: entry.pageset,
                    defaultGrid: entry.defaultGrid,
                    symbolLibraries: entry.symbolLibraries,
                    typicalUseCases: entry.typicalUseCases,
                }),
            );

            return {
                system: systemName,
                targetGrid: grid,
                symbolSupport: profile?.supportedSymbols ?? [],
                importFormats: profile?.importFormats ?? [],
                exportFormats: profile?.exportFormats ?? [],
                notableFeatures: profile?.notableFeatures ?? [],
                creationSteps,
                customPages: buildCustomPages({
                    targetGrid: grid,
                    symbolSet: args.symbolSet,
                    includeAlphabet: args.includeAlphabet,
                    includeQuickPhrases: args.includeQuickPhrases,
                    customVocabulary: args.vocabulary,
                }),
                referencePagesets: catalog,
            };
        });

        const portableNotes: string[] = [];
        if (systems.length > 1) {
            portableNotes.push(
                "Align navigation anchors (home/back/search) to the same corners across systems to minimize relearning.",
            );
            portableNotes.push(
                "Keep core word positions stable and adjust only fringe folders when grid sizes differ between systems.",
            );
            if (args.symbolSet) {
                portableNotes.push(
                    `Verify symbol licensing across systems for ${args.symbolSet}; fallback to text labels if a system lacks that library.`,
                );
            }
        }

        return JSON.stringify(
            {
                name: args.pagesetName ?? "Custom Portable Pageset",
                baseGrid,
                portableNotes,
                systems: systemPlans,
            },
            null,
            2,
        );
    },
};

export default tool;
