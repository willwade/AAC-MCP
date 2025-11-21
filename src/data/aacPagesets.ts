export type AacPageset = {
    system: string;
    pageset: string;
    description: string;
    defaultGrid: {
        rows: number;
        columns: number;
    };
    symbolLibraries: string[];
    typicalUseCases: string[];
    conversionNotes: string[];
};

export const AAC_PAGESETS: AacPageset[] = [
    {
        system: "Grid for iPad",
        pageset: "Super Core 50",
        description:
            "Balanced core + fringe layout with consistent motor planning and navigation for daily communication.",
        defaultGrid: { rows: 5, columns: 10 },
        symbolLibraries: ["SymbolStix", "PCS"],
        typicalUseCases: [
            "Core-driven phrase construction",
            "Quick access to fringe folders for topics like food, places, and people",
            "Navigation-first access model with home and back buttons in fixed locations",
        ],
        conversionNotes: [
            "Preserve bottom-row navigation buttons to maintain motor plans when moving to other systems.",
            "Map color coding (Fitzgerald/Modified Fitzgerald) to the closest option on the target system.",
        ],
    },
    {
        system: "Grid for iPad",
        pageset: "Text Talker",
        description: "Text-first grid with phrase banks and rapid message building for literate communicators.",
        defaultGrid: { rows: 6, columns: 10 },
        symbolLibraries: ["SymbolStix", "Text-only"],
        typicalUseCases: [
            "Keyboard access with next-word prediction",
            "Message history and stored phrases for rapid retrieval",
            "Custom topic folders for situational vocabulary",
        ],
        conversionNotes: [
            "Keep keyboard row spacing consistent when moving to other apps with different prediction layouts.",
            "Export phrase banks as CSV or TXT where available before importing into the new system.",
        ],
    },
    {
        system: "TouchChat",
        pageset: "WordPower 60 Basic",
        description: "High-frequency core with pragmatic starters and linked activity pages.",
        defaultGrid: { rows: 6, columns: 10 },
        symbolLibraries: ["SymbolStix"],
        typicalUseCases: [
            "Pragmatic starters (I want, I need, I like) paired with core",
            "Activity-specific pages tied to the core home grid",
            "Verb morphing via linked buttons and modifier cells",
        ],
        conversionNotes: [
            "Preserve left-column navigation and top-row pronouns to keep motor plans consistent.",
            "When converting to PCS-only systems, remap SymbolStix graphics to PCS equivalents or text labels.",
        ],
    },
    {
        system: "TouchChat",
        pageset: "MultiChat 15",
        description: "Category-driven layout with 15-cell grid and age-specific vocabulary options.",
        defaultGrid: { rows: 3, columns: 5 },
        symbolLibraries: ["PCS"],
        typicalUseCases: [
            "Emergent communicators who need clear category organization",
            "School routines, social scripts, and topic pages",
            "Easy photo integration for personalized nouns",
        ],
        conversionNotes: [
            "When moving to larger grids, keep category colors consistent to reduce relearning.",
            "Add return-to-home buttons if the target system lacks a persistent home icon.",
        ],
    },
    {
        system: "Proloquo2Go",
        pageset: "Crescendo 64",
        description: "Motor-plan stable 64-location grid with robust core and grammar support.",
        defaultGrid: { rows: 8, columns: 8 },
        symbolLibraries: ["SymbolStix", "Text-only"],
        typicalUseCases: [
            "Grammar-rich sentences with verb inflections",
            "Consistent icon placement for automaticity",
            "Customizable fringe folders with color coding",
        ],
        conversionNotes: [
            "Match grammar popups (verb tenses, pronouns) to equivalent morphological tools in the target system.",
            "Preserve location of high-frequency core (pronouns, verbs, helping verbs) when resizing grids.",
        ],
    },
];

export function findPagesetsBySystem(system: string) {
    return AAC_PAGESETS.filter((entry) => entry.system.toLowerCase() === system.toLowerCase());
}

export function findPageset(system: string | undefined, pageset: string | undefined) {
    if (!system && !pageset) return undefined;

    return AAC_PAGESETS.find((entry) => {
        const matchesSystem = system
            ? entry.system.toLowerCase() === system.toLowerCase()
            : true;
        const matchesPageset = pageset ? entry.pageset.toLowerCase() === pageset.toLowerCase() : true;
        return matchesSystem && matchesPageset;
    });
}
