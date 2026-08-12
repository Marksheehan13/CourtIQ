import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import { execFileSync } from 'node:child_process';

test('production entrypoint exists and is valid JavaScript', () => {
  assert.ok(fs.existsSync('index.html'));
  assert.ok(fs.existsSync('src/main.js'));
  execFileSync(process.execPath, ['--check', 'src/main.js'], {stdio:'pipe'});
});

test('Netlify is configured for the Vite build output', () => {
  const config=fs.readFileSync('netlify.toml','utf8');
  assert.match(config,/command\s*=\s*"npm run build"/);
  assert.match(config,/publish\s*=\s*"dist"/);
  assert.match(config,/to\s*=\s*"\/index\.html"/);
});
