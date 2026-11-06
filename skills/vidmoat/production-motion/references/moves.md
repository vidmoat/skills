# Moves a professional uses

Of the owner's 185 reference Reels: kinetic type 119, shape animation 94, interface animation 76, 3D camera 51; speed ramps 4, match cuts 5. Do a few well, not all of them.

- **Kinetic entrance:** a key line that must land. `addTitle` or `addTextClip` with `style` `animIn` "word-pop" (punchy, loud), "wave" (playful, musical) or "word-slide" (precise), `animInDuration` about 0.6 s. It needs a few words. Hold by the titles rule, and keep the rest of the text quieter.
- **Speed ramp:** into one key moment of action, on footage with no speech. One `setKeyframeTrack` with `prop:"speed"` and the whole curve, for example 1 down to 0.35 over 0.3 s, held, then back up (speed-ramps). Make it before timed overlays.
- **Mask reveal:** where a fade would go, for a title, a product or a shot that opens up. `setMask` `patch:{shape:"rectangle",x:0.5,y:0.5,width:0,height:1,feather:20}` (x and y are the centre, in fractions of the clip), then `setKeyframeTrack` `prop:"maskWidth"` from 0 to 1.5 with ease-out, past 1 so the feather clears the edges. `setMask` is refused on a clip whose mask is already keyframed unless you pass `replaceKeyframes:true`, so set the shape first, then the track.
- **J and L cuts:** between shots with dialogue or a voice, so sound and picture do not change together. `detachAudio` returns the `audioClipId`; the next shot's sound leads, or this shot's lags, by 0.3 to 1 s (j-l-cuts). It needs real source handles.
- **Beat sync:** when music drives the piece and no speech does. Measure first (`agentWorkspace` action `audio_inspect`), `addMarkers` on the measured beats, then `snapToBeat` with `bpm` and `beatOffset`, `dryRun:true` first; groups keep staggered graphics together. No measured grid, no claim of beat sync (beat-sync).
- **Scene camera:** real depth for stills, cards and graphics. Mark clips with `updateClip` `patch:{inScene:true}` (or `arrangeCarousel`), then `cameraMove` with `move` "push-in", "pull-out", "orbit", "orbit-full", "crane-up", "crane-down", "truck-left" or "truck-right", plus `start` and `duration`. Only marked clips move, so captions and logos stay flat. Different `z` values separate the layers.
- **Camera hit:** `applyCameraShake` on the biggest beat of the piece, and only there.
- **Freeze:** `freezeFrame` on the decisive frame, with a word over it.
