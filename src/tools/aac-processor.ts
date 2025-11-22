import { Tool } from "fastmcp";
import { z } from "zod";

import { AAC_PROCESSORS } from "../data/aacProcessors.js";

const parameters = z.object({
    model: z.string().describe("Exact AAC processor model to inspect").optional(),
    manufacturer: z.string().describe("Filter by manufacturer").optional(),
    minChannels: z.number().int().nonnegative().describe("Minimum supported channels").optional(),
    minBitrateKbps: z.number().int().nonnegative().describe("Minimum supported bitrate in kbps").optional(),
    task: z
        .string()
        .describe("Filter for processors that list a supported task by name (e.g., Vocabulary planner)")
        .optional(),
    taskStatus: z
        .enum(["available", "planned", "needs-research"])
        .describe("Filter tasks by readiness level")
        .optional(),
    acceptsFile: z
        .string()
        .describe("Filter processors by a file extension or format they can ingest (e.g., .snapp, CSV)")
        .optional(),
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
        const filtered = AAC_PROCESSORS.map((processor) => {
            if (args.model && processor.model.toLowerCase() !== args.model.toLowerCase()) {
                return undefined;
            }

            if (
                args.manufacturer &&
                processor.manufacturer.toLowerCase() !== args.manufacturer.toLowerCase()
            ) {
                return undefined;
            }

            if (args.minChannels !== undefined && processor.maxChannels < args.minChannels) {
                return undefined;
            }

            if (args.minBitrateKbps !== undefined && processor.maxBitrateKbps < args.minBitrateKbps) {
                return undefined;
            }

            if (args.acceptsFile) {
                const matchesFile = processor.fileInputs?.some((format) =>
                    format.toLowerCase().includes(args.acceptsFile!.toLowerCase()),
                );

                if (!matchesFile) {
                    return undefined;
                }
            }

            const tasks = processor.supportedTasks.filter((task) => {
                const matchesName = args.task
                    ? task.name.toLowerCase().includes(args.task.toLowerCase())
                    : true;
                const matchesStatus = args.taskStatus ? task.status === args.taskStatus : true;
                return matchesName && matchesStatus;
            });

            if (args.task && tasks.length === 0) {
                return undefined;
            }

            return {
                ...processor,
                supportedTasks: tasks.length > 0 ? tasks : processor.supportedTasks,
            };
        }).filter(Boolean);

        if (filtered.length === 0) {
            return "No AAC processors matched your criteria.";
        }

        return JSON.stringify(filtered, null, 2);
    },
};

export default tool;
