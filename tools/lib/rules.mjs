// Every rule the skills linter enforces. Rule ids are stable: docs, CI output
// and the tests all refer to them. See docs/authoring.md for the human version.

import fs from 'node:fs';
import path from 'node:path';
import { splitFrontmatter, parseFrontmatter, FrontmatterError } from './frontmatter.mjs';

export const RULES = {
  SK001: 'frontmatter must exist and parse as the strict YAML subset',
  SK002: 'only spec frontmatter fields are allowed',
  SK003: 'name must follow the Agent Skills spec format',
  SK004: 'name must equal the folder name',
  SK005: 'name must not contain reserved words',
  SK006: 'description length must be 40 to 1024 characters',
  SK007: 'description must say when to use the skill',
  SK008: 'compatibility must be at most 500 characters',
  SK009: 'metadata must be a map of string keys to string values',
  SK010: 'metadata.version must be semver',
  SK011: 'SKILL.md must be under 500 lines',
  SK012: 'SKILL.md body should stay under about 5000 tokens',
  SK013: 'file references must be one level deep from SKILL.md',
  SK014: 'local links must point at files that exist inside the skill',
  SK015: 'no hidden Unicode (tag characters, zero-width, bidi controls, stray control characters)',
  SK016: 'no HTML comments in skill Markdown (hidden instructions)',
  SK017: 'scripts must not make network calls',
  SK018: 'scripts must not install packages',
  SK019: 'allowed-tools in community skills needs the maintainer label',
  SK020: 'file size limits',
  SK021: 'binary files only under assets/',
  SK022: 'no symbolic links',
  SK023: 'evals/evals.json must exist and follow the repo schema',
  SK024: 'SKILL.md must have a Gotchas section with at least one item',
  SK025: 'no instruction patterns associated with prompt injection or exfiltration',
  SK026: 'no download-and-execute pipelines anywhere',
  SK027: 'skill names must be unique across tiers',
  SK028: 'skills/ may only contain core/, community/ and vidmoat/',
  SK029: 'vidmoat-tier skills follow the product format so they can be imported back',
};

// The tiers, in catalogue order. `vidmoat` holds the official Vidmoat product
// skills. This repository is their master copy: the product imports them
// byte-for-byte at a pinned commit into its skills/<name>/ (its
// ops/skills-import.mts), so they must also pass the product's validator.
// See docs/product-import.md.
export const TIERS = ['core', 'community', 'vidmoat'];

// Product skill categories (the product's src/lib/skills/format.ts).
export const PRODUCT_CATEGORIES = new Set(['specialist', 'craft', 'reference', 'manual']);

// SK025 exemptions for the vidmoat tier ONLY, by exact sentence. Each one was
// read by a maintainer and is not what the pattern is for. Any other wording,
// and the same sentence in any other tier, still fails.
//  - talking-head: an honesty rule (do not claim a loudness target that peak
//    normalisation cannot reach), not concealment of an action from the user.
export const VIDMOAT_REVIEWED_SENTENCES = {
  'talking-head/SKILL.md': ['Never tell the user their audio is at a loudness target.'],
};

export const ALLOWED_FIELDS = new Set(['name', 'description', 'license', 'compatibility', 'metadata', 'allowed-tools']);
export const MAINTAINER_TOOLS_LABEL = 'allowed-tools-approved';

export const LIMITS = {
  skillMdLines: 500,
  skillMdTokens: 5000,
  descriptionMin: 40,
  descriptionMax: 1024,
  descriptionWarn: 700,
  compatibilityMax: 500,
  fileBytes: 1024 * 1024,          // any single file
  skillMdBytes: 64 * 1024,
  skillTotalBytes: 5 * 1024 * 1024,
  minTriggerPositive: 5,
  minTriggerNegative: 5,
  minNearMiss: 3,
  minOutputEvals: 2,
  minAssertions: 2,
};

