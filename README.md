# MCP Server

A TypeScript template repository for creating [Model Context Protocol (MCP)](https://modelcontextprotocol.io) servers with support for both stdio (Standard Input/Output) and SSE (Server-Sent Events) transports. This template provides a solid foundation for building MCP servers with a well-organized structure and essential features.

## Features

- 🚀 Built with TypeScript for type safety and better developer experience
- 🔄 Supports both stdio and SSE [transports](https://modelcontextprotocol.io/docs/concepts/transports)
- 📦 Includes example prompts, resources, and tools
- ⚡ Uses [FastMCP](https://www.npmjs.com/package/fastmcp) for rapid development

## Prerequisites

- [Node.js](https://nodejs.org/)
- npm or yarn package manager

## Getting Started

1. **Create a repo from this template**

   Click **Use this template** > **Create a new repository**

   ![screenshot](https://i.postimg.cc/vZpK09SS/Screenshot-2025-05-31-005810.png)

1. **Clone your repository**
   ```bash
   git clone https://github.com/iamtraction/node-mcp-server.git
   cd node-mcp-server
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start development server**
   ```bash
   npm run dev
   ```

## Project Structure

```
src/
├── prompts/     # MCP prompts
├── resources/   # MCP resources
├── tools/       # MCP tools
└── server.ts    # Main server file
```

## Available Scripts

- `npm run dev` - Start development server with hot reload
- `npm run build` - Build the TypeScript code
- `npm run start` - Start the production server
- `npm run watch` - Watch for TypeScript changes
- `npm run lint` - Run ESLint to check code quality and style

## Adding New Features

### Adding a Prompt

Create a new file in `src/prompts/` and add it to `server.ts`. Learn more about [MCP Prompts](https://modelcontextprotocol.io/docs/concepts/prompts):

```typescript
import myPrompt from "./prompts/my-prompt.js";
server.addPrompt(myPrompt);
```

### Adding a Resource

Create a new file in `src/resources/` and add it to `server.ts`. Learn more about [MCP Resources](https://modelcontextprotocol.io/docs/concepts/resources):

```typescript
import myResource from "./resources/my-resource.js";
server.addResource(myResource);
```

### Adding a Tool

Create a new file in `src/tools/` and add it to `server.ts`. Learn more about [MCP Tools](https://modelcontextprotocol.io/docs/concepts/tools):

```typescript
import myTool from "./tools/my-tool.js";
server.addTool(myTool);
```

## Configuration

The server can be configured in `server.ts`. By default, it runs on port 3000 with SSE transport. You can modify the configuration in the `server.start()` options.:

```typescript
server.start({
    transportType: "httpStream", // or "stdio"
    httpStream: {
        port: 3000,
    },
});
```

Learn more about [Transports](https://modelcontextprotocol.io/docs/concepts/transports).

## Using the MCP Server

#### stdio Server Setup
```json
{
    "mcpServers": {
        "example-server": {
            "command": "node",
            "args": [ "dist/server.js" ]
         }
    }
}
```

#### SSE Server Setup
```json
{
    "mcpServers": {
        "example-server": {
            "url": "https://example-server.com/sse"
         }
    }
}
```

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## Showcase

Have you built something cool with this template? Add it to the showcase!

<!-- Add your project here -->

> To add your project to the showcase:
>
> 1. Edit this README.md file
> 2. Add your project to the list above using this format:
>    ```markdown
>    - [Your Project Name](link-to-your-project) - Brief description
>    ```
> 3. Submit a pull request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Acknowledgments

- [Model Context Protocol](https://modelcontextprotocol.io/) - The protocol specification
- [MCP TypeScript SDK](https://github.com/modelcontextprotocol/typescript-sdk) - The official TypeScript SDK
- [FastMCP](https://www.npmjs.com/package/fastmcp) - The underlying MCP framework
