// Fetches one freely-licensed product photo per camera/drone from Wikimedia Commons.
// Usage:  node scripts/fetch-photos.mjs            (only missing photos)
//         node scripts/fetch-photos.mjs --force    (re-pick everything)
//         node scripts/fetch-photos.mjs sony-a7iii canon-60d   (specific ids)
// Writes public/photos/<id>.jpg and src/data/photoCredits.json (author + licence for attribution).
import { readFileSync, writeFileSync, readdirSync, existsSync, mkdirSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
const DATA = join(ROOT, 'src', 'data');
const OUT = join(ROOT, 'public', 'photos');
const CREDITS = join(DATA, 'photoCredits.json');
const API = 'https://commons.wikimedia.org/w/api.php';
const UA = 'SpecShootout/0.2 (local camera comparison app; educational)';

mkdirSync(OUT, { recursive: true });
const args = process.argv.slice(2);
const force = args.includes('--force');
const only = args.filter((a) => !a.startsWith('--'));
const credits = existsSync(CREDITS) ? JSON.parse(readFileSync(CREDITS, 'utf8')) : {};
const overrides = JSON.parse(readFileSync(join(ROOT, 'scripts', 'photo-overrides.json'), 'utf8'));

// ── collect products from the data files ──
const products = [];
for (const f of readdirSync(DATA).filter((f) => /\.ts$/.test(f))) {
  const src = readFileSync(join(DATA, f), 'utf8');
  for (const m of src.matchAll(/id: '([^']+)',(?: brand: '([^']+)',)? model: '([^']+)'/g)) {
    products.push({ id: m[1], brand: m[2] ?? 'DJI', model: m[3] });
  }
}

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
let last = 0;
const GAP = Number(process.env.GAP ?? 2500);
/** polite fetch: at most one Wikimedia request every GAP ms, long pause when rate-limited */
async function politeFetch(url) {
  for (let i = 0; i < 6; i++) {
    const wait = last + GAP - Date.now();
    if (wait > 0) await sleep(wait);
    last = Date.now();
    const res = await fetch(url, { headers: { 'User-Agent': UA } });
    if (res.status === 429 || res.status === 503) {
      console.log(`  …rate-limited (${res.status}), pausing 60s`);
      await sleep(60000);
      continue;
    }
    return res;
  }
  throw new Error('rate limited');
}
async function api(params) {
  const url = `${API}?${new URLSearchParams({ format: 'json', formatversion: '2', ...params })}`;
  for (let i = 0; i < 8; i++) {
    const res = await politeFetch(url);
    const text = await res.text();
    if (/too many requests/i.test(text)) {
      await sleep(60000);
      continue;
    }
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    try {
      return JSON.parse(text);
    } catch {
      await sleep(3000);
    }
  }
  throw new Error('rate limited');
}

// ── candidate Commons category names ──
const SONY_CODES = {
  'Alpha 6000': 'ILCE-6000', 'Alpha 5100': 'ILCE-5100', 'Alpha 6300': 'ILCE-6300', 'Alpha 6500': 'ILCE-6500', 'Alpha 6100': 'ILCE-6100',
  'Alpha 6400': 'ILCE-6400', 'Alpha 6600': 'ILCE-6600', 'Alpha 6700': 'ILCE-6700', 'Alpha 7': 'ILCE-7', 'Alpha 7S': 'ILCE-7S', 'Alpha 7 II': 'ILCE-7M2',
  'Alpha 7R II': 'ILCE-7RM2', 'Alpha 7S II': 'ILCE-7SM2', 'Alpha 9': 'ILCE-9', 'Alpha 7R III': 'ILCE-7RM3', 'Alpha 7 III': 'ILCE-7M3', 'Alpha 7R IV': 'ILCE-7RM4',
  'Alpha 9 II': 'ILCE-9M2', 'Alpha 7C': 'ILCE-7C', 'Alpha 7S III': 'ILCE-7SM3', 'Alpha 1': 'ILCE-1', 'Alpha 7 IV': 'ILCE-7M4', 'Alpha 7R V': 'ILCE-7RM5',
  'Alpha 7C II': 'ILCE-7CM2', 'Alpha 7C R': 'ILCE-7CR', 'Alpha 9 III': 'ILCE-9M3', 'Alpha 1 II': 'ILCE-1M2', 'Alpha 7 V': 'ILCE-7M5',
  'RX100 III': 'DSC-RX100M3', 'RX100 IV': 'DSC-RX100M4', 'RX100 V': 'DSC-RX100M5', 'RX100 VI': 'DSC-RX100M6', 'RX100 VII': 'DSC-RX100M7', 'RX10 IV': 'DSC-RX10M4',
};

