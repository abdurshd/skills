#!/usr/bin/env node

import { existsSync } from 'node:fs';
import { homedir } from 'node:os';
import { delimiter, join, resolve } from 'node:path';
import { spawnSync } from 'node:child_process';

const args = process.argv.slice(2);

if (args.includes('--help') || args.includes('-h')) {
  console.log(`Usage: node run-detector.mjs [impeccable detect options] <file-or-dir-or-url...>

Runs an already-installed Impeccable detector without downloading packages.
Passes all arguments through to "impeccable detect".

Examples:
  node run-detector.mjs --json src/
  node run-detector.mjs --json --scope type,layout index.html
  node run-detector.mjs --json --viewport 390x844 https://example.com

Set IMPECCABLE_DETECTOR to an explicit detect.mjs path when needed.
Set AGENT_SKILLS_DIRS to additional skill roots separated by the platform path delimiter.`);
  process.exit(0);
}

const cwd = process.cwd();
const explicit = process.env.IMPECCABLE_DETECTOR;
const clientDirectories = [
  '.agents',
  '.claude',
  '.codex',
  '.cursor',
  '.gemini',
  '.github',
  '.grok',
  '.opencode',
  '.kiro',
  '.qoder',
  '.trae',
  '.rovo',
];
const additionalSkillRoots = (process.env.AGENT_SKILLS_DIRS || '')
  .split(delimiter)
  .filter(Boolean);
const detectorCandidates = [
  explicit,
  ...additionalSkillRoots.map(root => resolve(root, 'impeccable/scripts/detect.mjs')),
  ...clientDirectories.map(root =>
    resolve(cwd, root, 'skills/impeccable/scripts/detect.mjs'),
  ),
  ...clientDirectories.map(root =>
    join(homedir(), root, 'skills/impeccable/scripts/detect.mjs'),
  ),
].filter(Boolean);

for (const detector of detectorCandidates) {
  if (!existsSync(detector)) continue;
  const result = spawnSync(process.execPath, [detector, ...args], {
    cwd,
    stdio: 'inherit',
  });
  if (result.error) {
    console.error(`Failed to run Impeccable detector at ${detector}: ${result.error.message}`);
    process.exit(3);
  }
  process.exit(result.status ?? 3);
}

const pathEntries = (process.env.PATH || '').split(delimiter);
const binaryName = process.platform === 'win32' ? 'impeccable.cmd' : 'impeccable';
const binaryCandidates = [
  resolve(cwd, 'node_modules/.bin', binaryName),
  ...pathEntries.filter(Boolean).map(entry => join(entry, binaryName)),
];

for (const binary of binaryCandidates) {
  if (!existsSync(binary)) continue;
  const result = spawnSync(binary, ['detect', ...args], {
    cwd,
    stdio: 'inherit',
  });
  if (result.error) {
    console.error(`Failed to run Impeccable binary at ${binary}: ${result.error.message}`);
    process.exit(3);
  }
  process.exit(result.status ?? 3);
}

console.error(`No installed Impeccable detector was found.

Continue with manual source and browser inspection, or—when package download is authorized—run:
  npx impeccable detect ${args.join(' ')}`.trim());
process.exit(3);
