export type GridSize = { rows: number; columns: number };

export type CustomPageOptions = {
    targetGrid: GridSize;
    symbolSet?: string;
    includeAlphabet?: boolean;
    includeQuickPhrases?: boolean;
    customVocabulary?: string[];
};

export function buildCustomPages(options: CustomPageOptions) {
    const customPages = [] as Array<Record<string, unknown>>;

    if (options.includeAlphabet !== false) {
        customPages.push({
            name: "Alphabet & Spelling",
            grid: options.targetGrid,
            symbolSet: options.symbolSet ?? "Text-only",
            layout: "Alphabet row plus core row (A-M / N-Z split) with space, delete, and clear",
            notes: [
                "Place space and delete in consistent bottom-right positions to preserve motor planning.",
                "If word prediction is available, reserve top row for suggestions and maintain consistent height.",
            ],
        });
    }

    customPages.push({
        name: "Core Words",
        grid: options.targetGrid,
        symbolSet: options.symbolSet ?? "PCS or SymbolStix",
        layout: "High-frequency verbs, pronouns, helpers, descriptors; keep navigation bottom-left/bottom-right.",
        notes: [
            "Mirror source core locations where possible to ease transition between systems.",
            "Color code by part of speech if the target system supports it (Fitzgerald or Modified Fitzgerald).",
        ],
    });

    if (options.includeQuickPhrases !== false) {
        customPages.push({
            name: "Quick Phrases & Navigation",
            grid: { rows: Math.max(3, options.targetGrid.rows - 1), columns: options.targetGrid.columns },
            symbolSet: options.symbolSet ?? "Text-only",
            layout: "Yes/No, stop/wait/help, greetings, and navigation buttons (home/back/search).",
            notes: [
                "Pin navigation buttons to consistent corners across all custom pages.",
                "Group regulation/support phrases (stop, wait, help) in a single row for quick access.",
            ],
        });
    }

    if (options.customVocabulary && options.customVocabulary.length > 0) {
        customPages.push({
            name: "Custom Fringe/Topics",
            grid: options.targetGrid,
            symbolSet: options.symbolSet ?? "PCS or SymbolStix",
            layout: "Auto-generated topic folders seeded from provided vocabulary.",
            seededVocabulary: options.customVocabulary,
            notes: [
                "Cluster nouns and places together; verbs/adjectives can be linked from the core page to reduce duplication.",
                "Add photo placeholders for people/places if the target system supports image import.",
            ],
        });
    }

    return customPages;
}
