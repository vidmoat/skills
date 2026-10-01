#!/usr/bin/env python3
"""Turn speech regions into a music-ducking envelope.

The envelope ramps the music down BEFORE each phrase starts (a compressor
cannot, because it only reacts to sound it has already heard), holds it down
through short pauses so the bed does not pump between phrases, and releases
smoothly after the last word.

Input (one of):
  * JSON: [[start, end], ...] or {"segments": [{"start": s, "end": e}, ...]}
    (the shape most speech-to-text tools emit)
  * SRT or WebVTT captions: each cue counts as speech

Output formats (--format):
  ffmpeg     a volume filter for the MUSIC input, e.g.
             -filter_complex "[1:a]<printed filter>[bed]"
  keyframes  CSV of time_s,gain_db pairs to type into any editor's volume lane
  json       regions after merging, plus the keyframes

Usage:
  python duck_envelope.py speech.json --depth-db 10 --format ffmpeg
  python duck_envelope.py captions.srt --format keyframes > duck.csv

Standard library only. Reads one file, prints to stdout, writes nothing else.
"""

import argparse
import json
import re
import sys

TIME_RE = re.compile(
    r"(?:(\d+):)?(\d{1,2}):(\d{2})[,.](\d{1,3})\s*-->\s*(?:(\d+):)?(\d{1,2}):(\d{2})[,.](\d{1,3})"
)


def _secs(h, m, s, ms):
    return int(h or 0) * 3600 + int(m) * 60 + int(s) + int((ms or "0").ljust(3, "0")) / 1000.0


def load_regions(path):
    with open(path, "r", encoding="utf-8-sig") as fh:
        text = fh.read()
    stripped = text.lstrip()
    if stripped.startswith("[") or stripped.startswith("{"):
        data = json.loads(text)
        if isinstance(data, dict):
            data = data.get("segments", data.get("regions", []))
        regions = []
        for item in data:
            if isinstance(item, dict):
                regions.append((float(item["start"]), float(item["end"])))
            else:
                regions.append((float(item[0]), float(item[1])))
        return regions
    regions = []
    for m in TIME_RE.finditer(text):
        g = m.groups()
        regions.append((_secs(*g[0:4]), _secs(*g[4:8])))
    if not regions:
        raise ValueError("no speech regions found (expected JSON or SRT/VTT timings)")
    return regions


def merge(regions, attack, hold, release, min_gap):
    """Sort, drop empty regions, and merge any two whose ducks would touch.

    Two ducks touch when the gap between phrases is shorter than
    hold + release + attack: the music would start to come back up and be
    pulled down again, which is the audible "pumping" this avoids.
    """
    threshold = max(min_gap, hold + release + attack)
    out = []
    for s, e in sorted((max(0.0, s), e) for s, e in regions if e > s):
        if out and s - out[-1][1] < threshold:
            out[-1][1] = max(out[-1][1], e)
        else:
            out.append([s, e])
    return [(s, e) for s, e in out]


def keyframes(regions, depth_db, attack, hold, release):
    """Gain keyframes in dB: 0 is the bed's normal level, -depth is ducked."""
    kf = []
    for s, e in regions:
        down_start = max(0.0, s - attack)
        up_start = e + hold
        kf += [(round(down_start, 3), 0.0), (round(s, 3), -depth_db),
               (round(up_start, 3), -depth_db), (round(up_start + release, 3), 0.0)]
    return kf


def ffmpeg_filter(regions, depth_db, attack, hold, release):
    """volume filter whose gain is 0 dB outside speech and -depth inside.

    Each region contributes min(rise, fall) clipped to 0..1; merged regions
    never overlap, so the sum stays within 0..1.
    """
    if not regions:
        return "anull"
    terms = []
    for s, e in regions:
        a0 = max(0.0, s - attack)
        a = max(s - a0, 1e-3)
        r_end = e + hold + release
        terms.append("min(clip((t-%.3f)/%.3f,0,1),clip((%.3f-t)/%.3f,0,1))" % (a0, a, r_end, release))
    env = "+".join(terms)
    return "volume='pow(10,-%g*(%s)/20)':eval=frame" % (depth_db, env)


def main(argv=None):
    p = argparse.ArgumentParser(description="Build a music ducking envelope from speech regions.")
    p.add_argument("path", help="speech regions: JSON, SRT or VTT")
    p.add_argument("--depth-db", type=float, default=10.0, help="how far the music drops under speech (default 10)")
    p.add_argument("--attack", type=float, default=0.15, help="seconds of ramp down, ending at the first syllable (default 0.15)")
    p.add_argument("--hold", type=float, default=0.2, help="seconds to stay down after the last word (default 0.2)")
    p.add_argument("--release", type=float, default=0.5, help="seconds of ramp back up (default 0.5)")
    p.add_argument("--min-gap", type=float, default=0.8, help="merge phrases closer than this, in seconds (default 0.8)")
    p.add_argument("--format", choices=["ffmpeg", "keyframes", "json"], default="ffmpeg")
    a = p.parse_args(argv)
    if a.depth_db <= 0 or a.attack < 0 or a.hold < 0 or a.release <= 0:
        print("depth-db and release must be positive; attack and hold must not be negative", file=sys.stderr)
        return 2
    try:
        regions = merge(load_regions(a.path), a.attack, a.hold, a.release, a.min_gap)
    except (OSError, ValueError, KeyError, TypeError, IndexError) as exc:
        print("cannot read %s: %s" % (a.path, exc), file=sys.stderr)
        return 2
    kf = keyframes(regions, a.depth_db, a.attack, a.hold, a.release)
    if a.format == "ffmpeg":
        print(ffmpeg_filter(regions, a.depth_db, a.attack, a.hold, a.release))
    elif a.format == "keyframes":
        print("time_s,gain_db")
        for t, g in kf:
            print("%.3f,%.1f" % (t, g))
    else:
        print(json.dumps({"regions": regions, "keyframes": kf}, indent=2))
    return 0


if __name__ == "__main__":
    sys.exit(main())
