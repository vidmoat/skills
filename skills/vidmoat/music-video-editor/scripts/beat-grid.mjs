#!/usr/bin/env node
// Beat grid calculator: frames per beat, bar length and marker times.
//
//   node beat-grid.mjs --bpm 100 --fps 24 [--offset 0.42] [--duration 30] [--beats-per-bar 4] [--unit beat|bar]
//
// Prints JSON: { framesPerBeat, secondsPerBeat, barSeconds, markers: [seconds...] }
// markers are times from the first downbeat (offset) up to duration, rounded to
// the nearest frame, ready for addMarkers times=[...] (add the music clip's
// timeline start if the offset is clip-relative).
// SPDX-License-Identifier: Apache-2.0

function parse(argv) {
  const out = {};
  for (let i = 0; i < argv.length; i++) {
    const k = argv[i];
    if (!k.startsWith('--')) throw new Error(`Unexpected argument "${k}". Use --name value pairs.`);
    out[k.slice(2)] = argv[++i];
  }
  return out;
}

function num(v, name, { min = -Infinity, max = Infinity, fallback } = {}) {
  if (v === undefined) {
    if (fallback !== undefined) return fallback;
    throw new Error(`--${name} is required.`);
  }
  const n = Number(v);
  if (!Number.isFinite(n) || n < min || n > max) throw new Error(`--${name} must be a number between ${min} and ${max}; got "${v}".`);
  return n;
}

try {
  const a = parse(process.argv.slice(2));
  const bpm = num(a.bpm, 'bpm', { min: 20, max: 400 });
  const fps = num(a.fps, 'fps', { min: 1, max: 240, fallback: 30 });
  const offset = num(a.offset, 'offset', { min: 0, fallback: 0 });
  const duration = num(a.duration, 'duration', { min: 0, max: 36000, fallback: 0 });
  const beatsPerBar = num(a['beats-per-bar'], 'beats-per-bar', { min: 1, max: 16, fallback: 4 });
  const unit = a.unit ?? 'beat';
  if (unit !== 'beat' && unit !== 'bar') throw new Error('--unit must be beat or bar.');
  const secondsPerBeat = 60 / bpm;
  const step = unit === 'bar' ? secondsPerBeat * beatsPerBar : secondsPerBeat;
  const markers = [];
  // Computed from the index, never accumulated, so markers do not drift.
  for (let i = 0; duration > 0 && i < 500; i++) {
    const t = offset + i * step;
    if (t > duration + 1e-9) break;
    markers.push(Math.round((Math.round(t * fps) / fps) * 1e6) / 1e6);
  }
  console.log(JSON.stringify({
    framesPerBeat: Math.round(secondsPerBeat * fps * 1000) / 1000,
    secondsPerBeat: Math.round(secondsPerBeat * 1e6) / 1e6,
    barSeconds: Math.round(secondsPerBeat * beatsPerBar * 1e6) / 1e6,
    markers,
  }));
} catch (e) {
  console.error(e instanceof Error ? e.message : String(e));
  process.exit(1);
}
