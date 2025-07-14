import { FastMCP } from "fastmcp";

import explainCodePrompt from "./prompts/explain-code.js";
import gitCommitPrompt from "./prompts/git-commit.js";
import logsResource from "./resources/logs.js";
import sumTool from "./tools/sum.js";

const server = new FastMCP({
    name: "Example Server",
    version: "1.0.0",
});

// prompts
server.addPrompt(explainCodePrompt);
server.addPrompt(gitCommitPrompt);

// resources
server.addResource(logsResource);

// tools
server.addTool(sumTool);

server.start({
    transportType: "httpStream",
    httpStream: {
        port: 3000,
    },
});
