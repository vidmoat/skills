# AMV and stylised fan edits

Read this for anime music videos, phonk, shake, glitch or aesthetic fan edits. Fan edits are maximalist on purpose, but structured.

1. **Cut fast on the track:** measured beats, `addMarkers`, one `sliceClip` on them; 0.3 to 1 s a shot through hype sections.
2. **Stylise on impacts:** `addEffect` "rgb-split" or "chromatic-aberration" on hits, "glow" or "bloom" for overexposed highlights, "film-grain" or "vhs" for texture.
3. **Transitions are part of the style here** (unlike cinematic work): "glitch", "flash", "zoom-blur", "whip-pan", 0.1 to 0.25 s, on the beat.
4. **Motion:** `applyCameraShake` on hits, `punchIn` pulses, `applyMotionPreset` "pulse" on text.
5. **Colour:** high contrast and pushed saturation (`applyFilterPreset` "Neon", "Vivid" or "Moody"). This is the one genre where over-saturation is correct.
6. **Text sparingly and huge:** 2 to 4 words, `applyMotionPreset` "elastic-pop", timed to a hit.
7. **Keep the best moment for the final drop** and end ON it, not after it.
