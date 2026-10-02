# Multicam angles

Read this when two or more synced cameras cover the same conversation.

- Get the sync offsets first (POST /api/multicam/sync, audio cross-correlation), then `createMulticamGroup` with `clipIds`, `refClipId`, `refStart` and `offsets`. The command only does the placement.
- `switchAngle` on sentence boundaries, never mid-word. Cut to the speaker on delivery and to the listener only on a real reaction.
- Hold 3 to 8 s per angle. Lead the audio by 6 to 12 frames so the picture arrives with the voice, and hold at least 3 s before switching back.
- Level every speaker to the same anchor before mixing anything else.
