import type { Brand, Camera, CameraLook, CamType, Drone, DroneCamera, DroneLook, DroneUse, Obstacle, SensorSize, VideoMode, Viewfinder } from './types';

/**
 * Compact authoring format for cameras. Each video mode is one string:
 *   "label|WIDTHxHEIGHT|fps,fps,...|crop|quality|note"
 * quality: "10:422", "8:420", "12:raw", optionally ":ext" for external-recorder-only.
 * crop and quality may be left empty to use defaults (full width, camera's default bit depth).
 */
export interface CamIn {
  id: string;
  brand: Brand;
  model: string;
  short?: string;
  year: number;
  price: number;
  mount: string;
  type: CamType;
  seg: string;
  look?: CameraLook;
  verify?: boolean;
  s: [SensorSize, number, string, number?]; // size, megapixels, sensor tech, crop factor override
  iso: [number, number, string?];
  fps: [number | null, number]; // mechanical, electronic (0 = no real stills burst)
  pre?: boolean;
  noMech?: boolean;
  sh?: string; // fastest shutter (default 1/4000)
  shift?: number;
  rawBits?: number;
  af: [string, number, number, string[]?]; // system, points, photo-AF rating 0-100, subjects
  vaf?: number; // video AF rating (defaults to photo rating)
  ibis?: number;
  stab?: 'gimbal' | 'eis';
  wp?: number;
  batt?: number;
  v: { log?: string[]; codecs: string[]; bit?: number; ch?: string; raw?: string; ext?: string; og?: boolean; rec?: string; unl?: boolean; m: string[] };
  vf?: string; // "EVF 3.69 0.78" | "OVF 0.95 100" | "Hybrid 3.69 0.66"
  scr: string;
  g: number;
  seal?: boolean;
  slots: string[];
  bat: string;
  ports: string[];
  hl: string[];
}

const DEFAULT_CROP: Partial<Record<SensorSize, number>> = {
  'Medium Format': 0.79,
  'Full Frame': 1,
  'Super 35': 1.5,
  'APS-C': 1.5,
  'Micro Four Thirds': 2,
  '1-inch': 2.7,
};

export function parseMode(s: string, bit: number, ch: string, camera?: string): VideoMode {
  const [label, dims, fps, crop, q, note] = s.split('|').map((x) => x.trim());
  let b = bit;
  let c = ch;
  let raw = false;
  let ext = false;
  if (q) {
    const parts = q.split(':');
    b = Number(parts[0]);
    if (parts[1] === 'raw') {
      raw = true;
      c = 'RAW';
    } else if (parts[1]) c = parts[1].split('').join(':');
    ext = parts.includes('ext');
  }
  const m: VideoMode = { label, dims, fps: fps.split(',').map(Number), crop: camera ? undefined : crop ? Number(crop) : 1, bit: b, chroma: c };
  if (raw) m.raw = true;
  if (ext) m.ext = true;
  if (camera) m.camera = crop || camera;
  if (note) m.note = note;
  return m;
}

function parseVf(s?: string): Viewfinder | null {
  if (!s) return null;
  const [kind, a, b] = s.split(' ');
  if (kind === 'OVF') return { kind: 'OVF', mag: Number(a), coverage: b ? Number(b) : undefined };
  return { kind: kind as 'EVF' | 'Hybrid', dots: Number(a), mag: b ? Number(b) : undefined };
}

const defaultLook = (t: CamType): CameraLook =>
  t === 'DSLR' ? 'dslr' : t === 'Cinema' ? 'cinema-box' : t === 'Compact' ? 'compact' : t === 'Action' ? 'action' : t === '360' ? '360' : t === 'Pocket gimbal' ? 'pocket' : 'mirrorless';

