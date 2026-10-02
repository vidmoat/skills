---
name: sound-designer
description: "Sound designer brief: a voice-led mix in layers, ducking that does not pump, loudness targets. Use when audio sounds amateur, the voice is lost under music, or the user tags @sound-designer."
license: Apache-2.0 (scripts) and CC-BY-4.0 (text); see LICENSE
metadata:
  version: "1.0.0"
  owner: "vidmoat"
  category: "specialist"
---

# Sound Designer

Builds the soundtrack layer by layer and delivers at the loudness the platform actually wants.

This is the brief the Sound Designer gives when the user tags @sound-designer or the planner activates this skill. It is professional advice inside the user's brief: the user's goal, explicit exclusions, brand rules, access and spending limits win. Its numbers are proposed targets; check that each applies and can be measured before using it. For an evidence-grounded shot plan from this specialist, use the specialist-consultation workflow (agentWorkspace action specialist_consult) instead of reading the brief alone.

Work the DERIVE list out first, from the clips actually on the timeline, and say the figures you derived. Before calling a step done, check it against the ACCEPT line.

## Brief

INTENT: a voice-led mix with a designed soundtrack, delivered to a stated target.
SPEC: pick the destination first, because one master cannot serve all of them. YouTube and music streaming normalise to about -14 LUFS integrated; spoken-word podcast -16 LUFS stereo; EBU R 128 broadcast -23 LUFS ±0.5 with -1 dBTP; Netflix -27 LKFS dialogue-gated, -2 dBTP.
DERIVE FIRST: work these out from the timeline in front of you, then apply the SPEC to those figures:
· Is there speech (any clip with a transcript) and is there music already? The mix target follows the destination the user named: if they named none, assume YouTube at -14 LUFS and say so.
· Total timeline length, so the music in/out points are real times.
· Whether any clip is muted or has silenceRegions: fix the source before mixing over it.
CRAFT
· Five layers, and a mix missing one sounds cheap: dialogue → ambience/room tone → hard effects → Foley → design elements (risers, whooshes, impacts, sub-drops).
· NEVER let a scene fall to digital silence. Lay room tone under every dialogue splice: silence at a cut is the loudest amateur tell there is.
· Ducking that doesn't pump: 6-12 dB of duck, attack 30-80ms, release 250-700ms. A music bed sits 12-18 dB under narration.
· Voice chain: high-pass at 80Hz, cut mud at 200-400Hz, presence lift at 3-5kHz, air above 10kHz, de-ess at 5-8kHz with 3-6 dB of reduction MAX.
· Spot the timeline before placing anything: list every moment that needs a sound, mark music-in and music-out as narrative decisions, and separate diegetic from non-diegetic.
· Pre-lap: bring the next scene's ambience under the tail of this one so a hard cut feels inevitable. Before a big hit, drop everything to near-silence for 0.5-1s: contrast makes a hit loud, not gain.
DO NOT: a flat music bed under dialogue; digital silence at a splice; limiting into the target instead of mixing to it; stereo-widening the voice; music that changes key under a line.
ACCEPT: integrated loudness within ±0.5 LU of the stated target, no true peak above the stated ceiling, speech legible at 30% volume.

## Gotchas

- setAudio normalize is PEAK normalisation, not loudness. It cannot hit a LUFS target; state the target and the chain, never claim a measured reading.
- setAudio denoise is a LOW CUT for rumble and does nothing to hiss. Hiss, fans and air conditioning need noiseReduction; mains buzz needs hum 50 or 60.
- Music under speech is one command: musicBed for a new bed, autoDuck for music already placed. Hand-keyframed volume dips are the fallback, not the default.
