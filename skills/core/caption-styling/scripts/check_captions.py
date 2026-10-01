#!/usr/bin/env python3
"""Check an SRT or WebVTT caption file against readable-caption limits.

Usage:
  python check_captions.py captions.srt [--fps 30] [--max-chars 32]
                           [--max-lines 2] [--max-cps 17] [--min-dur 1.0]
                           [--max-dur 6.0] [--json]

Exit status: 0 when there are no errors, 1 when any cue breaks a limit,
2 when the file cannot be read or parsed.

Standard library only. Reads the file, prints a report, writes nothing.
Character counts ignore formatting tags such as <i>, <c.x> and {\\an8}, and
count spaces and punctuation, which is how reading speed is usually measured.
"""

import argparse
import json
import re
import sys

TIME_RE = re.compile(
    r"(?:(\d+):)?(\d{1,2}):(\d{2})[,.](\d{1,3})\s*-->\s*(?:(\d+):)?(\d{1,2}):(\d{2})[,.](\d{1,3})"
)
TAG_RE = re.compile(r"<[^>]*>|\{[^}]*\}")


def to_seconds(h, m, s, ms):
    ms = (ms or "0").ljust(3, "0")
    return int(h or 0) * 3600 + int(m) * 60 + int(s) + int(ms) / 1000.0


def parse(text):
    """Return a list of cues: dicts with index, start, end, lines, line_no."""
    text = text.replace("\r\n", "\n").replace("\r", "\n").lstrip("\ufeff")
    blocks = re.split(r"\n\s*\n", text.strip())
    cues = []
    line_no = 1
    for block in blocks:
        raw = block.split("\n")
        start_line = line_no
        line_no += len(raw) + 1
        if not raw or raw[0].startswith("WEBVTT") or raw[0].startswith(("NOTE", "STYLE", "REGION")):
            continue
        timing_idx = next((i for i, l in enumerate(raw) if "-->" in l), None)
        if timing_idx is None:
            raise ValueError("line %d: block has no timing line" % start_line)
        m = TIME_RE.search(raw[timing_idx])
        if not m:
            raise ValueError("line %d: cannot parse timing %r" % (start_line + timing_idx, raw[timing_idx]))
        g = m.groups()
        start = to_seconds(*g[0:4])
        end = to_seconds(*g[4:8])
        lines = [TAG_RE.sub("", l).strip() for l in raw[timing_idx + 1:]]
        lines = [l for l in lines if l]
        cues.append({
            "index": len(cues) + 1,
            "start": start,
            "end": end,
            "lines": lines,
            "line_no": start_line,
        })
    return cues


def check(cues, fps=30.0, max_chars=32, max_lines=2, max_cps=17.0, min_dur=1.0, max_dur=6.0):
    """Return a list of findings: dicts with cue, level, rule, message."""
    findings = []
    frame = 1.0 / fps
    eps = 1e-6

    def add(cue, level, rule, message):
        findings.append({"cue": cue["index"], "line": cue["line_no"], "level": level, "rule": rule, "message": message})

    for i, cue in enumerate(cues):
        dur = cue["end"] - cue["start"]
        text_len = sum(len(l) for l in cue["lines"])
        if not cue["lines"]:
            add(cue, "error", "empty", "cue has no text")
        if dur <= 0:
            add(cue, "error", "timing", "end is not after start")
            continue
        if len(cue["lines"]) > max_lines:
            add(cue, "error", "lines", "%d lines (max %d)" % (len(cue["lines"]), max_lines))
        for l in cue["lines"]:
            if len(l) > max_chars:
                add(cue, "error", "line-length", "%d characters in %r (max %d)" % (len(l), l[:50], max_chars))
        cps = text_len / dur
        if cps > max_cps + eps:
            add(cue, "error", "reading-speed", "%.1f characters/second (max %.0f); split the cue or extend it" % (cps, max_cps))
        if dur < min_dur - eps:
            add(cue, "error", "too-short", "on screen %.2fs (min %.1fs)" % (dur, min_dur))
        if dur > max_dur + 1.0 + eps:
            add(cue, "error", "too-long", "on screen %.2fs (max %.1fs)" % (dur, max_dur))
        elif dur > max_dur + eps:
            add(cue, "warning", "too-long", "on screen %.2fs (aim for %.1fs or less)" % (dur, max_dur))
        if i + 1 < len(cues):
            nxt = cues[i + 1]
            gap = nxt["start"] - cue["end"]
            if gap < -eps:
                add(cue, "error", "overlap", "overlaps the next cue by %.3fs" % -gap)
            elif eps < gap < 2 * frame - eps:
                add(cue, "warning", "gap", "gap of %.3fs before the next cue is under 2 frames; close it or widen it" % gap)
    return findings


def main(argv=None):
    p = argparse.ArgumentParser(description="Check SRT/VTT captions for readability limits.")
    p.add_argument("path")
    p.add_argument("--fps", type=float, default=30.0)
    p.add_argument("--max-chars", type=int, default=32)
    p.add_argument("--max-lines", type=int, default=2)
    p.add_argument("--max-cps", type=float, default=17.0)
    p.add_argument("--min-dur", type=float, default=1.0)
    p.add_argument("--max-dur", type=float, default=6.0)
    p.add_argument("--json", action="store_true", help="print a JSON report")
    a = p.parse_args(argv)
    try:
        with open(a.path, "r", encoding="utf-8-sig") as fh:
            cues = parse(fh.read())
    except (OSError, UnicodeDecodeError, ValueError) as exc:
        print("cannot read %s: %s" % (a.path, exc), file=sys.stderr)
        return 2
    findings = check(cues, a.fps, a.max_chars, a.max_lines, a.max_cps, a.min_dur, a.max_dur)
    errors = [f for f in findings if f["level"] == "error"]
    if a.json:
        print(json.dumps({"cues": len(cues), "errors": len(errors), "findings": findings}, indent=2))
    else:
        for f in findings:
            print("%-7s cue %-4d (line %d) %-14s %s" % (f["level"].upper(), f["cue"], f["line"], f["rule"], f["message"]))
        print("%d cue(s), %d error(s), %d warning(s)" % (len(cues), len(errors), len(findings) - len(errors)))
    return 1 if errors else 0


if __name__ == "__main__":
    sys.exit(main())
