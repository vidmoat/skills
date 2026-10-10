# Podcast Editor: the full brief

The long form of the brief, with every target and technique. The SKILL.md brief is the compact version that rides in the prompt; load this when planning a full edit in this style or when the user asks for detail.

INTENT: cameras serve the conversation; clips serve one complete idea each.
SPEC: master at -16 LUFS integrated plus or minus 1 (stereo; about -19 if truly mono), true peak at or below -1 dBTP (-2 if it may run as an ad). Camera holds: speaker close-up up to 30s, reaction insert 2 to 3s, wide 5 to 10s used for crosstalk and laughter; minimum hold 2s so a "yeah" never triggers a cut. Switch 2 to 4 frames after the new speaker starts; J/L offsets of 6 to 12 frames. Punch in 15 to 20% to hide a content cut inside one angle. Chapters: 00:00, at least 3, each at least 10s. Clips: 9:16, 30 to 90s by default (a Short may run to 180s), about 5 per episode, captions of at most 2 lines, first spoken line within 1s.
DERIVE FIRST: work these out from the timeline in front of you, then apply the SPEC to those figures:
· Speakers, talk-time share each, and crosstalk spans where 2 or more voices overlap.
· Dead air over 0.7s and filler density (ums per minute) per speaker.
· Cameras available (wide, singles, two-shot) and whether they are separate angles or one program feed.
· Integrated loudness and true peak per speaker and for the mix; mono or stereo master.
· Topic boundaries from the transcript: chapter candidates and clip candidates.
· For each clip candidate: a self-contained thought of 20 to 90s that does not depend on earlier context ("like I said").
CRAFT
· Two passes on a copy of the assembly: cameras first (switchAngle in a multicam group), content second.
· Split edits at speaker changes: the new voice leads by 6 to 12 frames, or hold on the speaker as they finish; never cut exactly on the audio onset.
· Cut to a listener for 2 to 3s when they react (a laugh, a nod), not on a timer.
· Go wide for crosstalk, group laughter and topic changes.
· Trim fillers and dead air with cutRanges on the transcript, not by ear; keep laughs and thinking pauses that carry meaning.
· Hide content cuts with a cut to another person, a listener insert or a punchIn.
· Cold open of 30 to 90s from the strongest lines; in trailers cut away before an answer resolves.
· Clip arc: enter on the strongest line, build the reason, land the payoff, exit before the topic shifts; reframe with reframeAuto so the speaker's face stays fully in frame.
· Master last: level each speaker, then measure the encoded file.
DO NOT: cut on every "yeah" or "right"; hard-cut every speaker change exactly on the onset; cross the 180-degree line; leave digital silence where you cut; normalise a mono file on a stereo meter and ship it 3 dB quiet; open a clip on "um", "so" or "OK"; put captions under the platform's bottom UI.
ACCEPT: the master measures -16 plus or minus 1 LUFS with true peak at or below -1 dBTP, no camera hold is under 2s or over 30s except a deliberate wide, chapters start at 00:00 with at least 3 of at least 10s, and every clip is 9:16, at most 180s, opens on a spoken line within 1s and keeps the speaker's whole face in frame.
