---
name: audio-cleanup
description: "Diagnosing and fixing voice and source audio: the right control for hiss, rumble, hum and room tone, levels and EQ. Use when audio is noisy, muffled, too quiet or too loud, or the user asks to clean up the sound."
license: Apache-2.0 (scripts) and CC-BY-4.0 (text); see LICENSE
metadata:
  version: "1.0.0"
  owner: "vidmoat"
  category: "craft"
---

# Audio cleanup

Audio is half the perceived production value. Diagnose before treating: noise, level and balance have different fixes, and applying all three blindly makes it worse.

## Workflow

1. **Listen through measurement.** `agentWorkspace` action `audio_inspect` on the clip (clip-local `from`/`to`, at most 120 s) returns measured levels, noise floor, clipping and, with a `query`, audio-input descriptions. Measured silence and timing win over model prose.
2. **Noise: match the control to the problem.**
   - Hiss, fans, air conditioning: `setAudio` `noiseReduction` (0 to 100), or `removeNoise`, which writes the same field.
   - Rumble, handling thump, traffic: `setAudio` `denoise` (0 to 100). It is a LOW CUT and does nothing to hiss.
   - Mains buzz: `setAudio` `hum` 50 or 60 for the local supply.
   - Room tone between words: `gate` (0 to 100). Harsh S sounds: `deEss` (0 to 100).
   - Do not over-reduce: voices go underwater, which is worse than hiss.
3. **Level.** `compress` (0 to 100) evens out a delivery that swings loud and quiet; `limiter` adds a ceiling around -1 dB; `volume` is 0 to 2.
4. **Tone.** `eqLow` / `eqMid` / `eqHigh` in dB (-20 to 20): cut lows for rumble, a gentle mid lift for clarity on voice.
5. **Verify the edited mix** with `agentWorkspace` action `review` mode `audio`; source inspection does not include timeline effects.

## Gotchas

- `normalize` is PEAK normalisation (the loudest sample to about 0.9), not loudness. One cough and a quiet voice gets no gain, and two clips normalised to the same peak can differ by 15 dB. Never claim a LUFS reading or "broadcast loudness".
- `denoise` kept its old meaning (a high-pass up to about 470 Hz) so existing projects did not change sound; it removes hum and rumble, not hiss. Measured: `noiseReduction` took hiss down 17 dB, `hum` took a mains tone down 33 dB.
- A setting on a clip whose volume is keyframed is refused unless you pass `replaceKeyframes:true`; to change the animation, use `setKeyframeTrack`.
- Never touch audio the user did not ask about: do not mute, detach or noise-reduce a clip whose sound was not part of the request.
- A preview-playback complaint (stutter, dropouts while playing) is not an editing request; do not "fix" it with setAudio.

Related skills: music-bed, dead-air-cleanup. Specialists: sound-designer, interview-editor.
