// Converts the B&H run results (bh-results.json) into src/data/photos.json.
// Usage: node scripts/bh-to-photos.mjs <path-to-bh-results.json>
import { readFileSync, writeFileSync, existsSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
const src = process.argv[2] ?? join(ROOT, 'bh-results.json');
const { res = {}, miss = {} } = JSON.parse(readFileSync(src, 'utf8'));
const OUT = join(ROOT, 'src', 'data', 'photos.json');
const cur = existsSync(OUT) ? JSON.parse(readFileSync(OUT, 'utf8')) : {};
const SIZE = 'images750x750';

for (const [id, r] of Object.entries(res)) {
  const files = [];
  if (r.main) files.push(`https://static.bhphoto.com/images/${SIZE}/${r.main}.jpg`);
  for (const g of r.g ?? []) files.push(`https://static.bhphoto.com/images/multiple_images/${SIZE}/${g}.jpg`);
  if (!files.length) continue;
  cur[id] = { files: files.slice(0, 7), source: 'B&H Photo Video', page: `https://www.bhphotovideo.com${r.u}`, title: r.t };
}
writeFileSync(OUT, JSON.stringify(cur, null, 1));
console.log(`${Object.keys(res).length} matched → photos.json now has ${Object.keys(cur).length}`);
console.log('No B&H match:', Object.keys(miss).join(', ') || 'none');
