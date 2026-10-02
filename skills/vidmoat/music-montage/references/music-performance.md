# Music video, performance and lyric video

Read this when the footage is a band, singer, rapper, DJ set, concert or studio session, or the user wants a lyric video.

- **Beat grid first.** Measured beats from `audio_inspect`, then `addMarkers` with those timeline times and one `sliceClip` with `times` on them. Every cut lands on a beat or a deliberate off-beat.
- **Performance sync beats variety.** Keep the vocal shot on screen through the hook; cut away in instrumental space. Lip sync within one frame.
- **Density follows the song:** verses about one cut a bar, choruses one a beat or half-beat, and against a drop hold ONE shot for a full phrase.
- **Lyric text** (only when wanted): one `addTitle` or `addTextClip` per line timed to the line with `applyMotionPreset` "elastic-pop" or "pulse", or `addCaptions` preset "Karaoke" for word-level timing. Lyrics come from `audio_inspect` with `listenFor:"lyrics"` and stay `[unclear]` where unclear; never complete a song from memory.
- **Look:** a music video is a stylised form. `applyFilterPreset` "Neon", "Moody" or "Noir" by genre, `addEffect` "bloom" on lights or "film-grain" for texture, kept low.
- **The track is the content:** do not duck it. Only duck it under a spoken intro.
- **End on the final beat**, never on a fade over a sustained note.
