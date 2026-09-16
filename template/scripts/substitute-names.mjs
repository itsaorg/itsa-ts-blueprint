#!/usr/bin/env node
import {
  cpSync,
  existsSync,
  mkdirSync,
  readdirSync,
  readFileSync,
  statSync,
  writeFileSync,
} from 'node:fs';
import { join, relative } from 'node:path';

const REQUIRED_TOKENS = [
  '__REPO_NAME__',
  '__PACKAGE_NAME__',
  '__PACKAGE_NAME_UNSCOPED__',
  '__PACKAGE_DESCRIPTION__',
  '__GITHUB_ORG__',
  '__REPO_ID__',
  '__MVP_PHASE__',
  '__NODE_ENGINE__',
];

function parseArgs(argv) {
  const args = {};
  for (let i = 0; i < argv.length; i += 1) {
    const key = argv[i];
    const value = argv[i + 1];
    if (!key?.startsWith('--') || value === undefined) continue;
    args[key.slice(2)] = value;
    i += 1;
  }
  return args;
}

function deriveUnscoped(packageName) {
  if (packageName.startsWith('@')) {
    const parts = packageName.split('/');
    return parts[1] ?? packageName;
  }
  return packageName;
}

function walk(dir) {
  const entries = [];
  for (const name of readdirSync(dir)) {
    const full = join(dir, name);
    if (statSync(full).isDirectory()) entries.push(...walk(full));
    else entries.push(full);
  }
  return entries;
}

function shouldProcess(file) {
  const rel = relative(process.cwd(), file).replace(/\\/g, '/');
  if (rel.includes('node_modules/')) return false;
  if (rel.includes('.git/')) return false;
  return true;
}

function isTextCandidate(file) {
  return !/\.(png|jpg|jpeg|gif|webp|ico|woff2?|ttf|eot)$/i.test(file);
}

const args = parseArgs(process.argv.slice(2));
const repo = args.repo;
const pkg = args.package;
const description = args.description;
const repoId = args['repo-id'];
const phase = args.phase;
const out = args.out ?? '.';

if (!repo || !pkg || !description || !repoId || !phase) {
  console.error(
    'Usage: node scripts/substitute-names.mjs --repo <name> --package <@scope/name> --description <text> --repo-id <R#> --phase <P#> [--out <dir>]'
  );
  process.exit(1);
}

const templateDir = join(process.cwd(), 'template');
if (!existsSync(templateDir)) {
  console.error('Missing template/ directory');
  process.exit(1);
}

const replacements = {
  __REPO_NAME__: repo,
  __PACKAGE_NAME__: pkg,
  __PACKAGE_NAME_UNSCOPED__: deriveUnscoped(pkg),
  __PACKAGE_DESCRIPTION__: description,
  __GITHUB_ORG__: 'itsaorg',
  __REPO_ID__: repoId,
  __MVP_PHASE__: phase,
  __NODE_ENGINE__: '>=24.21.0',
};

mkdirSync(out, { recursive: true });
cpSync(templateDir, out, { recursive: true });

const files = walk(out).filter(shouldProcess).filter(isTextCandidate);
let leftoverTokens = new Set();

for (const file of files) {
  const rel = relative(out, file).replace(/\\/g, '/');
  if (rel === 'scripts/substitute-names.mjs') continue;

  const original = readFileSync(file, 'utf8');
  if (!REQUIRED_TOKENS.some((token) => original.includes(token))) continue;

  let next = original;
  for (const token of REQUIRED_TOKENS) {
    next = next.replaceAll(token, replacements[token]);
  }

  for (const token of REQUIRED_TOKENS) {
    if (next.includes(token)) leftoverTokens.add(token);
  }

  writeFileSync(file, next, 'utf8');
}

if (leftoverTokens.size > 0) {
  console.error('Unreplaced tokens remain:', [...leftoverTokens].join(', '));
  process.exit(1);
}

console.log(`Substitution complete in ${out}`);
for (const token of REQUIRED_TOKENS) {
  console.log(`  ${token} -> ${replacements[token]}`);
}