const NAME_RE = /^[a-z0-9]+(-[a-z0-9]+)*$/;
const SEMVER_RE = /^(0|[1-9]\d*)\.(0|[1-9]\d*)\.(0|[1-9]\d*)(-[0-9A-Za-z.-]+)?(\+[0-9A-Za-z.-]+)?$/;
// Product descriptions may say when with a moment ("Use at the start of a
// session"). Accepted in the vidmoat tier only, where the product validator
// has already required a when clause.
const VIDMOAT_WHEN_RE = /\buse (at|before|after|during) (the )?(start|end|beginning)\b/i;
const WHEN_RE = /\b(use (this|it|when|for|whenever|if|on)\b|use this skill|when (the user|a user|users|you|someone|asked|working|editing|making|adding|mixing)\b|whenever\b|trigger(s|ed)? (on|when)\b|even if\b)/i;

const TEXT_EXT = new Set(['.md', '.txt', '.json', '.yaml', '.yml', '.py', '.sh', '.bash', '.zsh', '.js', '.mjs', '.cjs',
  '.ts', '.ps1', '.rb', '.pl', '.csv', '.tsv', '.srt', '.vtt', '.ass', '.ssa', '.xml', '.html', '.css', '.toml', '.ini', '.cfg', '.lua', '']);

// U+E0000..U+E007F tag characters, zero-width and bidi controls, soft hyphen,
// BOM anywhere, and C0/C1 controls other than tab/newline/carriage return.
const HIDDEN_RE = /[\u{E0000}-\u{E007F}\u200B-\u200F\u2028\u2029\u202A-\u202E\u2060-\u2064\u2066-\u2069\u206A-\u206F\uFEFF\u00AD\u061C\u180E\u0000-\u0008\u000B\u000C\u000E-\u001F\u007F-\u009F]/u;

