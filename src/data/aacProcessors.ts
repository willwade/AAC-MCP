export type AacProcessorTask = {
    name: string;
    description: string;
    inputs: string[];
    outputs: string[];
    status: "available" | "planned" | "needs-research";
    notes?: string[];
};

export type AacProcessor = {
    model: string;
    manufacturer: string;
    maxChannels: number;
    maxBitrateKbps: number;
    optimizedFor: string;
    fileInputs?: string[];
    supportedTasks: AacProcessorTask[];
};

export const AAC_PROCESSORS: AacProcessor[] = [
    {
        model: "Helix-X2",
        manufacturer: "Acousto Labs",
        maxChannels: 8,
        maxBitrateKbps: 512,
        optimizedFor: "Low-latency streaming and conversational agents",
        fileInputs: [
            ".gridset",
            ".snapp",
            ".obz",
            "Boardmaker .bms/.bmz",
            "JSON exports",
            "AACProcessors-node parsed JSON",
        ],
        supportedTasks: [
            {
                name: "Vocabulary planner",
                description:
                    "Generate topic/vocabulary lists for custom pages (e.g., TD Snap 64-button monarchy grid) and group them across multiple pages if required.",
                inputs: ["User prompt", "Target grid size", "Symbol set preference"],
                outputs: ["Page-by-page vocabulary list", "Navigation and folder plan"],
                status: "available",
                notes: ["LLM-powered; requires downstream import script for each AAC app."],
            },
            {
                name: "Pageset path finder",
                description:
                    "Parse supplied pageset files to locate navigation paths to target words across vendor formats.",
                inputs: ["Uploaded pageset bundles", "Word list"],
                outputs: ["Paths for each word with page/button coordinates"],
                status: "available",
                notes: [
                    "Backed by AACProcessors-node parsing for TD Snap (.snapp), Grid (.gridset), Proloquo2Go (.obz), and Boardmaker archives.",
                    "MCP tool should call the parser and return navigation graphs instead of placeholder text.",
                ],
            },
            {
                name: "High-contrast transformer",
                description: "Propose color/contrast changes and style tokens for a supplied pageset file.",
                inputs: ["Pageset bundle", "Current color map"],
                outputs: ["Suggested color palette", "Updated style tokens"],
                status: "planned",
                notes: [
                    "AACProcessors-node exposes theme/color tokens; MCP needs to emit patched bundles or diffs using those tokens.",
                    "Respect WCAG contrast while preserving motor plans and navigation cues.",
                ],
            },
        ],
    },
    {
        model: "Cortex-Audio 940",
        manufacturer: "SignalForge",
        maxChannels: 6,
        maxBitrateKbps: 384,
        optimizedFor: "On-device AAC rendering in constrained environments",
        fileInputs: ["Text/CSV vocabulary exports", "JSON page graphs"],
        supportedTasks: [
            {
                name: "Import/export normalizer",
                description:
                    "Normalize CSV/TXT vocabulary exports and align them to target grid dimensions or symbol libraries.",
                inputs: ["CSV/TXT word lists", "Grid dimensions", "Symbol set"],
                outputs: ["Normalized CSV", "Page layout suggestions"],
                status: "available",
                notes: ["Suited for pipeline steps prior to import into apps that accept CSV uploads."],
            },
            {
                name: "Motor-plan alignment",
                description: "Compare source and target grids and propose slot-to-slot mappings to preserve motor plans.",
                inputs: ["Source grid definition", "Target grid definition"],
                outputs: ["Mapping table", "Warnings about conflicts"],
                status: "planned",
                notes: [
                    "Grid layouts are available from AACProcessors-node parses; implement mapping logic using parsed coordinates and navigation links.",
                ],
            },
        ],
    },
    {
        model: "PulseWave M3",
        manufacturer: "Northwind DSP",
        maxChannels: 10,
        maxBitrateKbps: 640,
        optimizedFor: "High-fidelity multi-room playback",
        fileInputs: ["Audio prompts", "Recorded partner speech"],
        supportedTasks: [
            {
                name: "Auditory prompt packager",
                description:
                    "Bundle auditory prompts or partner-assisted scanning cues for pagesets that support audio overlays.",
                inputs: ["Prompt audio files", "Page navigation plan"],
                outputs: ["Folder-ready audio set", "Association map per button"],
                status: "planned",
                notes: ["Needs per-vendor packaging rules (file names, metadata)."],
            },
        ],
    },
    {
        model: "VectorTone S1",
        manufacturer: "Aurora Micro",
        maxChannels: 4,
        maxBitrateKbps: 256,
        optimizedFor: "Battery-sensitive AAC processing for wearables",
        fileInputs: ["Lightweight JSON pages", "Color tokens"],
        supportedTasks: [
            {
                name: "Preview simulator",
                description:
                    "Generate low-fidelity previews of converted pages for quick review on constrained devices.",
                inputs: ["JSON page graph", "Color tokens", "Grid dimensions"],
                outputs: ["Preview-friendly JSON", "Diff of style changes"],
                status: "needs-research",
                notes: ["Simulator stub exists; rendering pipeline not implemented."],
            },
        ],
    },
];
