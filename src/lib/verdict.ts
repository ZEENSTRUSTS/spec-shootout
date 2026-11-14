import type { Camera, Drone, Gimbal, Product } from '../data/types';
import { scoresFor, SENSOR_SCORE, videoStats, resLabel, vfLabel, vfScore, canShoot } from './scoring';

export type Priority = 'hybrid' | 'photo' | 'video' | 'flight';

export interface Point {
  text: string;
  weight: number; // rough importance, used for ordering
}

export interface Verdict {
  level: 'strong' | 'upgrade' | 'side' | 'down';
  title: string;
  summary: string;
  delta: number;
  gains: Point[];
  losses: Point[];
  notes: string[];
}

const fmtPrice = (n: number) => `$${n.toLocaleString('en-US')}`;

function push(gains: Point[], losses: Point[], better: boolean | null, text: string, weight: number) {
  if (better === null) return;
  (better ? gains : losses).push({ text, weight });
}

function cameraDiffs(a: Camera, b: Camera, gains: Point[], losses: Point[], notes: string[]) {
  const ratio = b.sensor.mp / a.sensor.mp;
  if (ratio >= 1.15 || ratio <= 0.87)
    push(gains, losses, ratio > 1, `${b.sensor.mp}MP vs ${a.sensor.mp}MP resolution`, Math.abs(ratio - 1) * 10);
  if (a.sensor.size !== b.sensor.size)
    push(gains, losses, SENSOR_SCORE[b.sensor.size] > SENSOR_SCORE[a.sensor.size], `${b.sensor.size} sensor (from ${a.sensor.size})`, 8);
  if (/stacked|global/i.test(b.sensor.type) && !/stacked|global/i.test(a.sensor.type))
    gains.push({ text: `${b.sensor.type} — faster readout, less rolling shutter`, weight: 6 });
  if (/stacked|global/i.test(a.sensor.type) && !/stacked|global/i.test(b.sensor.type))
    losses.push({ text: `Loses the ${a.sensor.type.toLowerCase()} — more rolling shutter`, weight: 5 });

  if (!a.ibis && b.ibis) gains.push({ text: `Gains ${b.ibis.stops}-stop in-body stabilization`, weight: 8 });
  else if (a.ibis && !b.ibis) losses.push({ text: 'No in-body stabilization', weight: 8 });
  else if (a.ibis && b.ibis && Math.abs(b.ibis.stops - a.ibis.stops) >= 1)
    push(gains, losses, b.ibis.stops > a.ibis.stops, `IBIS ${b.ibis.stops} vs ${a.ibis.stops} stops`, 3);

  if (Math.abs(b.photo.eFps - a.photo.eFps) >= 5)
    push(gains, losses, b.photo.eFps > a.photo.eFps, `${b.photo.eFps} fps burst vs ${a.photo.eFps} fps`, Math.min(7, Math.abs(b.photo.eFps - a.photo.eFps) / 4));
  if (b.photo.preCapture !== a.photo.preCapture)
    push(gains, losses, b.photo.preCapture, b.photo.preCapture ? 'Adds pre-capture (buffers shots before you press)' : 'No pre-capture', 4);
  if (Math.abs(b.af.score - a.af.score) >= 3)
    push(gains, losses, b.af.score > a.af.score, b.af.score > a.af.score ? `Better subject-detection AF (${b.af.subjects.length} subject types)` : 'Older / weaker autofocus', Math.abs(b.af.score - a.af.score) / 2);

  const fa = a.body.vf;
  const fb = b.body.vf;
  if (!fa && fb) gains.push({ text: `Adds a viewfinder (${vfLabel(fb)})`, weight: 6 });
  else if (fa && !fb) losses.push({ text: 'No viewfinder', weight: 6 });
  else if (fa && fb && fa.kind !== fb.kind)
    notes.push(`Viewfinder changes from ${vfLabel(fa)} to ${vfLabel(fb)}${fb.kind === 'EVF' ? ' — you see exposure before you shoot' : ''}.`);
  else if (fa && fb && Math.abs(vfScore(fb) - vfScore(fa)) >= 8)
    push(gains, losses, vfScore(fb) > vfScore(fa), `Viewfinder: ${vfLabel(fb)} vs ${vfLabel(fa)}`, 2);
  if (Math.abs(b.af.video - a.af.video) >= 10)
    push(gains, losses, b.af.video > a.af.video, b.af.video > a.af.video ? 'Much more reliable autofocus while filming' : 'Weaker autofocus while filming', Math.abs(b.af.video - a.af.video) / 6);
  if (a.type !== b.type) notes.push(`Switching from a ${a.type.toLowerCase()} to a ${b.type.toLowerCase()} body.`);

  const va = videoStats(a.video.modes);
  const vb = videoStats(b.video.modes);
  if (vb.maxWidth !== va.maxWidth && Math.abs(vb.maxWidth - va.maxWidth) > 300)
    push(gains, losses, vb.maxWidth > va.maxWidth, `Max video ${resLabel(vb.maxWidth)} vs ${resLabel(va.maxWidth)}`, 6);
  if (vb.fullWidth4k !== va.fullWidth4k)
    push(gains, losses, vb.fullWidth4k > va.fullWidth4k, `Uncropped 4K at ${vb.fullWidth4k || '—'} fps vs ${va.fullWidth4k || '—'} fps`, 6);
  if ((va.crop4k60 ?? 9) !== (vb.crop4k60 ?? 9)) {
    const fmt = (c: number | null) => (c == null ? 'unavailable' : c <= 1.05 ? 'no crop' : `${c}× crop`);
    push(gains, losses, (vb.crop4k60 ?? 9) < (va.crop4k60 ?? 9), `4K60 with ${fmt(vb.crop4k60)} (vs ${fmt(va.crop4k60)})`, 5);
  }
  if (!!b.video.intRaw !== !!a.video.intRaw)
    push(gains, losses, !!b.video.intRaw, b.video.intRaw ? `Internal RAW video: ${b.video.intRaw}` : 'Loses internal RAW video', 6);
  if (b.video.chroma !== a.video.chroma || b.video.maxBit !== a.video.maxBit) {
    const sa = a.video.maxBit * 10 + (a.video.chroma === '4:2:2' ? 1 : 0);
    const sb = b.video.maxBit * 10 + (b.video.chroma === '4:2:2' ? 1 : 0);
    if (sa !== sb) push(gains, losses, sb > sa, `${b.video.maxBit}-bit ${b.video.chroma} vs ${a.video.maxBit}-bit ${a.video.chroma}`, 3);
  }
  const logA = a.video.log.some((l) => /log/i.test(l));
  const logB = b.video.log.some((l) => /log/i.test(l));
  if (logA !== logB) push(gains, losses, logB, logB ? `Adds Log profile (${b.video.log[0]})` : 'No Log profile', 5);
  if (a.video.openGate !== b.video.openGate) push(gains, losses, b.video.openGate, b.video.openGate ? 'Open-gate recording (reframe for vertical)' : 'No open gate', 3);
  if (a.video.unlimited !== b.video.unlimited)
    push(gains, losses, b.video.unlimited, b.video.unlimited ? `Recording: ${b.video.recLimit}` : `Recording limit: ${b.video.recLimit}`, 3);
  if (vb.maxFps !== va.maxFps) push(gains, losses, vb.maxFps > va.maxFps, `Slow motion up to ${vb.maxFps} fps vs ${va.maxFps} fps`, 2);
  // popular specific formats people ask about
  for (const [tier, fps, label] of [
    ['4K', 24, '4K 24p'],
    ['4K', 30, '4K 30p'],
    ['4K', 60, '4K 60p'],
    ['4K', 120, '4K 120p'],
    ['FHD', 120, '1080p 120'],
  ] as const) {
    const ca = canShoot(a, tier, fps);
    const cb = canShoot(b, tier, fps);
    if (!ca && cb) gains.push({ text: `Can shoot ${label}${cb.crop > 1.05 ? ` (${cb.crop}× crop)` : ' uncropped'}`, weight: 3 });
    else if (ca && !cb) losses.push({ text: `Can’t shoot ${label}`, weight: 3 });
  }

  const dw = b.body.weight - a.body.weight;
  if (Math.abs(dw) >= 80) push(gains, losses, dw < 0, `${Math.abs(dw)}g ${dw < 0 ? 'lighter' : 'heavier'}`, Math.abs(dw) / 100);
  if (a.body.sealed !== b.body.sealed) push(gains, losses, b.body.sealed, b.body.sealed ? 'Weather sealed' : 'Not weather sealed', 3);
  if (a.body.slots.length !== b.body.slots.length)
    push(gains, losses, b.body.slots.length > a.body.slots.length, b.body.slots.length > 1 ? 'Dual card slots (backup recording)' : 'Single card slot', 3);

  if (a.mount !== b.mount) notes.push(`Different mount (${a.mount} → ${b.mount}): budget for new lenses or an adapter.`);
  if (a.body.battery !== b.body.battery) notes.push(`Different battery (${b.body.battery}) — your spares won't carry over.`);
}

