---
name: slideshow-voiceover
description: "Narrated slideshows: a timing map where each image holds its line, voice inside the windows, push-ins, a ducked bed. Use for photo stories and faceless voiceover videos (Director type slideshow_voiceover)."
license: Apache-2.0 (scripts) and CC-BY-4.0 (text); see LICENSE
metadata:
  version: "1.0.0"
  owner: "vidmoat"
  category: "craft"
---

# Slideshow with voiceover

The script and the pictures move together: the timing map is the contract.

## Workflow

1. **Script and timing map.** One line per image, in order, each image holding exactly its line's window.
2. **Voice.** Generate (`generateMedia` kind `speech`) or place each line inside its window. If a line runs long, rewrite it tighter or regenerate faster; never let lines overlap or spill into the next image.
3. **Motion.** Every photo gets a slow eased push-in or drift of 3 to 8% across its hold, alternating direction, faces and text in the photo kept in frame (production-motion).
4. **Captions** follow the voice with real word timing, in the language spoken, keywords emphasised as asked (captions skill).
5. **Music** is a low bed ducked under every line and faded at both ends (`musicBed`).
6. **End** on the call to action inside the requested length.

## Gotchas

- Generated speech lands at its MEASURED length; a shorter requested duration is not applied. Plan windows from the measured length, not the estimate.
- A voice line cut through a word blocks the run from finishing (`speechcut:`). Shorten the line's text instead of trimming the audio.
- An image clip pointed at an MP4, a `blob:` src or a lost upload shows "Media missing" and blocks finishing. Never ship it.
- Keep each caption inside its line's window; a timing change moves the caption with its line.

Related skills: captions, music-bed, production-motion, media-sourcing. Specialist: explainer-producer.
