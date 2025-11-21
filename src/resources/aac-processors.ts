import { Resource } from "fastmcp";
import { AAC_PROCESSORS } from "../data/aacProcessors.js";

const resource: Resource = {
    name: "AAC Processors",
    description: "Catalog of AAC-focused processors available to this project.",
    uri: "memory://aac-processors",
    mimeType: "application/json",
    load: async () => {
        return {
            text: JSON.stringify(
                AAC_PROCESSORS.map((processor) => ({
                    model: processor.model,
                    manufacturer: processor.manufacturer,
                    maxChannels: processor.maxChannels,
                    maxBitrateKbps: processor.maxBitrateKbps,
                    optimizedFor: processor.optimizedFor,
                })),
                null,
                2,
            ),
        };
    },
};

export default resource;