function droneDiffs(a: Drone, b: Drone, gains: Point[], losses: Point[], notes: string[]) {
  const ma = a.cameras[0];
  const mb = b.cameras[0];
  if (ma.sensor !== mb.sensor)
    push(gains, losses, SENSOR_SCORE[mb.sensor] > SENSOR_SCORE[ma.sensor], `${mb.sensor} main sensor vs ${ma.sensor}`, 8);
  if (mb.mp !== ma.mp && Math.abs(mb.mp / ma.mp - 1) > 0.15) push(gains, losses, mb.mp > ma.mp, `${mb.mp}MP vs ${ma.mp}MP photos`, 3);
  if (b.cameras.length !== a.cameras.length)
    push(gains, losses, b.cameras.length > a.cameras.length, `${b.cameras.length} cameras vs ${a.cameras.length} (${b.cameras.map((c) => c.focal).join(' / ')})`, 7);
  const va = videoStats(a.video.modes);
  const vb = videoStats(b.video.modes);
  if (Math.abs(vb.maxWidth - va.maxWidth) > 300) push(gains, losses, vb.maxWidth > va.maxWidth, `Max video ${resLabel(vb.maxWidth)} vs ${resLabel(va.maxWidth)}`, 6);
  if (vb.any4k !== va.any4k) push(gains, losses, vb.any4k > va.any4k, `4K up to ${vb.any4k} fps vs ${va.any4k} fps`, 4);
  const pa = a.video.codecs.some((c) => /ProRes|DNG|RAW/i.test(c));
  const pb = b.video.codecs.some((c) => /ProRes|DNG|RAW/i.test(c));
  if (pa !== pb) push(gains, losses, pb, pb ? 'Pro codecs (ProRes / RAW)' : 'No ProRes / RAW', 4);
  if (a.video.vertical !== b.video.vertical) push(gains, losses, b.video.vertical, b.video.vertical ? 'True vertical shooting' : 'No true vertical', 3);
  if (a.photo.raw !== b.photo.raw) push(gains, losses, b.photo.raw, b.photo.raw ? 'RAW (DNG) photos' : 'No RAW photos', 3);

  const fa = a.flight;
  const fb = b.flight;
  if (Math.abs(fb.time - fa.time) >= 4) push(gains, losses, fb.time > fa.time, `${fb.time} min flight time vs ${fa.time} min`, Math.abs(fb.time - fa.time) / 3);
  if (Math.abs(fb.rangeKm - fa.rangeKm) >= 3) push(gains, losses, fb.rangeKm > fa.rangeKm, `${fb.rangeKm} km range vs ${fa.rangeKm} km`, 3);
  const ob = { 'omni-lidar': 4, omni: 3, forward: 2, downward: 1 };
  if (fa.obstacle !== fb.obstacle) push(gains, losses, ob[fb.obstacle] > ob[fa.obstacle], `Obstacle sensing: ${fb.obstacleText}`, 6);
  if (fa.sub250 !== fb.sub250)
    push(gains, losses, fb.sub250, fb.sub250 ? 'Under 250 g — lighter registration rules in many regions' : 'Over 250 g — may need registration / licensing', 5);
  if (Math.abs(fb.wind - fa.wind) >= 1) push(gains, losses, fb.wind > fa.wind, `Handles ${fb.wind} m/s wind vs ${fa.wind} m/s`, 2);
  notes.push('Check local drone rules: weight class and remote-ID requirements differ by country.');
}