const NETWORK_PATTERNS = [
  [/\b(curl|wget|aria2c)\b/, 'curl/wget'],
  [/\b(Invoke-WebRequest|Invoke-RestMethod|Start-BitsTransfer|Net\.WebClient|HttpClient)\b/i, 'PowerShell web request'],
  [/(^|[;|&\s(])(iwr|irm)\s/i, 'PowerShell web request alias'],
  [/\b(import|from)\s+(requests|urllib3|urllib|httpx|aiohttp|socket|ftplib|smtplib|telnetlib|paramiko|websocket|websockets|http\.client|xmlrpc)\b/, 'Python network module'],
  [/\burlopen\s*\(|\burlretrieve\s*\(/, 'Python urlopen'],
  [/\bfetch\s*\(/, 'fetch()'],
  [/\b(XMLHttpRequest|WebSocket|EventSource|axios|node-fetch|undici)\b/, 'JS network client'],
  [/(require\(\s*|from\s+|import\s*\(\s*)['"](node:)?(http|https|http2|net|dgram|tls|dns)['"]/, 'Node network module'],
  [/\b(nc|ncat|netcat|telnet|ftp|sftp|scp|ssh)\s+-?[\w.]/, 'network CLI'],
  [/\/dev\/(tcp|udp)\//, 'bash /dev/tcp'],
];

const INSTALL_PATTERNS = [
  [/\b(pip3?|pipx|conda|mamba|micromamba)\s+install\b/, 'pip/conda install'],
  [/\buv\s+(pip\s+install|add|tool\s+install|sync)\b/, 'uv install'],
  [/\b(npm|yarn|pnpm|bun)\s+(i|install|ci|add)\b/, 'JS package install'],
  [/\b(npx|bunx|pnpx)\s/, 'npx-style remote execution'],
  [/\bapt(-get)?\s+install\b|\b(brew|choco|winget|scoop|apk|dnf|yum|zypper|port|snap|flatpak)\s+install\b|\bpacman\s+-S\b/, 'system package install'],
  [/\b(gem|cargo|go|dotnet\s+tool|Install-Module|Install-Package)\s+(install|get)\b|\bInstall-(Module|Package)\b/, 'language package install'],
  [/\bensurepip\b|\bimport\s+pip\b|__import__\(\s*['"]pip['"]/, 'pip bootstrap'],
];

const SUSPICIOUS_PATTERNS = [
  [/\b(ignore|disregard|forget|override)\s+(all\s+|any\s+|the\s+)?(previous|prior|above|earlier|system|other)\s+(instructions|prompts?|messages|rules)/i, 'instruction override'],
  [/\bnew system prompt\b|\b(system|developer)\s+override\b|\bjailbreak\b/i, 'system prompt override'],
  [/\b(do not|don't|never)\s+(tell|inform|show|mention|reveal)\s+(this\s+)?(to\s+)?the user\b/i, 'concealment from the user'],
  [/\$\{?[A-Z0-9_]*(API_KEY|_TOKEN|SECRET|PASSWORD|CREDENTIALS?)\b/, 'secret environment variable reference'],
  [/~\/\.ssh\b|\bid_(rsa|ed25519)\b|\.aws\/credentials|\.netrc\b|\.npmrc\b|\.pypirc\b|\.git-credentials\b/, 'credential file path'],
  [/\b(write|append|add|copy|insert)\b[^.\n]{0,80}\b(to|into)\b[^.\n]{0,40}(CLAUDE\.md|AGENTS\.md|GEMINI\.md|\.cursorrules|\.cursor\/rules|copilot-instructions\.md|settings(\.local)?\.json|\.bashrc|\.zshrc|\.profile|crontab)/i, 'persistence into agent or shell config'],
];

const REMOTE_EXEC_RE = /\b(curl|wget|iwr|irm|Invoke-WebRequest|Invoke-RestMethod)\b[^\n|]*\|\s*(sudo\s+)?(sh|bash|zsh|python3?|node|iex|Invoke-Expression|pwsh|powershell)\b/i;

function finding(rule, level, file, message, line) {
  return { rule, level, file, line: line ?? null, message };
}

function isBinary(buf) {
  const n = Math.min(buf.length, 8192);
  for (let i = 0; i < n; i++) if (buf[i] === 0) return true;
  return false;
}

function walk(dir, base = dir, out = []) {
  for (const ent of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, ent.name);
    const rel = path.relative(base, full).split(path.sep).join('/');
    if (ent.isSymbolicLink()) { out.push({ full, rel, symlink: true }); continue; }
    if (ent.isDirectory()) walk(full, base, out);
    else if (ent.isFile()) out.push({ full, rel, symlink: false });
  }
  return out;
}

function lineOf(text, index) {
  let n = 1;
  for (let i = 0; i < index && i < text.length; i++) if (text.charCodeAt(i) === 10) n++;
  return n;
}

function describeCodePoint(ch) {
  return 'U+' + ch.codePointAt(0).toString(16).toUpperCase().padStart(4, '0');
}

/** Strip fenced code blocks and inline code so Markdown link checks ignore examples. */
function stripCode(md) {
  return md.replace(/```[\s\S]*?```/g, (m) => m.replace(/[^\n]/g, ' ')).replace(/`[^`\n]*`/g, (m) => ' '.repeat(m.length));
}

/** Local link targets in Markdown: [text](target) and <img src>. */
export function localLinks(md) {
  const clean = stripCode(md);
  const links = [];
  const re = /\]\(\s*<?([^)\s>]+)>?(?:\s+"[^"]*")?\s*\)/g;
  let m;
  while ((m = re.exec(clean))) {
    const target = m[1];
    if (/^(https?:|mailto:|#|data:)/i.test(target)) continue;
    links.push({ target: target.split('#')[0], index: m.index });
  }
  return links.filter((l) => l.target);
}

/** Bare relative paths mentioned in prose or code, e.g. scripts/check.py. */
function mentionedPaths(md) {
  const out = [];
  const re = /(?<![\w./-])((?:references|scripts|assets|evals)\/[\w./-]+[\w])/g;
  let m;
  while ((m = re.exec(md))) out.push({ target: m[1], index: m.index });
  return out;
}

export function estimateTokens(text) {
  // Rough and deliberately conservative: about 4 characters per token.
  return Math.ceil(text.length / 4);
}

function validateEvals(evalsPath, rel, name, skillDir, findings) {
  let data;
  try {
    data = JSON.parse(fs.readFileSync(evalsPath, 'utf8'));
  } catch (e) {
    findings.push(finding('SK023', 'error', rel, `evals.json is not valid JSON: ${e.message}`));
    return;
  }
  const err = (msg) => findings.push(finding('SK023', 'error', rel, msg));
  if (data.skill_name !== name) err(`skill_name must be "${name}" (got ${JSON.stringify(data.skill_name)})`);

  const triggers = Array.isArray(data.trigger_cases) ? data.trigger_cases : null;
  if (!triggers) err('trigger_cases must be an array');
  else {
    const ids = new Set();
    let pos = 0, neg = 0, near = 0;
    triggers.forEach((t, i) => {
      if (!t || typeof t.query !== 'string' || !t.query.trim()) err(`trigger_cases[${i}].query must be a non-empty string`);
      if (typeof t.should_trigger !== 'boolean') err(`trigger_cases[${i}].should_trigger must be true or false`);
      if (t.id === undefined || ids.has(String(t.id))) err(`trigger_cases[${i}].id must be present and unique`);
      ids.add(String(t?.id));
      if (t?.should_trigger === true) pos++;
      if (t?.should_trigger === false) { neg++; if (t.near_miss === true) near++; }
      if (t?.near_miss === true && t?.should_trigger !== false) err(`trigger_cases[${i}] near_miss is only meaningful on a should_trigger:false case`);
    });
    if (pos < LIMITS.minTriggerPositive) err(`need at least ${LIMITS.minTriggerPositive} should_trigger:true cases (have ${pos})`);
    if (neg < LIMITS.minTriggerNegative) err(`need at least ${LIMITS.minTriggerNegative} should_trigger:false cases (have ${neg})`);
    if (near < LIMITS.minNearMiss) err(`need at least ${LIMITS.minNearMiss} negatives marked "near_miss": true (have ${near})`);
  }

  const evals = Array.isArray(data.evals) ? data.evals : null;
  if (!evals) err('evals must be an array');
  else {
    if (evals.length < LIMITS.minOutputEvals) err(`need at least ${LIMITS.minOutputEvals} output evals (have ${evals.length})`);
    const ids = new Set();
    evals.forEach((e, i) => {
      if (!e || typeof e.prompt !== 'string' || !e.prompt.trim()) err(`evals[${i}].prompt must be a non-empty string`);
      if (typeof e?.expected_output !== 'string' || !e.expected_output.trim()) err(`evals[${i}].expected_output must be a non-empty string`);
      if (e?.id === undefined || ids.has(String(e.id))) err(`evals[${i}].id must be present and unique`);
      ids.add(String(e?.id));
      if (!Array.isArray(e?.assertions) || e.assertions.length < LIMITS.minAssertions || e.assertions.some((a) => typeof a !== 'string' || !a.trim())) {
        err(`evals[${i}].assertions must hold at least ${LIMITS.minAssertions} non-empty strings`);
      }
      if (e?.files !== undefined) {
        if (!Array.isArray(e.files)) err(`evals[${i}].files must be an array`);
        else for (const f of e.files) {
          const p = path.resolve(skillDir, String(f));
          if (!p.startsWith(path.resolve(skillDir) + path.sep) || !fs.existsSync(p)) err(`evals[${i}].files entry "${f}" must exist inside the skill folder`);
        }
      }
    });
  }
}

/**
 * Lint one skill folder.
 * @param {string} skillDir absolute path
 * @param {{tier: 'core'|'community'|'vidmoat', labels?: string[], relBase?: string, coreNames?: Set<string>}} opts
 *   coreNames: the core skills in the repository (vidmoat tier: a product
 *   skill links references/<core-name>.md, which the product build merges in).
 */
export function lintSkill(skillDir, opts) {
  const { tier, labels = [] } = opts;
  const vidmoat = tier === 'vidmoat';
  const relBase = opts.relBase ?? path.dirname(path.dirname(path.dirname(skillDir)));
  const coreNames = opts.coreNames ?? new Set();
  const relSkill = path.relative(relBase, skillDir).split(path.sep).join('/');
  const findings = [];
  const folder = path.basename(skillDir);
  const skillMdPath = path.join(skillDir, 'SKILL.md');
  const relMd = `${relSkill}/SKILL.md`;
  let meta = null;

  // ---- files: symlinks, sizes, binaries, hidden unicode, scripts --------
  const files = walk(skillDir);
  let total = 0;
  for (const f of files) {
    const relFile = `${relSkill}/${f.rel}`;
    if (f.symlink) { findings.push(finding('SK022', 'error', relFile, 'symbolic links are not allowed (they can point outside the skill)')); continue; }
    const buf = fs.readFileSync(f.full);
    total += buf.length;
    if (buf.length > LIMITS.fileBytes) findings.push(finding('SK020', 'error', relFile, `file is ${buf.length} bytes; limit is ${LIMITS.fileBytes}`));
    const ext = path.extname(f.rel).toLowerCase();
    const binary = isBinary(buf) || !TEXT_EXT.has(ext);
    if (binary) {
      if (!f.rel.startsWith('assets/')) findings.push(finding('SK021', 'error', relFile, 'binary or non-text files may only live under assets/'));
      continue;
    }
    const text = buf.toString('utf8');
    const hidden = HIDDEN_RE.exec(text);
    if (hidden) {
      findings.push(finding('SK015', 'error', relFile, `hidden or control character ${describeCodePoint(hidden[0])}`, lineOf(text, hidden.index)));
    }
    if (REMOTE_EXEC_RE.test(text)) {
      const idx = text.search(REMOTE_EXEC_RE);
      findings.push(finding('SK026', 'error', relFile, 'download piped into an interpreter', lineOf(text, idx)));
    }
    if (vidmoat && text.includes('\u2014')) {
      findings.push(finding('SK029', 'error', relFile, 'em dash; the product format refuses them (use a comma, colon or full stop)', lineOf(text, text.indexOf('\u2014'))));
    }
    if (ext === '.md') {
      const c = text.indexOf('<!--');
      if (c !== -1) findings.push(finding('SK016', 'error', relFile, 'HTML comment found; comments are invisible to reviewers but read by models', lineOf(text, c)));
    }
    if (ext === '.md' || f.rel.startsWith('references/') || f.rel.startsWith('scripts/')) {
      const reviewed = vidmoat ? (VIDMOAT_REVIEWED_SENTENCES[`${folder}/${f.rel}`] ?? []) : [];
      let scanned = text;
      for (const sentence of reviewed) scanned = scanned.split(sentence).join(' '.repeat(sentence.length));
      for (const [re, label] of SUSPICIOUS_PATTERNS) {
        const m = re.exec(scanned);
        if (m) findings.push(finding('SK025', 'error', relFile, `${label}: "${m[0].slice(0, 60)}"`, lineOf(text, m.index)));
      }
    }
    if (f.rel.startsWith('scripts/')) {
      const lines = text.split(/\r?\n/);
      lines.forEach((ln, idx) => {
        for (const [re, label] of NETWORK_PATTERNS) {
          if (re.test(ln)) findings.push(finding('SK017', 'error', relFile, `network access (${label})`, idx + 1));
        }
        const code = ln.replace(/^\s*(#|\/\/|;|--|REM\b).*$/i, '');
        if (/\b(https?|ftp|wss?):\/\//i.test(code)) findings.push(finding('SK017', 'error', relFile, 'URL in executable code (ffmpeg and friends will fetch it)', idx + 1));
        // Argument lists such as ["pip", "install", "x"] split the words with
        // quotes and commas, so also match against a flattened copy.
        const flat = ln.replace(/["'`,[\](){}]/g, ' ').replace(/\s+/g, ' ');
        for (const [re, label] of INSTALL_PATTERNS) {
          if (re.test(ln) || re.test(flat)) findings.push(finding('SK018', 'error', relFile, `package install (${label})`, idx + 1));
        }
      });
    }
  }
  if (vidmoat) {
    for (const f of files) {
      if (f.symlink || f.rel === 'SKILL.md') continue;
      const parts = f.rel.split('/');
      const ok = parts.length === 2 && (
        (parts[0] === 'references' && parts[1].endsWith('.md'))
        || (parts[0] === 'scripts' && /\.(mjs|js|py|sh)$/.test(parts[1]))
        || parts[0] === 'assets');
      if (!ok) {
        const why = parts[0] === 'evals'
          ? 'vidmoat-tier skills carry no evals/: their trigger cases and evals live in the product repository'
          : 'the product format allows only SKILL.md, references/*.md, scripts/*.{mjs,js,py,sh} and assets/, one level deep';
        findings.push(finding('SK029', 'error', `${relSkill}/${f.rel}`, why));
      }
    }
  }
  if (total > LIMITS.skillTotalBytes) findings.push(finding('SK020', 'error', relSkill, `skill folder is ${total} bytes; limit is ${LIMITS.skillTotalBytes}`));

  // ---- SKILL.md --------------------------------------------------------
  if (!fs.existsSync(skillMdPath)) {
    findings.push(finding('SK001', 'error', relMd, 'missing SKILL.md'));
    return { name: folder, meta, findings };
  }
  const md = fs.readFileSync(skillMdPath, 'utf8');
  if (Buffer.byteLength(md) > LIMITS.skillMdBytes) findings.push(finding('SK020', 'error', relMd, `SKILL.md exceeds ${LIMITS.skillMdBytes} bytes`));
  const lineCount = md.replace(/\r\n?/g, '\n').replace(/\n$/, '').split('\n').length;
  if (lineCount >= LIMITS.skillMdLines) findings.push(finding('SK011', 'error', relMd, `SKILL.md has ${lineCount} lines; keep it under ${LIMITS.skillMdLines} and move detail to references/`));

  let split;
  try {
    split = splitFrontmatter(md);
    meta = parseFrontmatter(split.raw);
  } catch (e) {
    if (!(e instanceof FrontmatterError)) throw e;
    findings.push(finding('SK001', 'error', relMd, e.message, e.line));
    return { name: folder, meta: null, findings };
  }
  const { data, keyLines } = meta;

  for (const k of Object.keys(data)) {
    if (!ALLOWED_FIELDS.has(k)) findings.push(finding('SK002', 'error', relMd, `unexpected frontmatter field "${k}" (allowed: ${[...ALLOWED_FIELDS].join(', ')})`, keyLines[k]));
  }

  const name = data.name;
  if (typeof name !== 'string' || !name) {
    findings.push(finding('SK003', 'error', relMd, 'missing required field "name"'));
  } else {
    if (name.length > 64 || !NAME_RE.test(name)) {
      findings.push(finding('SK003', 'error', relMd, `name "${name}" must be 1-64 chars of a-z, 0-9 and single hyphens, not starting or ending with a hyphen`, keyLines.name));
    }
    if (name !== folder) findings.push(finding('SK004', 'error', relMd, `name "${name}" must equal folder name "${folder}"`, keyLines.name));
    // "vidmoat" is reserved for the official product skills in skills/vidmoat/.
    const reserved = ['claude', 'anthropic'];
    if (!vidmoat) reserved.push('vidmoat');
    for (const word of reserved) {
      if (name.includes(word)) {
        findings.push(finding('SK005', 'error', relMd, `name must not contain "${word}"${word === 'vidmoat' ? ` in ${tier} skills; only the official product skills in skills/vidmoat/ may (see TRADEMARKS.md)` : ''}`, keyLines.name));
      }
    }
  }

  const desc = data.description;
  if (typeof desc !== 'string' || !desc.trim()) {
    findings.push(finding('SK006', 'error', relMd, 'missing required field "description"'));
  } else {
    const len = desc.trim().length;
    if (len < LIMITS.descriptionMin || desc.length > LIMITS.descriptionMax) {
      findings.push(finding('SK006', 'error', relMd, `description is ${desc.length} chars; must be ${LIMITS.descriptionMin}-${LIMITS.descriptionMax}`, keyLines.description));
    } else if (len > LIMITS.descriptionWarn) {
      findings.push(finding('SK006', 'warning', relMd, `description is ${len} chars; it loads for every session, so aim for under ${LIMITS.descriptionWarn}`, keyLines.description));
    }
    const saysWhen = WHEN_RE.test(desc) || (vidmoat && VIDMOAT_WHEN_RE.test(desc));
    if (!saysWhen) {
      findings.push(finding('SK007', 'error', relMd, 'description must say WHEN to use the skill (for example "Use when the user...")', keyLines.description));
    }
    const firstWhen = desc.search(WHEN_RE);
    if (firstWhen !== -1 && desc.slice(0, firstWhen).trim().split(/\s+/).filter(Boolean).length < 4) {
      // "Use when..." with nothing before it: require what-it-does to appear after.
      const whatWords = desc.replace(WHEN_RE, '').trim().split(/\s+/).length;
      if (whatWords < 12) findings.push(finding('SK007', 'error', relMd, 'description must also say WHAT the skill does, not only when to use it', keyLines.description));
    }
  }

  if (data.compatibility !== undefined) {
    if (typeof data.compatibility !== 'string' || !data.compatibility.trim() || data.compatibility.length > LIMITS.compatibilityMax) {
      findings.push(finding('SK008', 'error', relMd, `compatibility must be 1-${LIMITS.compatibilityMax} characters`, keyLines.compatibility));
    }
  }
  if (data.license !== undefined && (typeof data.license !== 'string' || !data.license.trim())) {
    findings.push(finding('SK002', 'error', relMd, 'license must be a non-empty string', keyLines.license));
  }

  const metadata = data.metadata;
  if (metadata === undefined || metadata === '' || typeof metadata !== 'object') {
    findings.push(finding('SK009', 'error', relMd, 'metadata map is required (it carries version)', keyLines.metadata));
  } else {
    for (const [k, v] of Object.entries(metadata)) {
      if (typeof v !== 'string') findings.push(finding('SK009', 'error', relMd, `metadata.${k} must be a string`, keyLines.metadata));
    }
    if (vidmoat) {
      if (typeof metadata.owner !== 'string' || !metadata.owner) findings.push(finding('SK029', 'error', relMd, 'metadata.owner is required in the product format', keyLines.metadata));
      if (!PRODUCT_CATEGORIES.has(metadata.category)) findings.push(finding('SK029', 'error', relMd, `metadata.category must be one of ${[...PRODUCT_CATEGORIES].join(', ')}`, keyLines.metadata));
    }
    if (typeof metadata.version !== 'string' || !SEMVER_RE.test(metadata.version)) {
      findings.push(finding('SK010', 'error', relMd, `metadata.version must be a quoted semver string such as "1.0.0" (got ${JSON.stringify(metadata.version)})`, keyLines.metadata));
    }
  }

  if (data['allowed-tools'] !== undefined) {
    if (tier === 'community' && !labels.includes(MAINTAINER_TOOLS_LABEL)) {
      findings.push(finding('SK019', 'error', relMd, `allowed-tools pre-approves tool use; community skills need a maintainer to apply the "${MAINTAINER_TOOLS_LABEL}" label`, keyLines['allowed-tools']));
    } else if (tier === 'core') {
      findings.push(finding('SK019', 'warning', relMd, 'allowed-tools present; a maintainer must review the tool list', keyLines['allowed-tools']));
    }
  }

  const body = split.body;
  const tokens = estimateTokens(body);
  if (tokens > LIMITS.skillMdTokens) findings.push(finding('SK012', 'warning', relMd, `body is about ${tokens} tokens; aim for under ${LIMITS.skillMdTokens}`));

  // A product reference skill (the editing glossary) is a term list with no
  // procedure to get wrong; the product holds it to a machine check of every
  // term instead. Every other skill, in every tier, needs Gotchas.
  const gotchaExempt = vidmoat && metadata && typeof metadata === 'object' && metadata.category === 'reference';
  const gotchas = /^#{2,3}\s+Gotchas\b[^\n]*\n([\s\S]*?)(?=^#{1,3}\s|(?![\s\S]))/im.exec(body);
  if (!gotchaExempt && (!gotchas || !/^\s*[-*]\s+\S|^\s*\d+\.\s+\S/m.test(gotchas[1]))) {
    findings.push(finding('SK024', 'error', relMd, 'add a "## Gotchas" section listing concrete corrections from real failures'));
  }

  // ---- references: one level deep, links resolve -----------------------
  const mdFiles = files.filter((f) => !f.symlink && f.rel.endsWith('.md'));
  for (const f of mdFiles) {
    const text = fs.readFileSync(f.full, 'utf8');
    const fromDir = path.dirname(f.full);
    const relFile = `${relSkill}/${f.rel}`;
    const isSkillMd = f.rel === 'SKILL.md';
    const targets = [...localLinks(text).map((l) => ({ ...l, kind: 'link' })), ...(isSkillMd ? mentionedPaths(stripCode(text)).map((l) => ({ ...l, kind: 'mention' })) : [])];
    for (const t of targets) {
      const resolved = path.resolve(fromDir, decodeURIComponent(t.target));
      const relToSkill = path.relative(skillDir, resolved).split(path.sep).join('/');
      const line = lineOf(text, t.index);
      if (relToSkill.startsWith('..') || path.isAbsolute(relToSkill)) {
        findings.push(finding('SK014', 'error', relFile, `link "${t.target}" points outside the skill folder`, line));
        continue;
      }
      if (!fs.existsSync(resolved)) {
        // vidmoat tier: references/<core-skill>.md is that core skill, which the
        // product build merges into this skill (one skill per topic).
        const merged = vidmoat && isSkillMd && /^references\/([a-z0-9-]+)\.md$/.exec(relToSkill);
        if (merged && coreNames.has(merged[1])) continue;
        findings.push(finding('SK014', 'error', relFile, `link target "${t.target}" does not exist`, line));
        continue;
      }
      if (isSkillMd && relToSkill.split('/').length > 2) {
        findings.push(finding('SK013', 'error', relFile, `"${t.target}" is nested too deep; keep referenced files one directory below SKILL.md`, line));
      }
      if (!isSkillMd && relToSkill.endsWith('.md') && relToSkill !== 'SKILL.md' && t.kind === 'link') {
        findings.push(finding('SK013', 'error', relFile, `reference files must not chain to other Markdown files ("${t.target}"); link it from SKILL.md instead`, line));
      }
    }
  }
  for (const f of files) {
    if (!f.symlink && f.rel.startsWith('references/') && f.rel.split('/').length > 2) {
      findings.push(finding('SK013', 'error', `${relSkill}/${f.rel}`, 'references/ must be flat (one level deep)'));
    }
  }

  // ---- evals -----------------------------------------------------------
  // vidmoat tier: none here (SK029 refuses an evals/ folder); the product
  // repository evaluates its skills (trigger suite and replay evals).
  const evalsPath = path.join(skillDir, 'evals', 'evals.json');
  if (vidmoat) {
    // nothing to validate
  } else if (!fs.existsSync(evalsPath)) {
    findings.push(finding('SK023', 'error', `${relSkill}/evals/evals.json`, 'missing evals/evals.json (trigger cases and output cases are required)'));
  } else if (typeof name === 'string') {
    validateEvals(evalsPath, `${relSkill}/evals/evals.json`, name, skillDir, findings);
  }

  return { name: typeof name === 'string' ? name : folder, meta: data, findings };
}

/** Discover skills under <root>/skills and lint all of them plus cross-skill rules. */
export function lintRepo(root, { labels = [], only = null } = {}) {
  const skillsRoot = path.join(root, 'skills');
  const findings = [];
  const skills = [];
  if (!fs.existsSync(skillsRoot)) {
    findings.push(finding('SK028', 'error', 'skills', 'skills/ directory not found'));
    return { skills, findings };
  }
  for (const ent of fs.readdirSync(skillsRoot, { withFileTypes: true })) {
    if (ent.isDirectory() && TIERS.includes(ent.name)) continue;
    if (ent.isFile() && ent.name === 'README.md') continue;
    findings.push(finding('SK028', 'error', `skills/${ent.name}`, 'only skills/core/, skills/community/, skills/vidmoat/ and skills/README.md are allowed here'));
  }
  const coreDir = path.join(skillsRoot, 'core');
  const coreNames = new Set(fs.existsSync(coreDir) ? fs.readdirSync(coreDir, { withFileTypes: true }).filter((e) => e.isDirectory()).map((e) => e.name) : []);
  const seen = new Map();
  for (const tier of TIERS) {
    const tierDir = path.join(skillsRoot, tier);
    if (!fs.existsSync(tierDir)) continue;
    for (const ent of fs.readdirSync(tierDir, { withFileTypes: true }).sort((a, b) => a.name.localeCompare(b.name))) {
      if (ent.isFile() && (ent.name === 'README.md' || ent.name === '.gitkeep')) continue;
      if (ent.isSymbolicLink()) { findings.push(finding('SK022', 'error', `skills/${tier}/${ent.name}`, 'symbolic links are not allowed')); continue; }
      if (!ent.isDirectory()) { findings.push(finding('SK028', 'error', `skills/${tier}/${ent.name}`, 'only skill folders (and README.md) belong in a tier folder')); continue; }
      if (only && !only.includes(ent.name)) continue;
      const dir = path.join(tierDir, ent.name);
      const res = lintSkill(dir, { tier, labels, relBase: root, coreNames });
      findings.push(...res.findings);
      skills.push({ tier, folder: ent.name, dir, name: res.name, meta: res.meta });
      if (seen.has(res.name)) {
        findings.push(finding('SK027', 'error', `skills/${tier}/${ent.name}`, `skill name "${res.name}" is already used by skills/${seen.get(res.name)}/${res.name}`));
      } else seen.set(res.name, tier);
    }
  }
  return { skills, findings };
}
