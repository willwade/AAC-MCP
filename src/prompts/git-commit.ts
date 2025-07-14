import { InputPrompt } from "fastmcp";

const prompt: InputPrompt = {
    name: "git-commit",
    description: "Generate a Git commit message",
    arguments: [
        {
            name: "changes",
            description: "Git diff or description of changes",
            required: true,
        },
    ],
    load: async (args) => {
        return `Generate a concise but descriptive commit message for these changes:\n\n${ args.changes }`;
    },
};

export default prompt;