function gimbalDiffs(a: Gimbal, b: Gimbal, gains: Point[], losses: Point[], notes: string[]) {
  const kg = (x: number) => (x < 1 ? `${Math.round(x * 1000)} g` : `${x} kg`);
  if (a.payload !== b.payload) push(gains, losses, b.payload > a.payload, `Payload ${kg(b.payload)} vs ${kg(a.payload)}`, 6);
  if (Math.abs(b.battery - a.battery) >= 1) push(gains, losses, b.battery > a.battery, `${b.battery} h battery vs ${a.battery} h`, 4);
  const dw = b.weight - a.weight;
  if (Math.abs(dw) >= 60) push(gains, losses, dw < 0, `${Math.abs(dw)} g ${dw < 0 ? 'lighter' : 'heavier'}`, 4);
  const lidar = (g: Gimbal) => /LiDAR/i.test(g.focus);
  if (lidar(a) !== lidar(b)) push(gains, losses, lidar(b), lidar(b) ? 'LiDAR autofocus for manual lenses' : 'No LiDAR focusing', 5);
  const trk = (g: Gimbal) => /module|transmitter|tracker/i.test(g.tracking);
  if (trk(a) !== trk(b)) push(gains, losses, trk(b), trk(b) ? `Subject tracking without the phone app (${b.tracking})` : 'Tracking needs the phone app', 5);
  const vert = (g: Gimbal) => /native/i.test(g.vertical);
  if (vert(a) !== vert(b)) push(gains, losses, vert(b), vert(b) ? 'Native vertical shooting' : 'No native vertical mode', 3);
  const newExtras = b.extras.filter((x) => !a.extras.includes(x));
  if (newExtras.length) gains.push({ text: `Adds: ${newExtras.join(', ')}`, weight: 2 });
  if (a.cls !== b.cls) notes.push(`These are different classes: a ${a.cls.toLowerCase()} gimbal vs a ${b.cls.toLowerCase()} gimbal.`);
}

