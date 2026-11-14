import { cameras, drones } from '../data';
import { kits } from '../data/kits';
import { ACTION_TYPES, type Camera, type Drone } from '../data/types';
import type { TierKey, Track } from '../data/kits';
import { scoresFor } from './scoring';

export type Goal = 'photo' | 'video' | 'hybrid' | 'action' | 'drone';
export type Use = 'people' | 'sport' | 'travel' | 'vlog' | 'landscape' | 'film' | 'all';
export type Size = 'small' | 'any' | 'pro';
export type Cond = 'new' | 'used';
export type Lean = 'photo' | 'equal' | 'video';

export interface Answers {
  goal?: Goal;
  lean?: Lean; // hybrid shooters only
  budget?: number; // upper limit in USD (Infinity = no limit)
  cond?: Cond;
  use?: Use;
  size?: Size;
}

export interface Pick {
  p: Camera | Drone;
  cost: number;
  used: boolean;
  estimate: boolean;
  fit: number; // 0–100
  reasons: string[];
}

const THIS_YEAR = 2026;

/** Typical used prices quoted in the gear paths. */
const USED = new Map<string, number>();
for (const k of kits) for (const s of k.slots) for (const o of s.options) if ('id' in o && o.used) USED.set(o.id, Math.min(o.used, USED.get(o.id) ?? Infinity));

/** Rough used value when no quoted price exists: loses ~13%/year, floors at 30% of launch price. */
function usedPrice(p: Camera | Drone): { cost: number; estimate: boolean } {
  const q = USED.get(p.id);
  if (q) return { cost: q, estimate: false };
  const age = Math.max(1, THIS_YEAR - p.year);
  return { cost: Math.round((p.price * Math.max(0.3, 0.87 ** age)) / 10) * 10, estimate: true };
}

const flips = (c: Camera) => /vari|flip|articul|selfie|180/i.test(c.body.screen);
const big = (c: Camera) => ['Full Frame', 'Medium Format'].includes(c.sensor.size);

function candidates(goal: Goal): (Camera | Drone)[] {
  if (goal === 'drone') return drones;
  if (goal === 'action') return cameras.filter((c) => ACTION_TYPES.includes(c.type));
  return cameras.filter((c) => !ACTION_TYPES.includes(c.type) && (goal === 'video' || c.type !== 'Cinema'));
}

