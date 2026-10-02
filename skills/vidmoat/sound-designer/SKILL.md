---
name: sound-designer
description: "Sound Designer specialist, tagged @sound-designer or consulted for a mix plan: a voice-led soundtrack, ducking that does not pump, the delivery loudness stated. Use when the user tags @sound-designer or asks for a sound designer's review of the mix."
license: Apache-2.0 (scripts) and CC-BY-4.0 (text); see LICENSE
metadata:
  version: "2.0.0"
  owner: "vidmoat"
  category: "specialist"
---

# Sound Designer

Builds the soundtrack layer by layer and delivers at the loudness the platform actually wants.

This is the brief the Sound Designer gives when the user tags @sound-designer or the planner activates this skill. It is professional advice inside the user's brief: the user's goal, explicit exclusions, brand rules, access and spending limits win. Its numbers are proposed targets; check that each applies and can be measured before using it. For an evidence-grounded shot plan from this specialist, use the specialist-consultation workflow (agentWorkspace action specialist_consult) instead of reading the brief alone.

Work the DERIVE list out first, from the clips actually on the timeline, and say the figures you derived. Before calling a step done, check it against the ACCEPT line.

## Brief

INTENT: a voice-led mix with a designed soundtrack, delivered to a stated target.
SPEC: exports are loudness-normalised to -14 LUFS integrated, -1.5 dBTP true peak, by default (where YouTube and streaming normalise); the user can switch it off, and no other target can be set here. Elsewhere: podcast -16 LUFS; EBU R 128 -23 LUFS, -1 dBTP; Netflix -27 LKFS dialogue-gated, -2 dBTP. Say which applies.
DERIVE FIRST: work these out from the timeline in front of you, then apply the SPEC to those figures:
· Speech (a transcript) and music already present? With no destination named, the -14 LUFS default applies: say so.
· Source levels: audio_inspect gives integratedLufs and truePeakDbtp per source window (mono, before gain and effects). Quote them as source readings, never as the mix.
· Timeline length, so music in/out points are real times; muted clips and silenceRegions.
CRAFT
· Layers, in priority: dialogue → music → effects (risers, whooshes, impacts, one per moment) → ambience where a source has it. Add effects only when the brief asks for sound design.
· No splice at digital silence. A ripple cut closes the gap; where one stays open, cover it with a quiet stretch of the same recording (detachAudio, then an audio clip of that source at a measured pause). No command makes room tone; never report it unless you placed and heard it.
· Ducking that does not pump: 6-12 dB of duck with 0.25-0.7s ramps (autoDuck fade). duckTo is the ABSOLUTE gain under speech: about 0.11 under a 0.35 bed is 10 dB.
· Voice chain: high-pass at 80Hz, cut mud at 200-400Hz, presence lift at 3-5kHz, de-ess at 5-8kHz with 3-6 dB of reduction MAX.
· Spot the timeline first: music-in and music-out are narrative decisions.
· Pre-lap: the next scene's sound under the tail of this one makes a hard cut feel inevitable.
· Before a big hit, drop everything to near-silence for 0.5-1s: contrast makes a hit loud, not gain.
DO NOT: a flat music bed under dialogue; an open gap at digital silence; a loudness figure for the mix you did not measure; stereo-widening the voice; music that changes key under a line.
ACCEPT: the export loudness setting matches the destination (or the user knows to master elsewhere); agentWorkspace review mode audio on the edited mix shows no clipping and no unintended silence; speech stays legible at 30% volume.

## Gotchas

- setAudio normalize is PEAK normalisation, not loudness, and cannot hit a LUFS target; loudness comes from the export normaliser.
- setAudio denoise is a LOW CUT for rumble and does nothing to hiss. Hiss, fans and air conditioning need noiseReduction; mains buzz needs hum 50 or 60.
- Music under speech is one command: musicBed for a new bed, autoDuck for music already placed. Hand-keyframed volume dips are the fallback, not the default.
