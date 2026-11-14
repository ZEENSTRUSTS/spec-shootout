import type { Camera, Drone, Gimbal, Product, SensorSize, VideoMode, Viewfinder } from '../data/types';

export const clamp = (v: number, lo = 0, hi = 100) => Math.max(lo, Math.min(hi, v));

export const SENSOR_SCORE: Record<SensorSize, number> = {
  'Medium Format': 100,
  'Full Frame': 90,
  'Super 35': 76,
  'APS-C': 72,
  'Micro Four Thirds': 60,
  '4/3': 60,
  '1-inch': 48,
  '1/1.3-inch': 36,
  '1/1.5-inch': 30,
  '1/1.7-inch': 28,
  '1/2-inch': 22,
  '1/2.3-inch': 18,
  '1/1.28-inch': 40,
  '1/1.9-inch': 26,
  '1/1.1-inch': 44,
  '1.4-inch': 54,
  '1/2.8-inch': 14,
};

export const modeWidth = (m: VideoMode) => Math.max(...m.dims.split('x').map(Number));
export const modeMaxFps = (m: VideoMode) => Math.max(...m.fps);
export const is4K = (m: VideoMode) => {
  const w = modeWidth(m);
  return w >= 3800 && w <= 4500;
};

/** Resolution tier used by the frame-rate finder. */
export function resTier(m: VideoMode): 'FHD' | '4K' | '5K-6K' | '8K' | 'SD/HD' {
  const w = modeWidth(m);
  if (w >= 7600) return '8K';
  if (w >= 4500) return '5K-6K';
  if (w >= 3800) return '4K';
  if (w >= 1900) return 'FHD';
  return 'SD/HD';
}

export function videoStats(all: VideoMode[]) {
  const modes = all.filter((m) => !m.ext);
  const use = modes.length ? modes : all;
  const fourK = use.filter(is4K);
  const maxWidth = Math.max(0, ...use.map(modeWidth));
  const fullWidth4k = Math.max(0, ...fourK.filter((m) => (m.crop ?? 1) <= 1.05).map(modeMaxFps));
  const any4k = Math.max(0, ...fourK.map(modeMaxFps));
  const maxFps = Math.max(0, ...use.map(modeMaxFps));
  const fast4k = fourK.filter((m) => m.fps.some((f) => f >= 50));
  const crop4k60 = fast4k.length ? Math.min(...fast4k.map((m) => m.crop ?? 1)) : null;
  return { maxWidth, fullWidth4k, any4k, maxFps, crop4k60 };
}

/** Best (lowest) crop available for a given resolution tier + frame rate, or null if unsupported. */
export function canShoot(p: Product, tier: string, fps: number, includeExt = false): { crop: number; ext: boolean } | null {
  if (p.kind === 'gimbal') return null;
  let best: { crop: number; ext: boolean } | null = null;
  for (const m of p.video.modes) {
    if (m.ext && !includeExt) continue;
    const t = resTier(m);
    const ok = tier === 'any' || t === tier || (tier === '5K-6K' && t === '8K') || (tier === '4K' && (t === '5K-6K' || t === '8K'));
    if (!ok || !m.fps.includes(fps)) continue;
    const c = m.crop ?? 1;
    if (!best || c < best.crop) best = { crop: c, ext: !!m.ext };
  }
  return best;
}

export function resLabel(width: number) {
  if (width >= 7600) return '8K';
  if (width >= 4500) return `${(width / 1000).toFixed(1).replace('.0', '')}K`;
  if (width >= 3800) return '4K';
  if (width >= 1900) return '1080p';
  if (width >= 1200) return '720p';
  return 'SD';
}

export interface Factor {
  label: string;
  score: number;
  weight: number;
  detail: string;
}

export interface Scores {
  photo: number;
  video: number;
  flight?: number;
  overall: number;
  /** what the UI shows as bars, in order (last is Overall) */
  bars: [string, number][];
  /** factor groups shown in "How it scores" */
  factors: Record<string, Factor[]>;
}

