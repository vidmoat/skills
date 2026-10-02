# Named looks

Read this when the user names a look. Every look goes over balanced, matched shots, at a strength that keeps skin natural. An adjustment layer carries only the tonal part (brightness, exposure, contrast, saturation, highlights, shadows, sharpen, vignette); colour (white balance, lift, gamma, gain, LUTs) and effects render only when applied to the clips themselves.

| look | how |
|---|---|
| Teal and orange | Per clip: `applyFilterPreset` "teal-and-orange" (LUT, `intensity` 0 to 1) or `applyVfxPreset` "teal-orange". By hand: `setColor` `lift` toward cyan, about [0, 0.02, 0.045], for the shadows and `gain` warm, about [1.05, 1.0, 0.97], for the highlights (the Teal preset's values), contrast about 110 to 120, saturation about 105. Lift barely touches midtone skin; never a global hue or tint. |
| Film or cinematic | `applyFilterPreset` "Cinematic", "warm-film", "Moody" or "Noir" on each clip as the base, then contrast about 112 and saturation about 92 (these two can sit on an adjustment layer). Film reads LESS saturated and MORE contrasted, not more colourful. |
| Matte or faded | `setColor` `lift` from about [0.05, 0.05, 0.05] to [0.08, 0.08, 0.08] (blacks at 5 to 8%) with contrast about 92, or `applyFilterPreset` "faded-matte", "Matte" or "Fade". The lifted-black milkiness is what separates faded from dark. |
| Bleach bypass | `applyFilterPreset` "bleach-bypass": raised contrast, crushed saturation. |
| Day for night | Per clip: `setColor` temperature cool (-25 to -40), brightness about 70, saturation about 80, contrast about 115; `addEffect` "cool" to go further. Keep faces readable; too dark reads as a mistake. |
| Grain, halation, analog | `addEffect` on the clips: "film-grain" for texture, "bloom" or "glow" for halation, "light-leak" for flare, "vhs", "crt" or "scanlines" for period. Keep intensity low: felt, not seen. |
| Lens character | `addEffect` "chromatic-aberration" (subtle) or "rgb-split" (stylised); "fisheye" for wide-lens distortion. |
| Vignette | `setColor` `vignette` 0 to 1 on the adjustment layer (0.3 normal, above 0.45 heavy). |
| Letterbox | `setProjectSettings` aspectRatio "21:9", or two black `addShapeClip` bars of 10 to 12% height top and bottom across the timeline. Only when asked: a cinematic request does not change the aspect ratio. |
| Black and white | `applyFilterPreset` "B&W", "Noir" or "mono-contrast". |

Presets available: Cinematic, Teal, Vintage, B&W, Noir, Warm, Cool, Golden, Retro, HDR, Viral, Neon, Fade, Vivid, Pastel, Matte, Moody, Blockbuster, and the LUTs teal-and-orange, warm-film, cool-clean, bleach-bypass, golden-hour, faded-matte, mono-contrast, punch. A preset applied to an adjustment layer keeps only its tonal fields; most presets also set temperature, lift or gain, which render only on clips.
