import { useEffect, useState } from 'react';
import base from '../data/photos.json';
import { products } from '../data';
import type { Product } from '../data/types';

export interface PhotoSet {
  files: string[]; // first = front/hero
  source: string;
  page: string;
  title?: string;
}

/** What the "Grab photos" bookmarklet puts on the clipboard. */
export interface Grabbed extends PhotoSet {
  specShootout: 1;
  title: string;
}

const LS = 'spec-shootout-photos';
const BASE = base as Record<string, PhotoSet>;

function loadLocal(): Record<string, PhotoSet | null> {
  try {
    return JSON.parse(localStorage.getItem(LS) || '{}');
  } catch {
    return {};
  }
}
let local = loadLocal();
const listeners = new Set<() => void>();
const emit = () => listeners.forEach((l) => l());

export function allSets(): Record<string, PhotoSet> {
  const out: Record<string, PhotoSet> = { ...BASE };
  for (const [id, s] of Object.entries(local)) {
    if (s) out[id] = s;
    else delete out[id];
  }
  return out;
}

/** Re-render when photos are added or removed. */
export function usePhotoSets() {
  const [, bump] = useState(0);
  useEffect(() => {
    const l = () => bump((x) => x + 1);
    listeners.add(l);
    return () => {
      listeners.delete(l);
    };
  }, []);
  return allSets();
}

/** Save (or with `null`, remove) a product's photos: instantly in this browser, and into photos.json via the dev server. */
export async function savePhotos(id: string, set: PhotoSet | null): Promise<'file' | 'browser'> {
  local = { ...local, [id]: set };
  try {
    localStorage.setItem(LS, JSON.stringify(local));
  } catch {
    /* storage unavailable */
  }
  emit();
  try {
    const r = await fetch('/api/photos', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ id, set }) });
    if (r.ok) return 'file';
  } catch {
    /* static build — browser copy only */
  }
  return 'browser';
}

export function parseGrabbed(text: string): Grabbed | null {
  try {
    const j = JSON.parse(text.trim());
    if (j && j.specShootout === 1 && Array.isArray(j.files) && j.files.length) return j as Grabbed;
  } catch {
    /* not ours */
  }
  return null;
}

// ── matching a grabbed page title to one of our products ──
const norm = (s: string) => s.toLowerCase().replace(/[^a-z0-9]+/g, '');
const OK =
  /^(mirrorless|camera|cinema|digital|dslr|with|body|black|silver|white|drone|gimbal|stabilizer|action|smartphone|handheld|creator|combo|fly|standard|kit|essential|compact|premium|vlog|medium|full|interchangeable|graphite|charcoal|wireless|ilce|dsc|lumix|nikkor|eos|smart|360|4k|6k|8k|basic|bundle|adventure|motor|rc|explorer|vlogging|limited|travel|starter|zoom|lens|used|refurbished|buy|shop|product|specs|overview|\d+mm|$)/;

export function productKey(p: Product): string {
  const name = p.model.split(' / ')[0];
  if (p.brand === 'Canon') {
    if (p.id === 'canon-r') return 'eosr';
    return norm(name.replace(/^(Cinema EOS|EOS|PowerShot)\s+/, '').replace(/^Rebel\s+/, '').replace('EOS-', ''));
  }
  if (p.brand === 'Sony') return norm(name.replace(/^Alpha (\d)/, 'a$1').replace(/^Alpha /, 'a'));
  if (p.brand === 'Panasonic') return norm(name.replace('Lumix ', ''));
  if (p.id === 'dji-fpv') return 'djifpv';
  return norm(name.replace(/^DJI /, ''));
}

export function searchQuery(p: Product): string {
  const name = p.model.split(' / ')[0];
  if (p.brand === 'Sony') return `Sony ${name.replace(/^Alpha (\d)/, 'a$1').replace(/^Alpha /, 'a')}`;
  if (p.brand === 'Canon') return `Canon ${name.replace('Cinema EOS ', 'EOS ')}`;
  if (p.brand === 'DJI' && !/^DJI/.test(name)) return `DJI ${name}`;
  return `${p.brand} ${name}`;
}

export const bhSearch = (p: Product) => `https://www.bhphotovideo.com/c/search?q=${encodeURIComponent(searchQuery(p))}`;

const BRAND_ALIASES: Record<string, string[]> = { Fujifilm: ['fujifilm', 'fuji'], Insta360: ['insta360'], DJI: ['dji', 'osmo', 'ronin'] };

/** Products whose model name appears in the grabbed title, best first. */
export function matchTitle(title: string): Product[] {
  const t = norm(title);
  const hits: { p: Product; s: number }[] = [];
  for (const p of products) {
    const key = productKey(p);
    let i = t.indexOf(key);
    let best = -1;
    while (i >= 0) {
      const rest = t.slice(i + key.length);
      if (OK.test(rest)) best = Math.max(best, key.length * 2 + (rest === '' || /^(mirrorless|camera|digital|dslr|drone|gimbal|body)/.test(rest) ? 3 : 0));
      i = t.indexOf(key, i + 1);
    }
    if (best < 0) continue;
    const brands = BRAND_ALIASES[p.brand] ?? [p.brand.toLowerCase()];
    if (brands.some((b) => t.includes(b))) best += 5;
    hits.push({ p, s: best });
  }
  return hits.sort((a, b) => b.s - a.s).map((h) => h.p);
}