/** Every eligible product for these answers, best fit first (raw fit, not %). */
export function rankAll(a: Required<Answers>): Pick[] {
  const lean: Lean = a.goal === 'hybrid' ? a.lean ?? 'equal' : 'equal';
  const out: Pick[] = [];
  for (const p of candidates(a.goal)) {
    // price for this buyer
    let cost = p.price;
    let used = false;
    let estimate = false;
    if (a.cond === 'used' && p.year < THIS_YEAR - 1) {
      const u = usedPrice(p);
      if (u.cost < p.price) ({ cost, estimate } = u), (used = true);
    }
    if (a.cond === 'new' && p.year < THIS_YEAR - 5) continue; // long discontinued
    if (cost > a.budget * 1.08) continue;

    const s = scoresFor(p);
    const reasons: string[] = [];
    let fit: number;

    if (p.kind === 'drone') {
      const f = p.flight;
      fit = 0.55 * (s.flight ?? s.overall) + 0.45 * s.video;
      if (a.size === 'small') fit += f.sub250 ? 12 : -10;
      if (a.size === 'pro') fit += p.cameras.length > 1 ? 8 : 0;
      if (a.use === 'film' || a.use === 'landscape') fit += p.video.log.length ? 6 : -6;
      const pro = p.video.codecs.filter((x) => /prores|raw|dng/i.test(x) && !/\(cine\)/i.test(x));
      const rawish = pro.length > 0;
      if (a.use === 'film') fit += rawish ? 10 : 0;
      if (a.size === 'pro') fit += rawish ? 8 : 0;
      if (rawish) reasons.push(`Records ${pro.join(' / ')}`);
      if (a.use === 'sport') fit += f.maxSpeed >= 60 ? 6 : 0;
      if (a.use === 'travel') fit += f.weight < 600 ? 6 : -4;
      if (f.sub250) reasons.push('Under 250 g, so fewer flying rules in most countries');
      reasons.push(`${f.time} min flights, ${f.rangeKm} km range`);
      if (p.cameras.length > 1) reasons.push(`${p.cameras.length} cameras for different focal lengths`);
      if (p.video.log.length) reasons.push(`${p.video.log[0]} log for colour grading`);
    } else {
      const c = p;
      const w =
        a.goal === 'photo' ? [0.7, 0.1] : a.goal === 'video' ? [0.05, 0.8] : lean === 'photo' ? [0.6, 0.25] : lean === 'video' ? [0.25, 0.6] : [0.45, 0.45];
      fit = w[0] * s.photo + w[1] * s.video + 0.2 * s.overall;
      switch (a.use) {
        case 'people':
          fit += (c.af.subjects.some((x) => /eye|face|human|people/i.test(x)) ? 4 : 0) + (big(c) ? 12 : 0);
          if (big(c)) reasons.push('Big sensor for creamy, blurred backgrounds');
          break;
        case 'sport':
          fit += Math.min(18, 4 * Math.log2(Math.max(1, c.photo.eFps || 1)) - 4) + c.af.score / 10 + (c.photo.preCapture ? 4 : 0);
          reasons.push(`${c.photo.eFps} fps bursts${c.photo.preCapture ? ' with pre-capture' : ''}`);
          break;
        case 'travel':
          fit += (c.body.weight < 500 ? 8 : c.body.weight < 700 ? 3 : -6) + (c.ibis ? 3 : 0);
          reasons.push(`${c.body.weight} g body${c.ibis ? `, ${c.ibis.stops}-stop stabilisation` : ''}`);
          break;
        case 'vlog':
          fit += (flips(c) || c.type === 'Pocket gimbal' ? 10 : -10) + c.af.video / 15 + (c.body.weight < 600 ? 4 : 0) + (c.type === 'Pocket gimbal' ? 8 : 0);
          if (c.type === 'Pocket gimbal') reasons.push('Built-in gimbal for smooth walk-and-talk shots');
          if (flips(c)) reasons.push('Flip screen so you can see yourself');
          break;
        case 'landscape':
          fit += Math.min(10, c.sensor.mp / 6) + (c.body.sealed ? 3 : 0);
          reasons.push(`${c.sensor.mp} MP for big prints and cropping`);
          break;
        case 'all': {
          // the sweet spot: no glaring weakness for vlogging, people, landscape or the odd bit of sport
          const parts = [
            flips(c) ? 1 : 0.3,
            Math.min(1, c.af.score / 90),
            Math.min(1, (c.photo.eFps || 0) / 15),
            c.sensor.mp >= 20 && c.sensor.mp <= 45 ? 1 : 0.6,
            c.ibis ? 1 : 0.4,
            c.video.log.length ? 1 : 0.4,
            c.body.weight < 750 ? 1 : 0.5,
          ];
          fit += 3 * parts.reduce((x, y) => x + y, 0) - 6 * (1 - Math.min(...parts));
          if (flips(c)) reasons.push('Flip screen for vlogging');
          if (c.photo.eFps >= 10) reasons.push(`${c.photo.eFps} fps when sport comes along`);
          break;
        }
        case 'film':
          fit += (c.video.log.length ? 5 : -8) + (c.video.intRaw ? 5 : 0) + (c.video.openGate ? 3 : 0) + (c.type === 'Cinema' ? (a.size === 'pro' ? 16 : 8) : 0);
          if (c.type === 'Cinema') reasons.push('Cinema body: XLR audio, timecode, built for crews');
          if (c.video.log.length) reasons.push(`${c.video.log[0]} log${c.video.intRaw ? ` and internal ${c.video.intRaw}` : ''}`);
          break;
      }
      if (a.size === 'small') fit += c.body.weight < 450 ? 8 : c.body.weight < 650 ? 2 : -8;
      if (a.size === 'pro') fit += (c.body.slots.length > 1 ? 4 : 0) + (c.body.sealed ? 3 : 0) + (c.body.vf || c.type === 'Cinema' ? 2 : -6);
      if (a.goal !== 'photo' && c.video.unlimited) reasons.push('No recording time limit');
      if (c.ibis && a.use !== 'travel') reasons.push(`${c.ibis.stops}-stop in-body stabilisation`);
      if (a.goal === 'action' && c.waterproof) reasons.push(`Waterproof to ${c.waterproof} m with no case`);
      reasons.push(`${c.sensor.size} · ${c.sensor.mp} MP`);
    }
    // spending more of the budget usually buys more camera, but don't force it
    if (Number.isFinite(a.budget)) fit += 6 * Math.min(1, cost / a.budget);
    // with no limit and pro needs, the top-end tools earn their price
    else if (a.size === 'pro' || a.use === 'film') fit += Math.min(10, 2 * Math.log2(Math.max(1, cost / 1000)));
    fit += Math.max(0, p.year - 2016) * 0.4; // gentle nudge toward newer tech
    out.push({ p, cost, used, estimate, fit, reasons: [...new Set(reasons)].slice(0, 4) });
  }
  return out.sort((x, y) => y.fit - x.fit);
}

export function findGear(a: Required<Answers>): Pick[] {
  const out = rankAll(a);
  // avoid three near-identical siblings: max two from the same brand in the top three
  const top: Pick[] = [];
  for (const x of out) {
    if (top.length === 3) break;
    if (x.p.kind === 'camera' && top.filter((t) => t.p.brand === x.p.brand).length >= 2) continue;
    top.push(x);
  }
  // show as a match %: best pick near the top, others relative to it
  const best = top[0]?.fit ?? 0;
  for (const t of top) t.fit = Math.max(60, Math.round(97 - 2.5 * (best - t.fit)));
  return top;
}

/** The gear-path level that matches a body budget. */
export function tierFor(goal: Goal, budget: number): { track: Track; tier: TierKey } {
  const steps: [number, TierKey][] = [
    [700, 'beginner'],
    [1300, 'upgrade'],
    [2200, 'intermediate'],
    [3500, 'semipro'],
    [6000, 'pro'],
  ];
  const tier = steps.find(([b]) => budget <= b)?.[1] ?? 'elite';
  return { track: goal, tier };
}
