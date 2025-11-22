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
    layoutStyle?: string;
    accessNotes?: string[];
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
        layoutStyle: "Keyboard-centric with phrase banks and navigation on left/right edges",
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
        layoutStyle: "Top-row pronouns, left-column navigation, with verb morphing popups",
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
        layoutStyle: "Category folders with consistent color coding and photo-friendly noun spots",
        accessNotes: [
            "Ideal for touch access with ample target size; consider keyguards when expanding grid density.",
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
        layoutStyle: "8x8 core with grammar popups and color-coded parts of speech",
        accessNotes: ["Works well with keyguards; consider hold-to-select settings for motor planning."],
    },
    {
        system: "TD Snap",
        pageset: "Core First 60",
        description: "Core-driven layout with topic links and symbol-supported literacy tools.",
        defaultGrid: { rows: 6, columns: 10 },
        symbolLibraries: ["PCS"],
        typicalUseCases: [
            "Mixed core/fringe navigation with access to behavior supports",
            "Literacy support via topic word lists and quick phrases",
            "Shared vocabulary alignment with Boardmaker-based classrooms",
        ],
        conversionNotes: [
            "Keep top-row pragmatic phrases (I want, I need, I like) when moving to other symbol sets.",
            "Map behavior regulation buttons (stop, wait, break) to a consistent row on the target grid.",
        ],
        layoutStyle: "Top-row pragmatic starters with PCS symbols and linked topic folders",
    },
    {
        system: "TD Snap",
        pageset: "PODD 60 Expanded",
        description: "Page-based pragmatic organization with consistent navigation paths for partner-supported use.",
        defaultGrid: { rows: 6, columns: 10 },
        symbolLibraries: ["PCS"],
        typicalUseCases: [
            "Partner-supported scanning or direct touch",
            "Scripted pragmatic pathways (e.g., greetings, requests, comments)",
            "Learners who benefit from predictable navigation links",
        ],
        conversionNotes: [
            "Preserve navigation pathways (e.g., go to feelings, go to comments) with clear home/back labels.",
            "When converting to grid-based systems, pin navigation buttons and replicate pathway order for familiarity.",
        ],
        layoutStyle: "Page-based pragmatic branches with home/back persistent buttons",
        accessNotes: ["Add auditory prompts for partner-assisted scanning when porting to other apps."],
    },
    {
        system: "LAMP Words for Life",
        pageset: "Full 84",
        description: "Motor-planned 84-location layout emphasizing consistent verb and noun locations.",
        defaultGrid: { rows: 7, columns: 12 },
        symbolLibraries: ["SymbolStix"],
        typicalUseCases: [
            "Autonomy-focused communicators building motor memory",
            "Robust verb + noun combinations with minimal navigation",
            "Learners who benefit from reduced navigation depth",
        ],
        conversionNotes: [
            "Preserve verb positions when migrating; verbs often anchor two-hit sequences.",
            "Avoid rearranging core positions even when resizing; use masking/keyguards instead of moving icons.",
        ],
        layoutStyle: "Motor-plan stable grid with minimal navigation and consistent verb anchors",
        accessNotes: ["Pair with keyguards or consistent dwell settings to protect motor patterns."],
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
