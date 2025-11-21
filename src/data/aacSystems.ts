export type AacSystemProfile = {
    system: string;
    gridRange: {
        minRows: number;
        maxRows: number;
        minColumns: number;
        maxColumns: number;
    };
    supportedSymbols: string[];
    importFormats: string[];
    exportFormats: string[];
    notableFeatures: string[];
    conversionTips: string[];
};

export const AAC_SYSTEMS: AacSystemProfile[] = [
    {
        system: "Grid for iPad",
        gridRange: { minRows: 2, maxRows: 8, minColumns: 4, maxColumns: 12 },
        supportedSymbols: ["SymbolStix", "PCS", "Text-only"],
        importFormats: ["Grid Set Bundle (.gridset)", "CSV (vocabulary)", "PDF (layout reference)"],
        exportFormats: ["Grid Set Bundle (.gridset)", "CSV (vocabulary)", "PDF"],
        notableFeatures: [
            "Consistent home/back buttons and automatic motor-plan preservation when resizing",
            "SymbolStix-first library with PCS available via add-ons",
            "Keyboard layouts with built-in prediction and multi-modal access options",
        ],
        conversionTips: [
            "Export gridset bundle and PDFs to maintain visual references before conversion.",
            "When moving to systems without bundle import, use CSV export to recreate vocabulary.",
            "Retain home/back placement (often bottom-left/bottom-right) to preserve motor plans.",
        ],
    },
    {
        system: "TouchChat",
        gridRange: { minRows: 2, maxRows: 8, minColumns: 4, maxColumns: 12 },
        supportedSymbols: ["SymbolStix", "PCS", "Text-only"],
        importFormats: ["TouchChat Profile (.mwz)", "CSV (vocabulary)", "iShare community sets"],
        exportFormats: ["TouchChat Profile (.mwz)", "CSV"],
        notableFeatures: [
            "Supports social scripts and activity pages linked to home grid",
            "MultiChat and WordPower sets leverage pragmatic starters and verb morphing",
            "Allows photo import for custom nouns and people",
        ],
        conversionTips: [
            "Export the .mwz profile and CSV to preserve both layout and vocabulary groups.",
            "If importing into non-TouchChat systems, keep left-column navigation and top-row pronouns consistent.",
            "Check symbol licensing if moving PCS-heavy pagesets into SymbolStix-first environments.",
        ],
    },
    {
        system: "Proloquo2Go",
        gridRange: { minRows: 2, maxRows: 8, minColumns: 4, maxColumns: 10 },
        supportedSymbols: ["SymbolStix", "Text-only"],
        importFormats: ["P2G Backup (.p2gbk)", "CSV (vocabulary)"],
        exportFormats: ["P2G Backup (.p2gbk)", "CSV"],
        notableFeatures: [
            "Motor-plan focused Crescendo vocabulary with grammar popups",
            "Supports bilingual setups with linked pages",
            "Grid resizing retains placement of high-frequency core words",
        ],
        conversionTips: [
            "Export a backup (.p2gbk) plus CSV to preserve both layout and vocabulary.",
            "Map grammar popups (verb tenses, pronouns) to equivalent morphology tools in the destination system.",
            "Ensure target grids keep pronouns/helping verbs in consistent locations when resizing.",
        ],
    },
];

export function findSystemProfile(system: string | undefined) {
    if (!system) return undefined;
    return AAC_SYSTEMS.find((entry) => entry.system.toLowerCase() === system.toLowerCase());
}
