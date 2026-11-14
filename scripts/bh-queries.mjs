// Builds public/bh-queries.json: one B&H search per product + the model key used to verify listing titles.
import { readFileSync, readdirSync, writeFileSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
const DATA = join(ROOT, 'src', 'data');
const norm = (s) => s.toLowerCase().replace(/[^a-z0-9]+/g, '');

const out = [];
for (const f of readdirSync(DATA).filter((f) => f.endsWith('.ts'))) {
  const src = readFileSync(join(DATA, f), 'utf8');
  for (const m of src.matchAll(/id: '([^']+)',(?: brand: '([^']+)',)? model: '([^']+)'/g)) {
    const [, id, brand = 'DJI', model] = m;
    const kind = f === 'drones.ts' ? 'drone' : f === 'gimbals.ts' ? 'gimbal' : 'camera';
    let name = model.split(' / ')[0];
    let key;
    let q;
    if (brand === 'Canon') {
      const n = name.replace(/^(Cinema EOS|EOS|PowerShot)\s+/, '').replace(/^Rebel\s+/, '');
      key = norm(n.replace('EOS-', ''));
      q = `Canon ${name.replace('Cinema EOS ', 'EOS ')} ${kind === 'camera' ? 'camera' : ''}`;
    } else if (brand === 'Sony') {
      const n = name.replace(/^Alpha (\d)/, 'a$1').replace(/^Alpha /, 'a');
      key = norm(n);
      q = `Sony ${n.replace(/^a(\d)/, 'a$1')} camera`;
    } else if (brand === 'Nikon') {
      key = norm(name);
      q = `Nikon ${name} camera`;
    } else if (brand === 'Fujifilm') {
      key = norm(name);
      q = `FUJIFILM ${name} camera`;
    } else if (brand === 'Panasonic') {
      key = norm(name.replace('Lumix ', ''));
      q = `Panasonic ${name} camera`;
    } else {
      key = norm(name.replace(/^DJI /, ''));
      q = `${brand} ${name} ${kind === 'drone' ? 'drone' : kind === 'gimbal' ? 'gimbal' : ''}`.trim();
    }
    out.push({ id, brand, kind, q: q.replace(/\s+/g, ' ').trim(), key });
  }
}
writeFileSync(join(ROOT, 'public', 'bh-queries.json'), JSON.stringify(out));
console.log(out.length, 'queries');
console.log(out.filter((_, i) => i % 25 === 0));