export function verdict(current: Product, target: Product, priority: Priority): Verdict {
  const sa = scoresFor(current);
  const sb = scoresFor(target);
  const gains: Point[] = [];
  const losses: Point[] = [];
  const notes: string[] = [];

  if (current.kind === 'camera' && target.kind === 'camera') cameraDiffs(current, target, gains, losses, notes);
  if (current.kind === 'drone' && target.kind === 'drone') droneDiffs(current, target, gains, losses, notes);
  if (current.kind === 'gimbal' && target.kind === 'gimbal') gimbalDiffs(current, target, gains, losses, notes);

  const weighted = (s: typeof sa) => {
    switch (priority) {
      case 'photo':
        return s.photo * 0.75 + s.video * 0.25;
      case 'video':
        return s.photo * 0.25 + s.video * 0.75;
      case 'flight':
        return (s.flight ?? s.overall) * 0.6 + s.overall * 0.4;
      default:
        return s.overall;
    }
  };
  const delta = Math.round(weighted(sb) - weighted(sa));

  const yearGap = target.year - current.year;
  if (yearGap > 0) notes.push(`${yearGap} year${yearGap > 1 ? 's' : ''} newer generation.`);
  if (yearGap < 0) notes.push(`${-yearGap} year${yearGap < -1 ? 's' : ''} older — may be cheaper used, but nearer end of firmware support.`);
  const dp = target.price - current.price;
  if (dp !== 0) notes.push(`Launch price ${dp > 0 ? 'higher' : 'lower'} by ${fmtPrice(Math.abs(dp))} (${fmtPrice(target.price)} vs ${fmtPrice(current.price)}).`);

  gains.sort((x, y) => y.weight - x.weight);
  losses.sort((x, y) => y.weight - x.weight);

  const focus = priority === 'hybrid' ? 'overall' : priority;
  const name = target.model;
  let level: Verdict['level'];
  let title: string;
  let summary: string;
  if (delta >= 12) {
    level = 'strong';
    title = 'Strong upgrade — go for it';
    summary = `The ${name} is a big step up for ${focus} shooting (+${delta} points).`;
  } else if (delta >= 5) {
    level = 'upgrade';
    title = 'Worthwhile upgrade';
    summary = `A clear improvement for ${focus} (+${delta}). Worth it if the gains below match how you shoot.`;
  } else if (delta > -3) {
    level = 'side';
    title = 'Sidegrade — probably skip';
    summary = `Only ${delta >= 0 ? '+' : ''}${delta} points for ${focus}. Upgrade only if a specific feature below is a must-have.`;
  } else {
    level = 'down';
    title = 'Downgrade — keep what you have';
    summary = `The ${name} scores ${-delta} points lower for ${focus}. Your current gear is the better tool.`;
  }
  if (level !== 'down' && dp > 0 && delta > 0 && dp / delta > 250 && level !== 'strong')
    summary += ` Note: you'd pay roughly ${fmtPrice(Math.round(dp / delta))} per point gained.`;

  return { level, title, summary, delta, gains, losses, notes };
}
