import { Tool } from "fastmcp";
import { z } from "zod";

const parameters = z.object({
    a: z.number().describe("The first number"),
    b: z.number().describe("The second number"),
});

const tool: Tool<undefined, typeof parameters> = {
    name: "calculate_sum",
    description: "Add two numbers together",
    annotations: {
        title: "Calculate Sum",
        openWorldHint: false,
        readOnlyHint: true,
    },
    parameters,
    execute: async (args) => {
        return String(args.a + args.b);
    },
};

export default tool;
