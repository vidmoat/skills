# Inserts on a talking head

What the owner's 185 reference Reels do: one designed graphic per spoken idea, in one palette, with a sound as it lands.

## Which component

| Said | `component` | Props |
| --- | --- | --- |
| A figure | stat-counter | value, prefix, suffix, title as its label |
| A point to land | keyword | title one to three words, subtitle a small kicker |
| Steps or a list | checklist | title, subtitle items separated by `|`, up to 4 |
| A message or a conversation | chat-bubbles | title the contact, subtitle messages separated by `|` |
| Something looked up | search-bar | title the query, up to 48 characters |
| A result or a payment arriving | proof-card | title the app or sender, subtitle the message, icon |
| A named thing | icon-card | icon, title, subtitle |
| A line worth keeping | quote-card | title the line, subtitle its source |

## The pass

- `designInserts` with `inserts: [{component, at, props}]`. `at` is the timeline second of the spoken word, so run it after the cut: a re-cut moves the words out from under it. A second pass replaces the first.
- The palette is the direction's; `palette` overrides it for the whole pass, and colours on one insert are refused.
- Each insert reports `placement`. "Faces not measured" is not clear of the face: measure them (`analyze_faces`) or check that frame.

## The sound on each pop

- Read each insert's `start` from the result. `fetchStockMedia` `mediaType:"audio"`, `audioPurpose:"sound_effect"`, a `clipId`, `start` that second, `duration` under a second.
- Its note reports the URL: the other inserts reuse it with `addClip` `type:"audio"`, so the pops match.
- `setAudio` `volume`, start about 0.3 to 0.5, and judge by listening. A pop sits under the voice and never covers a word.

## Words behind the speaker

`wordsBehind` with `items: [{text, at}]`, one to three words, on the line worth stopping for: the direction names it or the brief wants it, and the person fills a good part of the frame. One command makes the layers (footage, words, a silent cut-out of the person) under the captions and inserts, per footage piece.

- After the cut, like inserts: a re-cut moves the footage out from under it. A second pass replaces the first.
- Over speech the words must be said near `at`. Set `literal: true` only when the person's own message gives these exact words.
- Rare: twice in a 30 second edit is plenty. It stops landing if it is the default.
- Each result reports `placement`. "Faces not measured" means nobody knows the person crosses the words: measure them (`analyze_faces`) or check that frame.

## Speech as placed type

`placeSpeech` with `spans: [{from, to}]` puts the speaker's own words large around the frame, verbatim, for the lines that matter; the rest stay plain captions. It replaces the captions of those spans, so run it after `addCaptions`. `emphasis` works as in `addCaptions`. It is a change of treatment, so spans of a few seconds between stretches of plain captions read better than one long span.