function candidates(p) {
  const { brand, model } = p;
  const names = new Set();
  const parts = model.split(' / ').map((s) => s.trim());
  if (brand === 'Canon') {
    for (const part of parts) {
      const m = part.replace(/^EOS Rebel /, 'EOS Rebel ').replace(/^EOS-1D/, 'EOS-1D');
      names.add(`Canon ${m}`);
      if (/^\d+D$/.test(part)) names.add(`Canon EOS ${part}`);
    }
    if (model.startsWith('Cinema EOS')) names.add(`Canon ${model.replace('Cinema ', '')}`);
    names.add(`Canon ${model.replace(' Mark ', ' Mk ')}`);
  } else if (brand === 'Sony') {
    const code = SONY_CODES[model];
    if (code) names.add(`Sony ${code}`);
    names.add(`Sony ${model}`);
    names.add(`Sony ${model.replace('Alpha ', 'α')}`);
    names.add(`Sony ${model.replace('Alpha ', 'α ')}`);
    if (model.startsWith('RX')) names.add(`Sony Cyber-shot DSC-${model}`);
  } else if (brand === 'Nikon') {
    names.add(`Nikon ${model}`);
    names.add(`Nikon ${model.replace(/^Z(\d+|f|fc|R)/, 'Z $1')}`);
  } else if (brand === 'Fujifilm') {
    names.add(`Fujifilm ${model}`);
    names.add(`Fujifilm ${model.replace(' ', '')}`);
  } else if (brand === 'Panasonic') {
    const base = parts[0].replace('Lumix ', '');
    for (const pre of ['Panasonic Lumix DMC-', 'Panasonic Lumix DC-', 'Panasonic Lumix ', 'Lumix ']) names.add(`${pre}${base}`);
  } else if (brand === 'GoPro') {
    names.add(`GoPro ${model}`);
    names.add(`GoPro ${model.replace(' Black', '')}`);
  } else if (brand === 'Insta360') {
    names.add(`Insta360 ${model}`);
  } else if (brand === 'Zhiyun') {
    names.add(`Zhiyun ${model}`);
    names.add(`Zhiyun-Tech ${model}`);
  } else {
    names.add(`DJI ${model}`);
    names.add(model.startsWith('DJI') ? model : `DJI ${model.replace('Osmo ', 'Osmo ')}`);
    if (model.startsWith('Osmo ')) names.add(`DJI ${model.replace('Osmo ', '')}`);
  }
  return [...names];
}

const NEG = /(back|rear|top[ _-]?view|bottom|screen|lcd|menu|sensor|mount|inside|box|battery|sample|taken|shot[ _]with|disassembl|teardown|strap|x-?ray|viewfinder|eyecup|card|dial|detail|close|macro|flash|controller|remote|goggles|propell|exif|logo|test|night|flying|portrait|person|people|holding|hands?[ _]|photographer|selfie|wedding|crowd|concert|stadium|match|player|olympic|journalist|team|actress|actor|recording with|using|vlogger|girl|boy|lady|guy|student|tourist|cosplay|interview|reporter|filming)/i;
const POS = /(front|frontal|vorne|mit|with|kit|lens|body|left|right|angle|oblique|three[ -]quarter|studio|white|product|IMG)/i;