const total = (fs: Factor[]) => Math.round(fs.reduce((a, f) => a + f.score * f.weight, 0) / fs.reduce((a, f) => a + f.weight, 0));
const mpScore = (mp: number) => clamp(20 + (80 * Math.log2(mp / 12)) / Math.log2(100 / 12));
const fpsScore = (fps: number) => (fps <= 0 ? 0 : clamp((100 * Math.log(fps)) / Math.log(120)));
const resScore = (w: number) => (w >= 7600 ? 100 : w >= 6000 ? 90 : w >= 5000 ? 82 : w >= 3800 ? 68 : w >= 1900 ? 38 : 15);

export function vfScore(vf: Viewfinder | null) {
  if (!vf) return 0;
  if (vf.kind === 'OVF') return clamp(42 + (vf.coverage && vf.coverage >= 100 ? 10 : 0) + (vf.mag ?? 0.7) * 15);
  const e = clamp(20 + (85 * Math.log(vf.dots ?? 1)) / Math.log(9.44));
  return vf.kind === 'Hybrid' ? clamp(e + 6) : e;
}

export const vfLabel = (vf: Viewfinder | null) =>
  !vf ? 'None' : vf.kind === 'OVF' ? `Optical${vf.coverage ? ` ${vf.coverage}%` : ''}${vf.mag ? `, ${vf.mag}×` : ''}` : `${vf.kind === 'Hybrid' ? 'Hybrid OVF/EVF' : 'EVF'} ${vf.dots}M-dot${vf.mag ? `, ${vf.mag}×` : ''}`;

function cameraScores(c: Camera): Scores {
  const vs = videoStats(c.video.modes);
  const ibis = c.stab === 'gimbal' ? 100 : c.stab === 'eis' ? 84 : c.ibis ? clamp(40 + c.ibis.stops * 7.5) : 0;
  const stabText = c.stab === 'gimbal' ? '3-axis mechanical gimbal' : c.stab === 'eis' ? 'Electronic (horizon-levelling)' : c.ibis ? `${c.ibis.stops}-stop IBIS` : 'No IBIS';
  const burst = Math.max(c.photo.eFps, c.photo.mechFps ?? 0);

  const photo: Factor[] = [
    { label: 'Resolution', score: mpScore(c.sensor.mp), weight: 0.2, detail: `${c.sensor.mp}MP` },
    { label: 'Sensor size', score: SENSOR_SCORE[c.sensor.size], weight: 0.18, detail: c.sensor.size },
    { label: 'Speed', score: clamp(fpsScore(burst) + (c.photo.preCapture ? 6 : 0)), weight: 0.14, detail: burst ? `${burst} fps${c.photo.preCapture ? ' + pre-capture' : ''}` : 'Video-first body' },
    { label: 'Autofocus', score: c.af.score, weight: 0.16, detail: `${c.af.subjects.length} subject type${c.af.subjects.length > 1 ? 's' : ''}` },
    { label: 'Stabilization', score: ibis, weight: 0.12, detail: stabText },
    { label: 'Viewfinder', score: vfScore(c.body.vf), weight: 0.1, detail: vfLabel(c.body.vf) },
    {
      label: 'Build',
      score: (c.body.sealed ? 60 : 15) + (c.body.slots.length > 1 ? 40 : 0),
      weight: 0.1,
      detail: `${c.body.sealed ? 'Sealed' : 'Not sealed'}, ${c.body.slots.length} slot${c.body.slots.length > 1 ? 's' : ''}`,
    },
  ];

  const v = c.video;
  const pipeline = v.intRaw ? 100 : v.maxBit >= 10 && v.chroma === '4:2:2' ? (v.extRaw ? 88 : 80) : v.maxBit >= 10 ? 65 : v.extRaw ? 45 : 32;
  const fourK = vs.fullWidth4k >= 120 ? 100 : vs.fullWidth4k >= 60 ? 85 : vs.fullWidth4k >= 30 ? 62 : vs.fullWidth4k >= 24 ? 52 : vs.any4k ? 38 : 10;
  const video: Factor[] = [
    { label: 'Max resolution', score: resScore(vs.maxWidth), weight: 0.15, detail: resLabel(vs.maxWidth) },
    { label: '4K quality', score: clamp(fourK + (vs.any4k > vs.fullWidth4k ? 6 : 0)), weight: 0.2, detail: vs.fullWidth4k ? `Uncropped 4K up to ${vs.fullWidth4k}p` : vs.any4k ? `Cropped 4K up to ${vs.any4k}p` : 'No internal 4K' },
    { label: 'Codec / RAW', score: pipeline, weight: 0.16, detail: v.intRaw ? 'Internal RAW' : `${v.maxBit}-bit ${v.chroma}${v.extRaw ? ' + external RAW/10-bit' : ''}` },
    { label: 'Log profile', score: v.log.some((l) => /log/i.test(l)) ? 100 : 20, weight: 0.08, detail: v.log.join(', ') || 'None' },
    {
      label: '4K60 crop',
      score: vs.crop4k60 == null ? 20 : vs.crop4k60 <= 1.05 ? 100 : vs.crop4k60 <= 1.2 ? 80 : 55,
      weight: 0.09,
      detail: vs.crop4k60 == null ? 'No 4K60' : vs.crop4k60 <= 1.05 ? 'No crop' : `${vs.crop4k60}× crop`,
    },
    { label: 'Stabilization', score: ibis || 25, weight: 0.09, detail: ibis ? stabText : 'Lens / digital only' },
    { label: 'Recording time', score: v.unlimited ? 100 : 60, weight: 0.06, detail: v.recLimit },
    { label: 'Slow motion', score: vs.maxFps >= 240 ? 100 : vs.maxFps >= 180 ? 88 : vs.maxFps >= 120 ? 75 : vs.maxFps >= 60 ? 45 : 25, weight: 0.06, detail: `Up to ${vs.maxFps}p` },
    { label: 'Open gate', score: v.openGate ? 100 : 40, weight: 0.03, detail: v.openGate ? 'Yes' : 'No' },
    { label: 'Video AF', score: c.af.video, weight: 0.08, detail: c.af.system },
  ];

  const p = total(photo);
  const vv = total(video);
  const o = Math.round((p + vv) / 2);
  return { photo: p, video: vv, overall: o, bars: [['Photo', p], ['Video', vv], ['Overall', o]], factors: { Photo: photo, Video: video } };
}

