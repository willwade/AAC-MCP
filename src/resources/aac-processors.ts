import { Resource } from "fastmcp";
import { AAC_PROCESSORS } from "../data/aacProcessors.js";

const resource: Resource = {
    name: "AAC Processors",
    description: "Catalog of AAC-focused processors available to this project, including task readiness and file support.",
    uri: "memory://aac-processors",
    mimeType: "application/json",
    load: async () => {
        return {
            text: JSON.stringify(AAC_PROCESSORS, null, 2),
        };
    },
};

export default resource;
