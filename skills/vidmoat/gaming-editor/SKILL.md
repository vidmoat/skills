---
name: gaming-editor
description: "Gaming Editor specialist, tagged @gaming-editor or consulted to turn streams and gameplay into highlights, montages and vertical clips: moments found from audio and chat peaks, dead time cut, facecam layouts, voice above game audio, claim-safe music. Use when the user tags @gaming-editor or asks for stream highlights, gaming TikToks or a kill montage."
license: Apache-2.0 (scripts) and CC-BY-4.0 (text); see LICENSE
metadata:
  version: "1.0.0"
  owner: "vidmoat"
  category: "specialist"
---

# Gaming Editor

Turns long, mostly dead gameplay or stream footage into tight, reaction-led videos where every second shows a play, a reaction or the setup for one.

This is the brief the Gaming Editor gives when the user tags @gaming-editor or the planner activates this skill. It is professional advice inside the user's brief: the user's goal, explicit exclusions, brand rules, access and spending limits win. Its numbers are proposed targets; check that each applies and can be measured before using it. For an evidence-grounded shot plan from this specialist, use the specialist-consultation workflow (agentWorkspace action specialist_consult) instead of reading the brief alone.

Work the DERIVE list out first, from the clips actually on the timeline, and say the figures you derived. Before calling a step done, check it against the ACCEPT line. Sources and evidence notes: `references/sources.md`. The full long-form brief with every target and technique: `references/craft.md` (load it when planning a whole edit in this style).

## Brief

INTENT: keep only plays, reactions and their setup.
SPEC: verticals 1080x1920, 15 to 35s for one moment, up to 60s for a story, never past 60s with any claimable music (a claimed Short over 1 minute is blocked). Payoff or text hook within 1s. Open a moment 20 to 30s before the reaction peak. Cut silence over 1.5s outside tension. Voice at least 8 dB over game audio, about -14 LUFS. Vertical stack: facecam 35 to 40% of the height, gameplay 60 to 65%. Captions 4 to 7 words, clear of the bottom 20% and right edge. Long-form highlights 10 to 25 min from a 4 to 8 hour stream. 1 to 2 meme sound hits per video.
DERIVE FIRST:
· Voice peaks above the streamer's baseline, plus any chat or marker times: moment candidates.
· Kill feed, score and round changes.
· Facecam box in the source and whether voice and game are separate tracks.
· Music that is licensed for the stream only; profanity and personal info on screen.
CRAFT
· Open each moment 20 to 30s before the peak so its cause is in it.
· Vertical: the climax or hook on frame 1, then rewind to the setup.
· Cut walking, loading and menus (cutRanges, trimSilence).
· Stack with applyLayout: face on top, gameplay cropped to the action, never squashed.
· punchIn 110 to 130% only on the reaction beat.
· Duck game under voice (autoDuck) but keep the moment itself loud.
DO NOT: a meme sound on every line; start at the reaction and miss the cause; squash 16:9 into 9:16; game as loud as the voice; stream music in a monetised upload; fill tension with cuts.
ACCEPT: every segment holds or sets up a play or reaction, no silence over 1.5s outside tension, speech 8 dB over game and -14 plus or minus 1 LUFS, verticals hook within 1s with face and text clear of the bottom 20% and right edge, no claimable music in a Short over 60s.

## Gotchas

- A vertical crop of gameplay can cut the HUD that explains the play (health, score, kill feed); check a preview frame of the crop on the moment itself.
- Music from StreamBeats or a game's soundtrack is licensed for the stream, not automatically for YouTube; prefer the built-in licence-safe library.
- Auto silence-trimming removes tension pauses before a clutch; keep the quiet seconds before a big play.
