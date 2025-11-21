import { Resource } from "fastmcp";

import { AAC_PAGESETS } from "../data/aacPagesets.js";

const resource: Resource = {
    name: "AAC Pagesets",
    description: "Catalog of AAC pagesets with grid defaults, symbol libraries, and conversion notes.",
    uri: "memory://aac-pagesets",
    mimeType: "application/json",
    load: async () => {
        return {
            text: JSON.stringify(
                AAC_PAGESETS.map((entry) => ({
                    system: entry.system,
                    pageset: entry.pageset,
                    description: entry.description,
                    defaultGrid: entry.defaultGrid,
                    symbolLibraries: entry.symbolLibraries,
                    typicalUseCases: entry.typicalUseCases,
                    conversionNotes: entry.conversionNotes,
                })),
                null,
                2,
            ),
        };
    },
};

export default resource;