export function cam(i: CamIn): Camera {
  const bit = i.v.bit ?? 8;
  const ch = i.v.ch ?? '4:2:0';
  return {
    kind: 'camera',
    id: i.id,
    brand: i.brand,
    model: i.model,
    short: i.short ?? i.model.replace(/^(EOS|Alpha|Lumix|PowerShot|Cinema EOS)\s+/, ''),
    year: i.year,
    price: i.price,
    mount: i.mount,
    type: i.type,
    segment: i.seg,
    look: i.look ?? defaultLook(i.type),
    verify: i.verify,
    sensor: {
      size: i.s[0],
      mp: i.s[1],
      type: i.s[2],
      cropFactor: i.s[3] ?? DEFAULT_CROP[i.s[0]] ?? 1,
      isoMin: i.iso[0],
      isoMax: i.iso[1],
      isoExt: i.iso[2],
    },
    photo: {
      mechFps: i.fps[0],
      eFps: i.fps[1],
      preCapture: !!i.pre,
      mechShutter: !i.noMech,
      maxShutter: i.sh ?? '1/4000',
      pixelShift: i.shift,
      rawBits: i.rawBits ?? 14,
    },
    af: { system: i.af[0], points: i.af[1], score: i.af[2], video: i.vaf ?? i.af[2], subjects: i.af[3] ?? ['Face'] },
    ibis: i.ibis ? { stops: i.ibis } : null,
    stab: i.stab,
    waterproof: i.wp,
    battery: i.batt,
    video: {
      log: i.v.log ?? [],
      codecs: i.v.codecs,
      maxBit: Math.max(bit, ...i.v.m.map((s) => parseMode(s, bit, ch)).filter((m) => !m.ext).map((m) => m.bit ?? bit)),
      chroma: ch,
      intRaw: i.v.raw ?? null,
      extRaw: i.v.ext ?? null,
      openGate: !!i.v.og,
      recLimit: i.v.rec ?? '29:59 per clip',
      unlimited: !!i.v.unl,
      modes: i.v.m.map((s) => parseMode(s, bit, ch)),
    },
    body: {
      vf: parseVf(i.vf),
      screen: i.scr,
      weight: i.g,
      sealed: !!i.seal,
      slots: i.slots,
      battery: i.bat,
      ports: i.ports,
    },
    highlights: i.hl,
  };
}

/** Drones: mode strings are "label|WxH|fps,...|camera|quality|note". */
export interface DroneIn {
  id: string;
  model: string;
  short?: string;
  year: number;
  price: number;
  seg: string;
  look: DroneLook;
  use?: DroneUse;
  verify?: boolean;
  cams: [string, SensorSize, number, string, string, string][]; // name, sensor, MP, focal, aperture, max video
  v: { log?: string[]; codecs: string[]; bit: number; mbps: number; hdr?: string; vertical?: boolean; m: string[] };
  photo: [boolean, string, string[]];
  f: { min: number; km: number; tx: string; kmh: number; wind: number; obs: Obstacle; obsText: string; g: number; storage: string; gimbal: string };
  hl: string[];
}

export function drone(i: DroneIn): Drone {
  const cameras: DroneCamera[] = i.cams.map(([name, sensor, mp, focal, aperture, maxVideo]) => ({ name, sensor, mp, focal, aperture, maxVideo }));
  return {
    kind: 'drone',
    id: i.id,
    brand: 'DJI',
    model: i.model,
    short: i.short ?? i.model,
    year: i.year,
    price: i.price,
    segment: i.seg,
    use: i.use ?? (i.look === 'fpv' ? 'FPV' : 'Camera'),
    look: i.look,
    verify: i.verify,
    cameras,
    video: {
      log: i.v.log ?? [],
      codecs: i.v.codecs,
      maxBit: i.v.bit,
      bitrate: i.v.mbps,
      hdr: i.v.hdr ?? 'None',
      vertical: !!i.v.vertical,
      modes: i.v.m.map((s) => parseMode(s, i.v.bit, '4:2:0', cameras[0].name)),
    },
    photo: { raw: i.photo[0], formats: i.photo[1], modes: i.photo[2] },
    flight: {
      time: i.f.min,
      rangeKm: i.f.km,
      transmission: i.f.tx,
      maxSpeed: i.f.kmh,
      wind: i.f.wind,
      obstacle: i.f.obs,
      obstacleText: i.f.obsText,
      weight: i.f.g,
      storage: i.f.storage,
      gimbal: i.f.gimbal,
      sub250: i.f.g < 250,
    },
    highlights: i.hl,
  };
}

// frequently used frame-rate sets
export const R = {
  cine: '24,25,30',
  all60: '24,25,30,50,60',
  hi: '100,120',
  fhd120: '24,25,30,50,60,100,120',
  fhd240: '24,25,30,50,60,100,120,200,240',
};
