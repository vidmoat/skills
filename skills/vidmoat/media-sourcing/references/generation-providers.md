# Generation providers

Read this before choosing a provider for `generateMedia` or the standalone generate_image / generate_video tools.

- **Grok** (video default): optional character references, up to 720p.
- **Alibaba HappyHorse** (provider `qwen`): picks text, first-frame or reference mode from the optional inputs; 3 to 15 s; up to 1080p; no extension or audio control.
- **Alibaba Wan 3.0** (provider `wan`): text, first-frame, references and audio; 2 to 15 s here; up to 1080p.
- All video providers accept up to seven optional references here. References and a first-frame `imageUrl` are mutually exclusive.
- **Google Vertex** supports image generation and optional references via Gemini. It is not automatically free because credits exist. Do not use Google video models.
- Use provider `auto` only when the user has no explicit model choice. A configured chat provider does not imply image or video generation support.
- Check availability and quote the selected model, resolution and duration before spending.
