import { Resource } from "fastmcp";

const resource: Resource = {
    name: "Application Logs",
    description: "Get the latest application logs.",
    uri: "file:///logs/app.log",
    mimeType: "text/plain",
    load: async () => {
        return {
            text: "[info]: application started",
        };
    },
};

export default resource;
