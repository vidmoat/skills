# Generation providers

Read this before choosing a provider for `generateMedia` or the standalone generate_image / generate_video tools.

- **Grok** (video default): text or first-frame, optional references, audio, 480p or 720p.
- **Alibaba HappyHorse** (provider `qwen`): picks text, first-frame or reference mode from the optional inputs; 3 to 15 s; up to 1080p; no extension or audio control; omit `aspectRatio` in first-frame mode.
- **Alibaba Wan 3.0** (provider `wan`): text, first-frame, references and audio; 2 to 15 s; up to 1080p.
- References differ by surface. MCP `generate_video`: up to 7 reference images. MCP `generate_image`: up to 5. In the editor, `generateMedia` takes `referenceUrls` for images only, up to 5; an in-editor video takes no references, only a first-frame `imageUrl`. References and a first-frame `imageUrl` are mutually exclusive.
- **Google Vertex** supports image generation and optional references via Gemini. Do not use Google video models.
- Use provider `auto` only when the user has no explicit model choice. A configured chat provider does not imply image or video generation support.
- Check availability and quote the selected model, resolution and duration before spending.