const OBSTACLE_SCORE = { 'omni-lidar': 100, omni: 85, forward: 50, downward: 25 } as const;

function droneScores(d: Drone): Scores {
  const main = d.cameras[0];
  const vs = videoStats(d.video.modes);
  const camCount = d.cameras.length;
  const multi = camCount >= 3 ? 100 : camCount === 2 ? 75 : 35;
  const pro = d.video.codecs.some((c) => /ProRes|DNG|RAW/i.test(c));

  const photo: Factor[] = [
    { label: 'Main sensor', score: SENSOR_SCORE[main.sensor], weight: 0.4, detail: main.sensor },
    { label: 'Resolution', score: mpScore(main.mp), weight: 0.15, detail: `${main.mp}MP` },
    { label: 'Extra cameras', score: multi, weight: 0.25, detail: `${camCount} camera${camCount > 1 ? 's' : ''}` },
    { label: 'RAW photos', score: d.photo.raw ? 100 : 0, weight: 0.1, detail: d.photo.formats },
    { label: 'Gimbal', score: d.video.vertical ? 100 : /3-axis/.test(d.flight.gimbal) ? 60 : 30, weight: 0.1, detail: d.flight.gimbal },
  ];
  const video: Factor[] = [
    { label: 'Max resolution', score: resScore(vs.maxWidth), weight: 0.2, detail: resLabel(vs.maxWidth) },
    { label: '4K frame rate', score: vs.any4k >= 120 ? 100 : vs.any4k >= 100 ? 92 : vs.any4k >= 60 ? 75 : vs.any4k >= 30 ? 50 : 15, weight: 0.2, detail: vs.any4k ? `4K up to ${vs.any4k}p` : 'No 4K' },
    {
      label: 'Codec / Log',
      score: pro ? 100 : d.video.maxBit >= 10 && d.video.log.length ? 80 : d.video.log.length ? 50 : 35,
      weight: 0.2,
      detail: pro ? d.video.codecs.filter((c) => /ProRes|DNG|RAW/i.test(c)).join(', ') : `${d.video.maxBit}-bit ${d.video.log.join(', ') || 'standard'}`,
    },
    { label: 'Bitrate', score: clamp((d.video.bitrate / 200) * 100), weight: 0.1, detail: `${d.video.bitrate} Mbps` },
    { label: 'Multi-camera video', score: multi, weight: 0.15, detail: `${camCount} recording camera${camCount > 1 ? 's' : ''}` },
    { label: 'Sensor size', score: SENSOR_SCORE[main.sensor], weight: 0.15, detail: main.sensor },
  ];
  const f = d.flight;
  const flight: Factor[] = [
    { label: 'Flight time', score: clamp((f.time / 50) * 100), weight: 0.3, detail: `${f.time} min` },
    { label: 'Range', score: clamp((f.rangeKm / 30) * 100), weight: 0.2, detail: `${f.rangeKm} km` },
    { label: 'Obstacle sensing', score: OBSTACLE_SCORE[f.obstacle], weight: 0.3, detail: f.obstacleText },
    { label: 'Wind resistance', score: clamp((f.wind / 12) * 100), weight: 0.2, detail: `${f.wind} m/s` },
  ];
  const p = total(photo);
  const v = total(video);
  const fl = total(flight);
  const o = Math.round(p * 0.3 + v * 0.35 + fl * 0.35);
  return { photo: p, video: v, flight: fl, overall: o, bars: [['Photo', p], ['Video', v], ['Flight', fl], ['Overall', o]], factors: { Photo: photo, Video: video, Flight: flight } };
}