function scoreFile(f, p) {
  const ii = f.imageinfo?.[0];
  if (!ii) return -99;
  if (!/image\/(jpeg|png)/.test(ii.mime)) return -99;
  const t = f.title.toLowerCase();
  let s = 0;
  if (NEG.test(t)) s -= 4;
  if (POS.test(t)) s += 2;
  if (/front/.test(t)) s += 3;
  const key = keyOf(p);
  const nt = norm(t);
  const at = nt.indexOf(key);
  if (at >= 0) {
    s += 3;
    const next = nt[at + key.length] ?? '';
    // a different model that merely starts with this name (Pocket → Pocket 4, Mark II → Mark III, X3 → X30)
    if (/\d/.test(next) || (/i$/.test(key) && next === 'i') || (/[0-9]$/.test(key) && /[0-9]/.test(next)) || (key.endsWith('pro') === false && nt.startsWith('pro', at + key.length) && !/pro/.test(key))) s -= 8;
  }
  if (ii.width >= ii.height) s += 1;
  if (ii.width < 800) s -= 2;
  return s;
}

async function categoryFiles(cat) {
  const j = await api({
    action: 'query', generator: 'categorymembers', gcmtitle: `Category:${cat}`, gcmtype: 'file', gcmlimit: '80',
    prop: 'imageinfo', iiprop: 'url|mime|size|extmetadata', iiurlwidth: '960',
  });
  return j.query?.pages ?? [];
}

const norm = (x) => x.toLowerCase().replace(/[^a-z0-9α]+/g, '');
const keyOf = (p) => norm(p.model.split(' / ')[0].replace(/^(EOS|Alpha|Lumix|Cinema EOS|PowerShot)\s+/, ''));

async function findCategory(p) {
  for (const c of candidates(p)) {
    const files = await categoryFiles(c);
    if (files.length) return { cat: c, files };
    await sleep(120);
  }
  // fallback: search category namespace — only accept categories that contain the exact model key
  const q = `${p.brand} ${p.model.split(' / ')[0]}`;
  const s = await api({ action: 'query', list: 'search', srsearch: q, srnamespace: '14', srlimit: '8' });
  const key = keyOf(p);
  for (const hit of s.query?.search ?? []) {
    const cat = hit.title.replace(/^Category:/, '');
    if (/taken with|photographs by|images by|photos by/i.test(cat)) continue;
    const n = norm(cat);
    if (!n.endsWith(key) && !n.includes(key + 'camera') && !n.includes(key + 'drone')) continue;
    const files = await categoryFiles(cat);
    if (files.length) return { cat, files };
  }
  return null;
}

/** Lead image of the English Wikipedia article, if it lives on Commons. */
async function wikipediaImage(p) {
  const titles = candidates(p).slice(0, 6).join('|');
  const url = `https://en.wikipedia.org/w/api.php?${new URLSearchParams({ action: 'query', format: 'json', formatversion: '2', redirects: '1', prop: 'pageimages', piprop: 'name', titles })}`;
  const res = await politeFetch(url);
  if (!res.ok) return null;
  const j = await res.json();
  for (const pg of j.query?.pages ?? []) {
    if (pg.missing || !pg.pageimage) continue;
    if (!norm(pg.title).includes(keyOf(p))) continue; // must be this model's own article
    if (/logo|\.svg$/i.test(pg.pageimage)) continue;
    const f = await fileByTitle(`File:${pg.pageimage}`);
    if (f?.imageinfo?.[0] && !NEG.test(f.title)) return { f, via: `Wikipedia: ${pg.title}` };
  }
  return null;
}

/** Commons file search on the title. */
async function fileSearch(p) {
  const q = `${p.brand} ${p.model.split(' / ')[0]}`;
  const j = await api({ action: 'query', generator: 'search', gsrsearch: `intitle:"${p.model.split(' / ')[0]}" ${p.brand}`, gsrnamespace: '6', gsrlimit: '30', prop: 'imageinfo', iiprop: 'url|mime|size|extmetadata', iiurlwidth: '960' });
  const key = keyOf(p);
  const files = (j.query?.pages ?? []).filter((f) => norm(f.title).includes(key));
  if (!files.length) return null;
  const best = files.map((f) => ({ f, s: scoreFile(f, p) })).sort((a, b) => b.s - a.s)[0];
  return best.s >= 0 ? { f: best.f, via: `search: ${q}` } : null;
}

