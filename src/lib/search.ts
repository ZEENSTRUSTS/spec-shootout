import { sectionOf } from '../data';
import type { Product } from '../data/types';

/**
 * Forgiving product search used everywhere (home search box and every browse page).
 * - Words can come in any order and be partial: "canon 60" finds the EOS 60D, 600D, 6000D…
 * - Spaces, dashes and "EOS"-style prefixes don't matter: "60d", "a7iv", "a7 iv", "x-t5" all work.
 * - "mark 2", "mk2", "m2" and "ii" are treated the same.
 * - Small typos are forgiven: "cannon", "sonny", "fujiflim", "mavik".
 */

const ROMAN: Record<string, string> = { '1': 'i', '2': 'ii', '3': 'iii', '4': 'iv', '5': 'v', '6': 'vi' };
const BRAND_ALIASES: Record<string, string> = { Panasonic: 'lumix', Fujifilm: 'fuji', Sony: 'alpha', Canon: 'eos', DJI: 'osmo' };

const words = (s: string) => s.toLowerCase().replace(/[^a-z0-9]+/g, ' ').trim().split(' ').filter(Boolean);
const squash = (s: string) => s.toLowerCase().replace(/[^a-z0-9]+/g, '');

/** Query words, with "mark 2" / "mk2" / "m2" folded into "ii". */
function queryTokens(q: string): string[] {
  const w = words(q);
  const out: string[] = [];
  for (let i = 0; i < w.length; i++) {
    const t = w[i];
    const mk = t.match(/^(?:mark|mk|m)([1-6])$/);
    if (mk) {
      out.push(ROMAN[mk[1]]);
      continue;
    }
    if ((t === 'mark' || t === 'mk') && ROMAN[w[i + 1]]) {
      out.push(ROMAN[w[++i]]);
      continue;
    }
    if (t === 'mark' || t === 'mk') continue; // "mark ii" → just "ii"
    out.push(t);
  }
  return out;
}

interface Indexed {
  p: Product;
  flat: string; // everything squashed together, for substring hits ("60" in "eos60d")
  list: string[]; // individual words, for whole-word / prefix / typo hits
  model: string;
  short: string;
}

const cache = new WeakMap<Product, Indexed>();
function index(p: Product): Indexed {
  let x = cache.get(p);
  if (!x) {
    const type = 'type' in p ? p.type : 'cls' in p ? `${p.cls} gimbal` : 'drone';
    // DJI's Mini and Air drones were sold as "Mavic Mini" / "Mavic Air", and people still call them that
    const extra = p.kind === 'drone' && /^(mini|air)\s/i.test(p.model) ? 'mavic' : '';
    const hay = `${p.brand} ${BRAND_ALIASES[p.brand] ?? ''} ${extra} ${p.model} ${p.short ?? ''} ${p.id} ${type} ${sectionOf(p)} ${p.segment} ${p.year}`;
    const list = words(hay).flatMap((w) => {
      // also split letters from digits so "60d" can be found as "60" and "a7" as "a 7"
      const parts = w.match(/[a-z]+|[0-9]+/g) ?? [];
      return parts.length > 1 ? [w, ...parts] : [w];
    });
    x = { p, flat: squash(hay), list: [...new Set(list)], model: squash(p.model), short: squash(p.short ?? '') };
    cache.set(p, x);
  }
  return x;
}

/** Edit distance with an early exit once it exceeds `max`. */
function within(a: string, b: string, max: number): boolean {
  if (Math.abs(a.length - b.length) > max) return false;
  let prev = Array.from({ length: b.length + 1 }, (_, i) => i);
  for (let i = 1; i <= a.length; i++) {
    const cur = [i];
    let best = i;
    for (let j = 1; j <= b.length; j++) {
      cur[j] = Math.min(prev[j] + 1, cur[j - 1] + 1, prev[j - 1] + (a[i - 1] === b[j - 1] ? 0 : 1));
      best = Math.min(best, cur[j]);
    }
    if (best > max) return false;
    prev = cur;
  }
  return prev[b.length] <= max;
}

/** How well one query word matches a product (0 = not at all). */
function tokenScore(t: string, x: Indexed): number {
  if (x.list.includes(t)) return 6;
  if (x.list.some((w) => w.startsWith(t))) return 4;
  if (x.flat.includes(t)) return 2;
  // typo tolerance: letters only, long enough to be meaningful
  if (t.length >= 4 && /^[a-z]+$/.test(t)) {
    const max = t.length >= 5 ? 2 : 1;
    if (x.list.some((w) => within(t, w, max) || (w.length > t.length && within(t, w.slice(0, t.length), max)))) return 1;
  }
  return 0;
}

/** Relevance of a product for a query; 0 means it doesn't match. */
export function matchScore(p: Product, q: string): number {
  const tokens = queryTokens(q);
  if (!tokens.length) return 1;
  const x = index(p);
  let s = 0;
  for (const t of tokens) {
    // a lone 2–6 can also mean a generation: "a7 4" → α7 IV, "gh5 2" → GH5 II
    const v = Math.max(tokenScore(t, x), /^[2-6]$/.test(t) ? tokenScore(ROMAN[t], x) : 0);
    if (!v) return 0; // every word has to match something
    s += v;
  }
  const whole = squash(tokens.join(''));
  if (x.short === whole || x.model === whole) s += 25;
  else if (x.model.endsWith(whole) || x.short.startsWith(whole)) s += 10;
  else if (x.flat.includes(whole)) s += 5;
  return s + p.year / 10000; // newer first when tied
}

/** Products matching the query, best first. */
export function searchProducts<T extends Product>(list: T[], q: string): T[] {
  return list
    .map((p) => ({ p, s: matchScore(p, q) }))
    .filter((x) => x.s > 0)
    .sort((a, b) => b.s - a.s)
    .map((x) => x.p);
}
