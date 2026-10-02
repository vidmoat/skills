---
name: editing-glossary
description: "Editing jargon mapped to exact Vidmoat commands and the skill for each technique, including non-English terms. Use when the user names a technique (J-cut, whip pan, rack focus, LUT, lower third, green screen) and you need the op."
license: Apache-2.0 (scripts) and CC-BY-4.0 (text); see LICENSE
metadata:
  version: "2.0.0"
  owner: "vidmoat"
  category: "reference"
---

# Editing glossary

Users ask for techniques by name. Each one has an exact expression in the command schema; improvising an adjacent operation (or inventing one that does not exist) is the failure this glossary prevents. Activate the named skill for the full method.

## Cutting

- **Speed ramp** (slow-mo, time warp, velocity, zeitlupe, ralenti, camara lenta): one `setKeyframeTrack` with `prop:"speed"` and the whole curve; a flat `setSpeed` is not a ramp. Skill: speed-ramps.
- **J-cut / L-cut** (split edit, audio lead, audio bridge): `detachAudio`, then trim the audio to lead or lag the picture cut. Skill: j-l-cuts.
- **Jump cut** (cut the pauses, tighten it up): `cutRanges` on one clip with `ripple:true`, or `trimSilence`. Skill: dead-air-cleanup.
- **Match cut** (invisible cut): `sliceClip` on the matching frame, optional 0.15 to 0.25 s "whip-pan" or "blur". Skill: pacing.
- **Cut on the beat** (beat sync, auf den Beat, al ritmo, sesuai beat): measured beats, `addMarkers`, one `sliceClip` with `times`, or `snapToBeat`. Skill: beat-sync.
- **B-roll / cutaway** (insert shot, overlay footage): the cutaway on a later track, underlying audio kept. Skill: pacing.
- **Freeze frame**: `freezeFrame` at a source-media time. **Reverse / rewind**: `reverseClip`. Skill: speed-ramps.

## Camera

- **Punch-in** (zoom punch, push in, reinzoomen, acercar): `punchIn`. Skill: camera-motion.
- **Ken Burns** (pan and zoom a photo): `applyMotionPreset` "slow-zoom" or "parallax-drift". Skill: camera-motion.
- **Camera shake** (impact shake, handheld feel): `applyCameraShake`. Skill: camera-motion.
- **Rack focus** (pull focus): `addKeyframe` on `blur`. **Whip pan** (swish pan): `setTransition` "whip-pan". Skill: camera-motion.

## Colour

- **Teal and orange, film look, matte, bleach bypass, day for night, LUT, preset look** (Kinolook, aspecto de cine, sinematik): `applyFilterPreset` or `setColor` (lift, gamma, gain for a colour split) on each clip; an `addAdjustmentLayer` carries only the tonal part. Skill: colour-grade.
- **Grain, halation, bloom, VHS, light leak, chromatic aberration** (Koernung): `addEffect` at low intensity. Skill: colour-grade.
- **Vignette**: `setColor` `vignette` 0 to 1 on the adjustment layer. **Letterbox / cinemascope bars**: aspectRatio "21:9" or two black bars. Skill: colour-grade.

## Text

- **Hormozi captions**: `addCaptions` preset "Hormozi", 3 to 4 words a line. **Bold yellow, boxed word, karaoke, word-by-word captions**: presets "Bold Yellow", "Word Box" or "Karaoke". Skill: captions.
- **Subtitles / CC** (Untertitel, subtitulos, sous-titres, legendas, takarir, terjemahan): `addCaptions` preset "Clean" or "Minimal". Skill: captions.
- **Lower third** (name tag, Bauchbinde), **title card, end card, CTA**: `addTitle` with a role. Skill: titles.
- **Kinetic typography**: text clips with `applyMotionPreset` "elastic-pop", "pulse" or "bounce-in". Skill: titles.
- **Animated title, speaker card, progress ring, feature spotlight**: `addMotionComponent`, an editable motion graphic with no generation cost. Skill: motion-graphics.

## Sound

- **Ducking** (sidechain, music too loud, Musik zu laut): `musicBed` or `autoDuck`. Skill: music-bed.
- **Clean up the audio** (noise, hiss, hum, Rauschen, ruido): `setAudio` `noiseReduction`, `denoise` (low cut), `hum`, `gate`, `deEss`. Skill: audio-cleanup.
- **Riser / impact / whoosh / SFX**: stock audio with `audioPurpose:"sound_effect"`, one per moment. Skill: music-bed.
- **Fade audio** (einblenden): `setAudio` `fadeIn` / `fadeOut` in seconds. Skill: music-bed.
- **Voice change** (deeper voice, pitch shift, chipmunk, anonymise a voice): `setVoice` with a preset or `pitchSemitones` and `formantSemitones`; it is heard only in the export.
- **Sync external audio or a second camera** (dual-system sound, lav or recorder sync, multicam): `syncAudioToVideo` with the camera clip as `videoClipId`. Skill: long-to-shorts.
- **Loudness for YouTube or TikTok** (LUFS, too quiet): exports are loudness-normalised to -14 LUFS by default. Skill: sound-designer.

## Frame

- **Reframe to vertical** (make it vertical, to 9:16, Hochformat): `setProjectSettings` then `reframeAuto` `follow:"faces"`. Skill: reframing.
- **Split screen / side by side**, **picture in picture / facecam**: `applyLayout` or scaled clips on separate tracks. Skill: split-screen.
- **Green screen / remove background** (chroma key, cut me out): `addEffect` "chroma-key" for a real green screen, "bg-remove" for a person on ordinary footage, then `setBgReplace` for what shows behind.
- **Remove an object** (erase, inpaint, get rid of the sign): paid object removal, `agentWorkspace` action `removal_quote`, then `removal_start` after the user approves the quote (MCP: `remove_object`).
- **Track a face or object, blur a face** (follow, stick to, censor): `trackMotion` with `subject:"face"` for one shot or `subject:"person"` across cuts; `follow:"mask"` plus a blur `addEffect` blurs a moving face.
- **Global grade / adjustment layer**: `addAdjustmentLayer` once, then grade that layer with brightness, exposure, contrast, saturation, highlights, shadows, sharpen or vignette; it does not render white balance, lift, gamma, gain, LUTs or effects. Skill: colour-grade.
