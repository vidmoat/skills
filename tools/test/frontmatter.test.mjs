import test from 'node:test';
import assert from 'node:assert/strict';
import { splitFrontmatter, parseFrontmatter, FrontmatterError } from '../lib/frontmatter.mjs';

const parse = (raw) => parseFrontmatter(raw).data;

test('plain, quoted and nested values', () => {
  const d = parse('name: a-b\ndescription: "Say \\"hi\\" here"\nlicense: \'It\'\'s fine\'\nmetadata:\n  version: "1.2.3"\n  author: me\n');
  assert.equal(d.name, 'a-b');
  assert.equal(d.description, 'Say "hi" here');
  assert.equal(d.license, "It's fine");
  assert.deepEqual(d.metadata, { version: '1.2.3', author: 'me' });
});

test('folded and literal block scalars', () => {
  const d = parse('description: >\n  first line\n  second line\n\n  new para\nnotes: |-\n  a\n  b\n');
  assert.equal(d.description, 'first line second line\nnew para\n');
  assert.equal(d.notes, 'a\nb');
});

test('CRLF files split correctly', () => {
  const { raw, body } = splitFrontmatter('---\r\nname: x\r\n---\r\n# Body\r\n');
  assert.equal(parse(raw).name, 'x');
  assert.equal(body, '# Body\n');
});

for (const [label, raw] of [
  ['duplicate key', 'name: a\nname: b\n'],
  ['tab', 'name:\ta\n'],
  ['flow list', 'allowed-tools: [Read, Bash]\n'],
  ['flow map', 'metadata: {version: 1}\n'],
  ['anchor', 'name: &x a\n'],
  ['list item', 'name:\n  - a\n'],
  ['colon in plain value', 'description: Use this: always\n'],
  ['comment in plain value', 'description: hello #there\n'],
  ['two-level nesting', 'metadata:\n  a:\n    b: c\n'],
  ['bad indentation', 'metadata:\n   version: 1\n'],
  ['unterminated quote', 'name: "abc\n'],
]) {
  test(`rejects ${label}`, () => {
    assert.throws(() => parse(raw), FrontmatterError);
  });
}

test('missing fences are errors', () => {
  assert.throws(() => splitFrontmatter('# no frontmatter\n'), FrontmatterError);
  assert.throws(() => splitFrontmatter('---\nname: x\n'), FrontmatterError);
});
