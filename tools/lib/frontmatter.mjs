// Strict, dependency-free parser for the YAML subset that SKILL.md frontmatter
// needs. It deliberately rejects YAML features that the Agent Skills reference
// validator (skills-ref, which uses strictyaml) would reject or that make a
// value ambiguous: flow collections, anchors, aliases, tags, lists, tabs and
// duplicate keys. Anything outside the subset is an error, never a guess.
//
// Supported:
//   key: plain scalar
//   key: "double quoted"   key: 'single quoted'
//   key: >  / >- / | / |-  followed by indented lines (block scalars)
//   key:                    followed by indented "child: scalar" lines (one level)
//   # full-line comments

export class FrontmatterError extends Error {
  constructor(message, line) {
    super(line ? `line ${line}: ${message}` : message);
    this.line = line;
  }
}

/** Split a SKILL.md into { frontmatter (raw), body, bodyStartLine }. */
export function splitFrontmatter(text) {
  const src = text.replace(/\r\n?/g, '\n');
  if (!src.startsWith('---\n')) {
    throw new FrontmatterError('SKILL.md must start with a "---" frontmatter fence on line 1');
  }
  const end = src.indexOf('\n---', 3);
  if (end === -1) throw new FrontmatterError('frontmatter has no closing "---" fence');
  const after = src.slice(end + 4);
  if (after.length && after[0] !== '\n') {
    throw new FrontmatterError('closing "---" fence must be on its own line');
  }
  const raw = src.slice(4, end + 1);
  const bodyStartLine = raw.split('\n').length + 1;
  return { raw, body: after.replace(/^\n/, ''), bodyStartLine };
}

const KEY_RE = /^([A-Za-z0-9][A-Za-z0-9_-]*):(?:\s+(.*))?$/;

function parseScalar(value, lineNo) {
  const v = value.trim();
  if (v === '') return '';
  if (v.startsWith('"')) {
    if (!v.endsWith('"') || v.length < 2) throw new FrontmatterError('unterminated double-quoted string', lineNo);
    const inner = v.slice(1, -1);
    if (/(^|[^\\])"/.test(inner)) throw new FrontmatterError('unescaped " inside double-quoted string', lineNo);
    return inner.replace(/\\(["\\nt\/])/g, (_, c) => ({ n: '\n', t: '\t' }[c] ?? c));
  }
  if (v.startsWith("'")) {
    if (!v.endsWith("'") || v.length < 2) throw new FrontmatterError('unterminated single-quoted string', lineNo);
    const inner = v.slice(1, -1);
    if (/(^|[^'])'($|[^'])/.test(inner)) throw new FrontmatterError("unescaped ' inside single-quoted string (write '')", lineNo);
    return inner.replace(/''/g, "'");
  }
  if (/^[[{]/.test(v)) throw new FrontmatterError('flow collections ([...] or {...}) are not allowed', lineNo);
  if (/^[&*!]/.test(v)) throw new FrontmatterError('anchors, aliases and tags are not allowed', lineNo);
  if (/^[|>]/.test(v)) throw new FrontmatterError('block scalar indicator must be the whole value', lineNo);
  if (/^- /.test(v) || v === '-') throw new FrontmatterError('lists are not allowed', lineNo);
  if (/:\s/.test(v)) throw new FrontmatterError('plain value contains ": "; quote the value', lineNo);
  if (/\s#/.test(v)) throw new FrontmatterError('plain value contains " #" (a YAML comment); quote the value', lineNo);
  return v;
}

/**
 * Parse frontmatter text into an object. Nested maps are one level deep and
 * hold string values only. Returns { data, keyLines } where keyLines maps
 * top-level key to its 1-based line number inside the file.
 */
export function parseFrontmatter(raw) {
  const lines = raw.split('\n');
  if (lines[lines.length - 1] === '') lines.pop();
  const data = {};
  const keyLines = {};
  let i = 0;
  const fileLine = (idx) => idx + 2; // +1 for 1-based, +1 for the opening fence

  while (i < lines.length) {
    const line = lines[i];
    const ln = fileLine(i);
    if (line.includes('\t')) throw new FrontmatterError('tab characters are not allowed in frontmatter', ln);
    if (line.trim() === '' || /^\s*#/.test(line)) { i++; continue; }
    if (/^\s/.test(line)) throw new FrontmatterError('unexpected indentation', ln);
    const m = KEY_RE.exec(line);
    if (!m) throw new FrontmatterError(`expected "key: value", got ${JSON.stringify(line.slice(0, 40))}`, ln);
    const key = m[1];
    const rest = m[2] ?? '';
    if (Object.prototype.hasOwnProperty.call(data, key)) throw new FrontmatterError(`duplicate key "${key}"`, ln);
    keyLines[key] = ln;
    i++;

    const block = /^([|>])(-?)$/.exec(rest.trim());
    if (block) {
      const collected = [];
      let indent = null;
      while (i < lines.length && (lines[i].trim() === '' || /^\s/.test(lines[i]))) {
        if (lines[i].includes('\t')) throw new FrontmatterError('tab characters are not allowed in frontmatter', fileLine(i));
        if (lines[i].trim() !== '') {
          const ind = lines[i].match(/^ */)[0].length;
          if (indent === null) indent = ind;
          if (ind < indent) throw new FrontmatterError('inconsistent indentation in block scalar', fileLine(i));
          collected.push(lines[i].slice(indent));
        } else {
          collected.push('');
        }
        i++;
      }
      while (collected.length && collected[collected.length - 1] === '') collected.pop();
      if (!collected.length) throw new FrontmatterError(`block scalar "${key}" is empty`, ln);
      let value;
      if (block[1] === '|') {
        value = collected.join('\n');
      } else {
        // Folded: single newlines become spaces, blank lines become newlines.
        value = collected.join('\n').replace(/([^\n])\n(?=[^\n])/g, '$1 ').replace(/\n\n/g, '\n');
      }
      data[key] = block[2] === '-' ? value : value + '\n';
      continue;
    }

    if (rest.trim() === '') {
      // Either an empty value or a one-level nested map.
      const map = {};
      let any = false;
      while (i < lines.length && (lines[i].trim() === '' || /^\s/.test(lines[i]))) {
        const cl = lines[i];
        const cln = fileLine(i);
        if (cl.includes('\t')) throw new FrontmatterError('tab characters are not allowed in frontmatter', cln);
        if (cl.trim() === '' || /^\s*#/.test(cl)) { i++; continue; }
        const cm = /^ {2}([A-Za-z0-9][A-Za-z0-9_.-]*):(?:\s+(.*))?$/.exec(cl);
        if (!cm) throw new FrontmatterError(`nested entries must be "  key: value" with two-space indent (one level only)`, cln);
        if (Object.prototype.hasOwnProperty.call(map, cm[1])) throw new FrontmatterError(`duplicate key "${key}.${cm[1]}"`, cln);
        const cv = cm[2] ?? '';
        if (/^[|>]-?$/.test(cv.trim())) throw new FrontmatterError('block scalars are not allowed inside nested maps', cln);
        if (cv.trim() === '') throw new FrontmatterError(`nested key "${key}.${cm[1]}" has no value (only one level of nesting is allowed)`, cln);
        map[cm[1]] = parseScalar(cv, cln);
        any = true;
        i++;
      }
      data[key] = any ? map : '';
      continue;
    }

    data[key] = parseScalar(rest, ln);
  }
  return { data, keyLines };
}