const strip = (html = '') => html.replace(/<[^>]+>/g, '').replace(/\s+/g, ' ').trim();

async function fileByTitle(title) {
  const j = await api({ action: 'query', titles: title, prop: 'imageinfo', iiprop: 'url|mime|size|extmetadata', iiurlwidth: '960' });
  return j.query?.pages?.[0];
}

let ok = 0;
let miss = [];
for (const p of products) {
  if (only.length && !only.includes(p.id)) continue;
  if (!force && !only.length && credits[p.id] && existsSync(join(OUT, `${p.id}.jpg`))) continue;
  try {
    let best;
    let cat = '';
    const ov = overrides[p.id];
    if (ov === null) {
      miss.push(`${p.id} (skipped by override)`);
      continue;
    }
    if (ov?.url) {
      // manual image from a manufacturer / retailer page
      const res = await fetch(ov.url, { headers: { 'User-Agent': 'Mozilla/5.0' } });
      if (!res.ok) throw new Error(`download ${res.status}`);
      writeFileSync(join(OUT, `${p.id}.jpg`), Buffer.from(await res.arrayBuffer()));
      credits[p.id] = { file: `/photos/${p.id}.jpg`, page: ov.page ?? ov.url, source: ov.source ?? 'Manufacturer', author: ov.author ?? '', license: ov.license ?? '© manufacturer — personal use' };
      ok++;
      console.log(`✓ ${p.id.padEnd(26)} manual  →  ${ov.url}`);
      writeFileSync(CREDITS, JSON.stringify(credits, null, 2));
      continue;
    }
    if (ov?.file) {
      best = await fileByTitle(ov.file);
      cat = 'override';
    } else {
      const wp = ov?.category ? null : await wikipediaImage(p);
      if (wp) {
        best = wp.f;
        cat = wp.via;
      } else {
        const found = ov?.category ? { cat: ov.category, files: await categoryFiles(ov.category) } : await findCategory(p);
        const ranked = found?.files.map((f) => ({ f, s: scoreFile(f, p) })).sort((a, b) => b.s - a.s) ?? [];
        if (ranked.length && ranked[0].s >= -1) {
          best = ranked[0].f;
          cat = found.cat;
        } else {
          const fs = await fileSearch(p);
          if (!fs) {
            miss.push(p.id);
            continue;
          }
          best = fs.f;
          cat = fs.via;
        }
      }
    }
    const ii = best?.imageinfo?.[0];
    if (!ii) {
      miss.push(p.id);
      continue;
    }
    let res = await politeFetch(ii.thumburl ?? ii.url);
    if (!res.ok && ii.thumburl && ii.size < 12e6) res = await politeFetch(ii.url);
    if (!res.ok) throw new Error(`download ${res.status}`);
    writeFileSync(join(OUT, `${p.id}.jpg`), Buffer.from(await res.arrayBuffer()));
    const md = ii.extmetadata ?? {};
    credits[p.id] = {
      file: `/photos/${p.id}.jpg`,
      title: best.title,
      author: strip(md.Artist?.value).slice(0, 80),
      license: strip(md.LicenseShortName?.value) || 'See source',
      page: ii.descriptionurl,
      source: 'Wikimedia Commons',
    };
    ok++;
    console.log(`✓ ${p.id.padEnd(26)} ${cat}  →  ${best.title}`);
    writeFileSync(CREDITS, JSON.stringify(credits, null, 2));
  } catch (e) {
    miss.push(`${p.id} (${e.message})`);
  }
}
writeFileSync(CREDITS, JSON.stringify(credits, null, 2));
console.log(`\nDone: ${ok} downloaded, ${miss.length} without photo`);
if (miss.length) console.log('Missing:', miss.join(', '));