function gimbalScores(g: Gimbal): Scores {
  const phone = g.cls === 'Phone';
  const payload: Factor[] = [
    { label: 'Payload', score: clamp((g.payload / (phone ? 0.3 : 4.5)) * 100), weight: 1, detail: phone ? `${Math.round(g.payload * 1000)} g phones` : `${g.payload} kg` },
  ];
  const battery: Factor[] = [{ label: 'Battery', score: clamp((g.battery / (phone ? 12 : 14)) * 100), weight: 1, detail: `${g.battery} h` }];
  const smartScore = clamp(
    25 +
      (/LiDAR/i.test(g.focus) ? 25 : /focus/i.test(g.focus) ? 10 : 0) +
      (/module|transmitter|tracker/i.test(g.tracking) ? 20 : /ActiveTrack|tracking/i.test(g.tracking) ? 10 : 0) +
      (/native|quick/i.test(g.vertical) ? 10 : 0) +
      (/touch|OLED/i.test(g.screen) ? 8 : 0) +
      g.extras.length * 4,
  );
  const smart: Factor[] = [
    { label: 'Tracking', score: /module|transmitter|tracker/i.test(g.tracking) ? 100 : /ActiveTrack|tracking/i.test(g.tracking) ? 65 : 25, weight: 0.35, detail: g.tracking },
    { label: 'Focus control', score: /LiDAR/i.test(g.focus) ? 100 : /focus/i.test(g.focus) ? 65 : 35, weight: 0.25, detail: g.focus },
    { label: 'Vertical shooting', score: /native/i.test(g.vertical) ? 100 : /quick|rotate/i.test(g.vertical) ? 70 : 35, weight: 0.2, detail: g.vertical },
    { label: 'Extras', score: clamp(30 + g.extras.length * 18), weight: 0.2, detail: g.extras.join(', ') },
  ];
  const port: Factor[] = [
    { label: 'Portability', score: phone ? clamp(100 - (g.weight - 250) / 2.5) : clamp(100 - (g.weight - 700) / 18), weight: 1, detail: `${g.weight} g` },
  ];
  const P = total(payload);
  const B = total(battery);
  const S = Math.round((total(smart) + smartScore) / 2);
  const W = total(port);
  const o = Math.round(P * 0.3 + B * 0.2 + S * 0.3 + W * 0.2);
  return {
    photo: P,
    video: S,
    overall: o,
    bars: [['Payload', P], ['Battery', B], ['Smart', S], ['Portability', W], ['Overall', o]],
    factors: { Payload: [...payload, ...battery, ...port], Smart: smart },
  };
}

const cache = new Map<string, Scores>();
export function scoresFor(p: Product): Scores {
  let s = cache.get(p.id);
  if (!s) {
    s = p.kind === 'camera' ? cameraScores(p) : p.kind === 'drone' ? droneScores(p) : gimbalScores(p);
    cache.set(p.id, s);
  }
  return s;
}
