// Builds the site and publishes dist/ to the gh-pages branch (GitHub Pages serves that branch).
// Usage:  npm run deploy      (or:  node scripts/deploy-pages.mjs)
// Runs every command directly (no shell), so it works even if the Windows shell setting is broken.
import { execFileSync } from 'node:child_process';
import { existsSync, rmSync, writeFileSync } from 'node:fs';
import { resolve } from 'node:path';

const root = resolve(import.meta.dirname, '..');
const dist = resolve(root, 'dist');
const run = (file, args, cwd = root) => execFileSync(file, args, { cwd, stdio: 'inherit' });
const git = (args, cwd = root) => execFileSync('git', args, { cwd }).toString().trim();

const remote = git(['remote', 'get-url', 'origin']);
const who = ['-c', `user.name=${git(['config', 'user.name'])}`, '-c', `user.email=${git(['config', 'user.email'])}`];

run(process.execPath, [resolve(root, 'node_modules/typescript/bin/tsc'), '--noEmit']);
run(process.execPath, [resolve(root, 'node_modules/vite/bin/vite.js'), 'build']);
writeFileSync(resolve(dist, '.nojekyll'), ''); // serve files as-is (no Jekyll processing)

const repo = resolve(dist, '.git');
if (existsSync(repo)) rmSync(repo, { recursive: true, force: true });
run('git', ['init', '-q', '-b', 'gh-pages'], dist);
run('git', [...who, 'add', '-A'], dist);
run('git', [...who, 'commit', '-q', '-m', `Deploy ${new Date().toISOString()}`], dist);
run('git', ['push', '-q', '-f', remote, 'gh-pages'], dist);
rmSync(repo, { recursive: true, force: true });
console.log('\nDeployed. GitHub Pages updates in about a minute: https://zeenstrusts.github.io/spec-shootout/');
