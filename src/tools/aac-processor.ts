import { Tool } from "fastmcp";
import { z } from "zod";

import { AAC_PROCESSORS } from "../data/aacProcessors.js";

const parameters = z.object({
    model: z.string().describe("Exact AAC processor model to inspect").optional(),
    manufacturer: z.string().describe("Filter by manufacturer").optional(),
    minChannels: z.number().int().nonnegative().describe("Minimum supported channels").optional(),
    minBitrateKbps: z.number().int().nonnegative().describe("Minimum supported bitrate in kbps").optional(),
});

const tool: Tool<undefined, typeof parameters> = {
    name: "aac_processor_lookup",
    description: "Filter and inspect AAC processor capabilities for this project.",
    annotations: {
        title: "AAC Processor Lookup",
        openWorldHint: false,
        readOnlyHint: true,
    },
    parameters,
    execute: async (args) => {
        const filtered = AAC_PROCESSORS.filter((processor) => {
            if (args.model && processor.model.toLowerCase() !== args.model.toLowerCase()) {
                return false;
            }

            if (
                args.manufacturer &&
                processor.manufacturer.toLowerCase() !== args.manufacturer.toLowerCase()
            ) {
                return false;
            }

            if (args.minChannels !== undefined && processor.maxChannels < args.minChannels) {
                return false;
            }

            if (args.minBitrateKbps !== undefined && processor.maxBitrateKbps < args.minBitrateKbps) {
                return false;
            }

            return true;
        });

        if (filtered.length === 0) {
            return "No AAC processors matched your criteria.";
        }

        return JSON.stringify(filtered, null, 2);
    },
};

export default tool;
