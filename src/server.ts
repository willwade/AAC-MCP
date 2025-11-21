import { FastMCP } from "fastmcp";

import explainCodePrompt from "./prompts/explain-code.js";
import gitCommitPrompt from "./prompts/git-commit.js";
import aacProcessorsResource from "./resources/aac-processors.js";
import aacPagesetsResource from "./resources/aac-pagesets.js";
import logsResource from "./resources/logs.js";
import aacProcessorTool from "./tools/aac-processor.js";
import aacPagesetConverterTool from "./tools/aac-pageset-converter.js";
import sumTool from "./tools/sum.js";

const server = new FastMCP({
    name: "Example Server",
    version: "1.0.0",
});

// prompts
server.addPrompt(explainCodePrompt);
server.addPrompt(gitCommitPrompt);

// resources
server.addResource(aacProcessorsResource);
server.addResource(aacPagesetsResource);
server.addResource(logsResource);

// tools
server.addTool(aacProcessorTool);
server.addTool(aacPagesetConverterTool);
server.addTool(sumTool);

server.start({
    transportType: "httpStream",
    httpStream: {
        port: 3000,
    },
});
