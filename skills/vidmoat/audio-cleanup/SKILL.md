---
name: audio-cleanup
description: "Diagnosing and fixing voice and source audio: the right control for hiss, rumble, hum and sibilance, levels and EQ. Use when audio is noisy, muffled, too quiet or too loud, or the user asks to clean up the sound."
license: Apache-2.0 (scripts) and CC-BY-4.0 (text); see LICENSE
metadata:
  version: "2.0.0"
  owner: "vidmoat"
  category: "craft"
---

# Audio cleanup

Diagnose before treating: noise, level and balance have different fixes, and applying all three blindly makes it worse.

## Workflow

1. **Listen through measurement.** `agentWorkspace` action `audio_inspect` on the clip (clip-local `from`/`to`, at most 120 s) returns measured levels (including `integratedLufs` and `truePeakDbtp` for that source window), noise floor, clipping and, with a `query`, audio-input descriptions. Measured silence and timing win over model prose.
2. **Noise: match the control to the problem.**
   - Hiss, fans, air conditioning: `setAudio` `noiseReduction` (0 to 100), or `removeNoise`, which writes the same field.
   - Rumble, handling thump, traffic: `setAudio` `denoise` (0 to 100). It is a LOW CUT and does nothing to hiss.
   - Mains buzz: `setAudio` `hum` 50 or 60 for the local supply.
   - Harsh S sounds: `deEss` (0 to 100).
   - Noise between phrases that the other controls left: `gate` (0 to 100) pushes everything under its threshold down (a downward expander at ratio 2, applied on export only, not in preview). It is not a room-tone tool: too much makes the background drop in and out between words, so use it lightly and listen.
   - Do not over-reduce: voices go underwater, which is worse than hiss.
3. **Level.** `compress` (0 to 100) evens out a delivery that swings loud and quiet; `limiter` adds a ceiling around -1 dB; `volume` is 0 to 2. Overall loudness is the export's job: exports are loudness-normalised to -14 LUFS integrated, -1.5 dBTP true peak, by default.
4. **Tone.** `eqLow` / `eqMid` / `eqHigh` in dB (-20 to 20): cut lows for rumble, a gentle mid lift for clarity on voice.
5. **Verify the edited mix** with `agentWorkspace` action `review` mode `audio`; source inspection does not include timeline effects.

## Gotchas

- `normalize` is PEAK normalisation (the loudest sample to about 0.9), not loudness. One cough and a quiet voice gets no gain, and two clips normalised to the same peak can differ by 15 dB. Never claim a LUFS reading of the mix: `audio_inspect` readings are of a mono source window before timeline gain and effects, and the export normaliser sets the final loudness.
- `denoise` kept its old meaning (a high-pass up to about 470 Hz) so existing projects did not change sound; it removes hum and rumble, not hiss. Measured: `noiseReduction` took hiss down 17 dB, `hum` took a mains tone down 33 dB.
- A setting on a clip whose volume is keyframed is refused unless you pass `replaceKeyframes:true`; to change the animation, use `setKeyframeTrack`.
- Never touch audio the user did not ask about: do not mute, detach or noise-reduce a clip whose sound was not part of the request.
- A preview-playback complaint (stutter, dropouts while playing) is not an editing request; do not "fix" it with setAudio.
- No command creates room tone. To cover an open gap, `detachAudio` and lay an audio clip of the same recording from a measured quiet stretch under it; never report room tone you did not place and listen to.

Related skills: music-bed, dead-air-cleanup. Specialists: sound-designer, interview-editor.
