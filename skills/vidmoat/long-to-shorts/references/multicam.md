# Multicam angles

Read this when two or more synced cameras cover the same conversation.

- Sync first: one `syncAudioToVideo` per extra angle, with the reference angle as `videoClipId` and the other angle as `audioClipId` (a video is allowed there). It cross-correlates the two recordings and moves the second clip, never the reference, and reports the offset. Both clips need a constant, matching speed: sync before any reverse, freeze, loop or speed ramp.
- Then `createMulticamGroup` with `clipIds`, `refClipId` (the reference), `refStart` (its timeline start) and `offsets`: each angle's start minus the reference's start, read from the project after syncing. The command only does the placement.
- `switchAngle` on sentence boundaries, never mid-word. Cut to the speaker on delivery and to the listener only on a real reaction.
- Hold 3 to 8 s per angle. Lead the audio by 6 to 12 frames so the picture arrives with the voice, and hold at least 3 s before switching back.
- Level every speaker to the same anchor before mixing anything else.
