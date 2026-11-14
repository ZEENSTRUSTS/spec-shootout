// Downloads brand wordmarks from Wikimedia Commons into public/logos and records them in src/data/logoCredits.json.
import { writeFileSync, mkdirSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
const OUT = join(ROOT, 'public', 'logos');
mkdirSync(OUT, { recursive: true });
const UA = 'SpecShootout/0.2 (local camera comparison app; educational)';

const BRANDS = {
  Canon: ['Canon wordmark.svg', 'Canon logo.svg'],
  Sony: ['Sony logo.svg', 'Sony wordmark.svg'],
  Nikon: ['Nikon Logo.svg', 'Nikon logo.svg', 'Nikon wordmark.svg'],
  Fujifilm: ['Fujifilm logo.svg', 'FUJIFILM logo.svg'],
  Panasonic: ['Panasonic logo (Blue).svg', 'Panasonic logo.svg'],
  DJI: ['DJI Innovations logo.svg', 'DJI logo.svg', 'Dji logo.svg'],
  GoPro: ['GoPro logo.svg', 'GoPro Logo.svg', 'GoPro wordmark.svg'],
  Insta360: ['Insta360 logo.svg', 'Insta360 Logo.svg'],
  Zhiyun: ['Zhiyun logo.svg', 'Zhiyun-Tech logo.svg'],
};

async function api(params) {
  const url = `https://commons.wikimedia.org/w/api.php?${new URLSearchParams({ format: 'json', formatversion: '2', ...params })}`;
  const r = await fetch(url, { headers: { 'User-Agent': UA } });
  return r.json();
}

const credits = {};
for (const [brand, titles] of Object.entries(BRANDS)) {
  let hit = null;
  for (const t of titles) {
    const j = await api({ action: 'query', titles: `File:${t}`, prop: 'imageinfo', iiprop: 'url|mime' });
    const pg = j.query?.pages?.[0];
    if (pg && !pg.missing && pg.imageinfo?.[0]) {
      hit = pg;
      break;
    }
  }
  if (!hit) {
    const j = await api({ action: 'query', generator: 'search', gsrsearch: `intitle:${brand} intitle:logo filetype:drawing`, gsrnamespace: '6', gsrlimit: '10', prop: 'imageinfo', iiprop: 'url|mime' });
    hit = (j.query?.pages ?? []).find((p) => p.imageinfo?.[0]?.mime === 'image/svg+xml' && p.title.toLowerCase().includes(brand.toLowerCase()));
  }
  if (!hit) {
    console.log(`✗ ${brand}: none found`);
    continue;
  }
  const ii = hit.imageinfo[0];
  const ext = ii.mime === 'image/svg+xml' ? 'svg' : 'png';
  const res = await fetch(ii.url, { headers: { 'User-Agent': UA } });
  writeFileSync(join(OUT, `${brand.toLowerCase()}.${ext}`), Buffer.from(await res.arrayBuffer()));
  credits[brand] = { file: `/logos/${brand.toLowerCase()}.${ext}`, title: hit.title, page: ii.descriptionurl };
  console.log(`✓ ${brand}: ${hit.title}`);
  await new Promise((r) => setTimeout(r, 300));
}
writeFileSync(join(ROOT, 'src', 'data', 'logoCredits.json'), JSON.stringify(credits, null, 2));
