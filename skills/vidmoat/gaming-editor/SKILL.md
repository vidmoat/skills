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

Work the DERIVE list out first, from the clips actually on the timeline, and say the figures you derived. Before calling a step done, check it against the ACCEPT line. Sources and evidence notes: `references/sources.md`.

## Brief

INTENT: keep only plays, reactions and the setup for them.
SPEC: vertical clips 1080x1920, 15 to 35s for one moment and up to 60s for a story; never past 60s if any music could be claimed (a Short over 1 minute with a Content ID claim is blocked worldwide). The payoff or a text hook within the first 1s. Open a moment 20 to 30s before the reaction peak (chat and voice react late) and close right after the reaction lands. Cut silence over 1.5s outside tension beats. Voice at least 8 dB above game audio, about -14 LUFS integrated and true peak at or below -1 dBTP. Vertical stack: facecam about 35 to 40% of the height, gameplay 60 to 65%. Captions of 4 to 7 words, clear of the bottom 20% and the right edge. Long-form highlights about 10 to 25 min from a 4 to 8 hour stream, a cut every 2 to 6s in talk sections. 1 to 2 signature meme sound effects per video, not per line.
DERIVE FIRST: work these out from the timeline in front of you, then apply the SPEC to those figures:
· Voice loudness peaks (screams, laughter) above the streamer's own baseline, and any chat or marker timestamps the user supplies: these are the moment candidates.
· Kill-feed, score and round changes for competitive games.
· Facecam position and size in the source, and the face box over time for the vertical crop.
· Whether voice and game are on separate tracks (decides whether the game can be ducked).
· Music already in the footage and whether it is licensed only for the stream.
· Profanity, slurs and personal information on screen (addresses, messages) that need muting or blurring.
CRAFT
· Pick moments from audio and chat peaks, then open each window 20 to 30s earlier so the cause is in it.
· Vertical: put the 0.5 to 1s climax or a text hook on frame 1, then rewind to the setup.
· Cut walking, loading, menus and queues outright (cutRanges, trimSilence); show travel with a speed ramp or a "10 minutes later" card.
· Vertical stack with applyLayout: face cropped tight on top, gameplay cropped to the action region below, never squashed; fall back to 16:9 gameplay with caption fill when cropping would lose the HUD.
· Punch in (about 110 to 130%) only on the reaction beat, released on the next cut (punchIn).
· Duck game audio under speech but keep it loud on the moment itself (autoDuck with the voice as the key).
· Captions on by default, key words highlighted, inside the safe zone.
· Censor with a bleep or mute plus a mouth blur; blur personal information (blurFaces covers faces only, use a mask region for text).
· Group long-form moments into an arc: goal, attempts, climax, with short context lines for newcomers.
DO NOT: a meme sound or zoom on every line (overuse is itself the joke now); start at the reaction and miss its cause; squash 16:9 into 9:16; game audio as loud as the commentary; stream-only or popular music in a monetised upload or a Short over 60s; fill tension with cuts; over-compress to sound loud.
ACCEPT: every kept segment contains or sets up a play or reaction, no silence over 1.5s outside a tension beat, speech sits at least 8 dB above game audio and the mix is -14 plus or minus 1 LUFS, verticals hook within 1s and keep face and text clear of the bottom 20% and the right edge, and no Short over 60s carries claimable music.

## Gotchas

- A vertical crop of gameplay can cut the HUD that explains the play (health, score, kill feed); check a preview frame of the crop on the moment itself.
- Music from StreamBeats or a game's soundtrack is licensed for the stream, not automatically for YouTube; prefer the built-in licence-safe library.
- Auto silence-trimming removes tension pauses before a clutch; keep the quiet seconds before a big play.
