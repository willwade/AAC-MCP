import { InputPrompt } from "fastmcp";

const prompt: InputPrompt = {
    name: "explain-code",
    description: "Explain how code works",
    arguments: [
        {
            name: "code",
            description: "Code to explain",
            required: true,
        },
        {
            name: "language",
            description: "Programming language",
            required: false,
        },
    ],
    load: async (args) => {
        return `Explain how this ${ args.language || "Unknown" } code works:\n\n${ args.code }`;
    },
};

export default prompt;
