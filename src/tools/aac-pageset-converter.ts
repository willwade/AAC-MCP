import { Tool } from "fastmcp";
import { z } from "zod";

import { AAC_PAGESETS, findPageset, findPagesetsBySystem } from "../data/aacPagesets.js";

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

const buildCustomPages = (args: z.infer<typeof parameters>, targetGrid: { rows: number; columns: number }) => {
    const customPages = [] as Array<Record<string, unknown>>;

    if (args.includeAlphabet !== false) {
        customPages.push({
            name: "Alphabet & Spelling",
            grid: targetGrid,
            symbolSet: args.symbolSet ?? "Text-only",
            layout: "Alphabet row plus core row (A-M / N-Z split) with space, delete, and clear",
            notes: [
                "Place space and delete in consistent bottom-right positions to preserve motor planning.",
                "If word prediction is available, reserve top row for suggestions and maintain consistent height.",
            ],
        });
    }

    customPages.push({
        name: "Core Words",
        grid: targetGrid,
        symbolSet: args.symbolSet ?? "PCS or SymbolStix",
        layout: "High-frequency verbs, pronouns, helpers, descriptors; keep navigation bottom-left/bottom-right.",
        notes: [
            "Mirror source core locations where possible to ease transition between systems.",
            "Color code by part of speech if the target system supports it (Fitzgerald or Modified Fitzgerald).",
        ],
    });

    if (args.includeQuickPhrases !== false) {
        customPages.push({
            name: "Quick Phrases & Navigation",
            grid: { rows: Math.max(3, targetGrid.rows - 1), columns: targetGrid.columns },
            symbolSet: args.symbolSet ?? "Text-only",
            layout: "Yes/No, stop/wait/help, greetings, and navigation buttons (home/back/search).",
            notes: [
                "Pin navigation buttons to consistent corners across all custom pages.",
                "Group regulation/support phrases (stop, wait, help) in a single row for quick access.",
            ],
        });
    }

    if (args.customVocabulary && args.customVocabulary.length > 0) {
        customPages.push({
            name: "Custom Fringe/Topics",
            grid: targetGrid,
            symbolSet: args.symbolSet ?? "PCS or SymbolStix",
            layout: "Auto-generated topic folders seeded from provided vocabulary.",
            seededVocabulary: args.customVocabulary,
            notes: [
                "Cluster nouns and places together; verbs/adjectives can be linked from the core page to reduce duplication.",
                "Add photo placeholders for people/places if the target system supports image import.",
            ],
        });
    }

    return customPages;
};

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
        const targetGrid = {
            rows: args.targetRows ?? baseGrid.rows,
            columns: args.targetColumns ?? baseGrid.columns,
        };

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

        if (targetInfo) {
            steps.push(...targetInfo.conversionNotes.map((note) => `${targetInfo.pageset}: ${note}`));
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
            customPages: buildCustomPages(args, targetGrid),
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
