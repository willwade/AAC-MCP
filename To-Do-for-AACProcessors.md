# AAC Processor To-Do and Feasibility Notes

## What is possible today
- **Vocabulary planning for custom grids**: LLM-backed prompts can generate topic and word lists for requests such as "TD Snap pageset with 64 buttons about the monarch of the UK" and can split vocabulary across multiple pages. Output is text/JSON that still needs an importer per AAC app.
- **CSV/text normalization**: We can accept CSV/TXT lists and restructure them to match a target grid size or symbol set for systems that allow CSV import.
- **Vendor pageset ingestion and navigation lookup**: AACProcessors-node can parse TD Snap (`.snapp`), Grid for iPad (`.gridset`), Proloquo2Go (`.obz`), and Boardmaker (`.bms`/`.bmz`) archives, exposing navigation graphs and button metadata that enable path finding and vocabulary audits.
- **Theme and color extraction**: AACProcessors-node surfaces style/color tokens from supported vendor bundles, so suggested contrast palettes can be generated from the existing theme.

## What needs implementation
- **MCP wiring to AACProcessors-node**: The MCP server still needs tool functions that call AACProcessors-node for parsing, path lookup, and style extraction, then return JSON paths and metadata to clients.
- **Motor-plan alignment**: Needs structured grid layouts from parsed files to generate slot-to-slot mappings when resizing or converting pagesets. Layouts are available from AACProcessors-node; mapping logic should use them.
- **High-contrast conversion**: Requires applying updated palettes back to vendor bundles using the extracted theme tokens; the MCP should emit a preview or patch file for review.
- **Auditory prompt packaging**: Needs per-vendor packaging rules to pair recorded prompts with buttons for partner-assisted scanning.
- **Preview simulator**: Needs a rendering stub that can show low-fidelity previews of converted pages, especially for constrained or wearable targets.

## Investigation notes
- Vendor bundle parsing is available via AACProcessors-node; we should depend on it instead of claiming format specs are missing.
- High-contrast conversions should respect accessible color contrast guidelines (WCAG) and preserve motor plans; automated edits must expose a diff for human review.
