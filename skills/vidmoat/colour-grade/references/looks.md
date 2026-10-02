# Named looks

Read this when the user names a look. Every look goes on an adjustment layer over balanced, matched shots, at a strength that keeps skin natural.

| look | how |
|---|---|
| Teal and orange | `applyFilterPreset` "teal-and-orange" (LUT, `intensity` 0 to 1) or `applyVfxPreset` "teal-orange". By hand: `setColor` temperature slightly warm (+8 to +15) for skin, shadows cooled (-10 to -20), contrast about 110 to 120, saturation about 105. Shadows toward cyan, skin protected; never a global tint. |
| Film or cinematic | `applyFilterPreset` "Cinematic", "warm-film", "Moody" or "Noir" as the base, then contrast about 112 and saturation about 92. Film reads LESS saturated and MORE contrasted, not more colourful. |
| Matte or faded | `setColor` shadows raised (+10 to +25) with contrast about 92, or `applyFilterPreset` "faded-matte" / "Matte" / "Fade". The lifted-black milkiness is what separates faded from dark. |
| Bleach bypass | `applyFilterPreset` "bleach-bypass": raised contrast, crushed saturation. |
| Day for night | `setColor` brightness about 70, temperature cool (-25 to -40), saturation about 80, contrast about 115; `addEffect` "cool" to go further. Keep faces readable; too dark reads as a mistake. |
| Grain, halation, analog | `addEffect` "film-grain" for texture, "bloom" or "glow" for halation, "light-leak" for flare, "vhs", "crt" or "scanlines" for period. Keep intensity low: felt, not seen. |
| Lens character | `addEffect` "chromatic-aberration" (subtle) or "rgb-split" (stylised); "fisheye" for wide-lens distortion. |
| Vignette | `setColor` `vignette` 0 to 1 on the adjustment layer (0.3 normal, above 0.45 heavy). |
| Letterbox | `setProjectSettings` aspectRatio "21:9", or two black `addShapeClip` bars of 10 to 12% height top and bottom across the timeline. Only when asked: a cinematic request does not change the aspect ratio. |
| Black and white | `applyFilterPreset` "B&W", "Noir" or "mono-contrast". |

Presets available: Cinematic, Teal, Vintage, B&W, Noir, Warm, Cool, Golden, Retro, HDR, Viral, Neon, Fade, Vivid, Pastel, Matte, Moody, Blockbuster, and the LUTs teal-and-orange, warm-film, cool-clean, bleach-bypass, golden-hour, faded-matte, mono-contrast, punch.
