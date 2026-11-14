import type { Camera, Drone, Gimbal, Product } from '../data/types';
import { SENSOR_SCORE, videoStats, resLabel, vfLabel, vfScore } from './scoring';

export interface SpecRow<T> {
  label: string;
  value: (p: T) => string;
  num?: (p: T) => number | null;
  better?: 'high' | 'low';
}
export interface SpecGroup<T> {
  group: string;
  rows: SpecRow<T>[];
}

const yes = (b: boolean, y = 'Yes', n = 'No') => (b ? `✓ ${y}` : `✕ ${n}`);
const bool = <T,>(label: string, get: (p: T) => boolean, y?: string, n?: string): SpecRow<T> => ({
  label,
  value: (p) => yes(get(p), y, n),
  num: (p) => (get(p) ? 1 : 0),
  better: 'high',
});
export const money = (n: number) => `$${n.toLocaleString('en-US')}`;

export const cameraSpec: SpecGroup<Camera>[] = [
  {
    group: 'Overview',
    rows: [
      { label: 'Launch price (body)', value: (c) => money(c.price), num: (c) => c.price, better: 'low' },
      { label: 'Released', value: (c) => String(c.year), num: (c) => c.year, better: 'high' },
      { label: 'Camera type', value: (c) => c.type },
      { label: 'Lens mount', value: (c) => c.mount },
      { label: 'Category', value: (c) => c.segment },
    ],
  },
  {
    group: 'Sensor & image',
    rows: [
      { label: 'Sensor size', value: (c) => c.sensor.size, num: (c) => SENSOR_SCORE[c.sensor.size], better: 'high' },
      { label: 'Resolution', value: (c) => `${c.sensor.mp} MP`, num: (c) => c.sensor.mp, better: 'high' },
      { label: 'Sensor type', value: (c) => c.sensor.type },
      { label: 'Crop factor', value: (c) => `${c.sensor.cropFactor}×` },
      { label: 'Native ISO', value: (c) => `${c.sensor.isoMin.toLocaleString()}–${c.sensor.isoMax.toLocaleString()}`, num: (c) => c.sensor.isoMax, better: 'high' },
      { label: 'Extended ISO', value: (c) => c.sensor.isoExt ?? '—' },
      { label: 'RAW bit depth', value: (c) => `${c.photo.rawBits}-bit`, num: (c) => c.photo.rawBits, better: 'high' },
      { label: 'Pixel-shift high-res', value: (c) => (c.photo.pixelShift ? `${c.photo.pixelShift} MP` : '—'), num: (c) => c.photo.pixelShift ?? 0, better: 'high' },
    ],
  },
  {
    group: 'Stills shooting',
    rows: [
      { label: 'Burst (mechanical)', value: (c) => (c.photo.mechFps ? `${c.photo.mechFps} fps` : '—'), num: (c) => c.photo.mechFps ?? 0, better: 'high' },
      { label: 'Burst (electronic / live view)', value: (c) => (c.photo.eFps ? `${c.photo.eFps} fps` : '—'), num: (c) => c.photo.eFps, better: 'high' },
      bool('Pre-capture', (c) => c.photo.preCapture),
      bool('Mechanical shutter', (c) => c.photo.mechShutter, 'Yes', 'No (electronic only)'),
      { label: 'Fastest shutter', value: (c) => c.photo.maxShutter },
    ],
  },
  {
    group: 'Autofocus',
    rows: [
      { label: 'AF system', value: (c) => c.af.system },
      { label: 'AF points', value: (c) => c.af.points.toLocaleString(), num: (c) => c.af.points, better: 'high' },
      { label: 'Subject detection', value: (c) => c.af.subjects.join(', '), num: (c) => c.af.subjects.length, better: 'high' },
      { label: 'Stills AF rating (app)', value: (c) => `${c.af.score}/100`, num: (c) => c.af.score, better: 'high' },
      { label: 'Video AF rating (app)', value: (c) => `${c.af.video}/100`, num: (c) => c.af.video, better: 'high' },
    ],
  },
  {
    group: 'Stabilization',
    rows: [
      {
        label: 'Stabilization',
        value: (c) => (c.stab === 'gimbal' ? '✓ 3-axis mechanical gimbal' : c.stab === 'eis' ? '✓ Electronic, horizon-levelling' : c.ibis ? `✓ IBIS up to ${c.ibis.stops} stops` : '✕ None (lens IS only)'),
        num: (c) => (c.stab === 'gimbal' ? 10 : c.stab === 'eis' ? 7 : c.ibis?.stops ?? 0),
        better: 'high',
      },
      { label: 'Waterproof', value: (c) => (c.waterproof ? `${c.waterproof} m without housing` : '—'), num: (c) => c.waterproof ?? 0, better: 'high' },
      { label: 'Recording battery life', value: (c) => (c.battery ? `${c.battery} min` : '—'), num: (c) => c.battery ?? 0, better: 'high' },
    ],
  },
  {
    group: 'Video',
    rows: [
      { label: 'Max resolution', value: (c) => resLabel(videoStats(c.video.modes).maxWidth), num: (c) => videoStats(c.video.modes).maxWidth, better: 'high' },
      {
        label: 'Uncropped 4K',
        value: (c) => {
          const f = videoStats(c.video.modes).fullWidth4k;
          return f ? `Up to ${f} fps` : '—';
        },
        num: (c) => videoStats(c.video.modes).fullWidth4k,
        better: 'high',
      },
      { label: '4K max frame rate', value: (c) => (videoStats(c.video.modes).any4k ? `${videoStats(c.video.modes).any4k} fps` : 'No internal 4K'), num: (c) => videoStats(c.video.modes).any4k, better: 'high' },
      {
        label: '4K60 crop',
        value: (c) => {
          const v = videoStats(c.video.modes).crop4k60;
          return v == null ? 'No 4K60' : v <= 1.05 ? 'None (full width)' : `${v}×`;
        },
        num: (c) => videoStats(c.video.modes).crop4k60 ?? 9,
        better: 'low',
      },
      { label: 'Max frame rate', value: (c) => `${videoStats(c.video.modes).maxFps} fps`, num: (c) => videoStats(c.video.modes).maxFps, better: 'high' },
      { label: 'Internal RAW', value: (c) => c.video.intRaw ?? '✕ No', num: (c) => (c.video.intRaw ? 1 : 0), better: 'high' },
      { label: 'External RAW', value: (c) => c.video.extRaw ?? '—' },
      { label: 'Bit depth / sampling', value: (c) => `${c.video.maxBit}-bit ${c.video.chroma}`, num: (c) => c.video.maxBit * 10 + (c.video.chroma === '4:2:2' ? 1 : 0), better: 'high' },
      { label: 'Log / profiles', value: (c) => c.video.log.join(', ') || '—', num: (c) => (c.video.log.some((l) => /log/i.test(l)) ? 1 : 0), better: 'high' },
      { label: 'Codecs', value: (c) => c.video.codecs.join(', ') },
      bool('Open gate', (c) => c.video.openGate),
      { label: 'Recording limit', value: (c) => c.video.recLimit, num: (c) => (c.video.unlimited ? 1 : 0), better: 'high' },
    ],
  },
  {
    group: 'Body & handling',
    rows: [
      { label: 'Viewfinder', value: (c) => (c.body.vf ? vfLabel(c.body.vf) : '✕ None'), num: (c) => vfScore(c.body.vf), better: 'high' },
      { label: 'Rear screen', value: (c) => c.body.screen },
      { label: 'Weight', value: (c) => `${c.body.weight} g`, num: (c) => c.body.weight, better: 'low' },
      bool('Weather sealed', (c) => c.body.sealed),
      { label: 'Card slots', value: (c) => c.body.slots.join(' + '), num: (c) => c.body.slots.length, better: 'high' },
      { label: 'Battery', value: (c) => c.body.battery },
      { label: 'Ports & wireless', value: (c) => c.body.ports.join(', ') },
    ],
  },
];

const OB = { 'omni-lidar': 4, omni: 3, forward: 2, downward: 1 };

export const droneSpec: SpecGroup<Drone>[] = [
  {
    group: 'Overview',
    rows: [
      { label: 'Launch price', value: (d) => money(d.price), num: (d) => d.price, better: 'low' },
      { label: 'Released', value: (d) => String(d.year), num: (d) => d.year, better: 'high' },
      { label: 'Category', value: (d) => d.segment },
      { label: 'Takeoff weight', value: (d) => `${d.flight.weight} g`, num: (d) => d.flight.weight, better: 'low' },
      bool('Under 250 g', (d) => d.flight.sub250),
    ],
  },
  {
    group: 'Cameras',
    rows: [
      { label: 'Main sensor', value: (d) => d.cameras[0].sensor, num: (d) => SENSOR_SCORE[d.cameras[0].sensor], better: 'high' },
      { label: 'Main resolution', value: (d) => `${d.cameras[0].mp} MP`, num: (d) => d.cameras[0].mp, better: 'high' },
      { label: 'Main aperture', value: (d) => d.cameras[0].aperture },
      { label: 'Number of cameras', value: (d) => String(d.cameras.length), num: (d) => d.cameras.length, better: 'high' },
      { label: 'Camera lineup', value: (d) => d.cameras.map((c) => `${c.focal} ${c.sensor} ${c.mp}MP`).join(' · ') },
      { label: 'Gimbal', value: (d) => d.flight.gimbal },
    ],
  },
  {
    group: 'Video',
    rows: [
      { label: 'Max resolution', value: (d) => resLabel(videoStats(d.video.modes).maxWidth), num: (d) => videoStats(d.video.modes).maxWidth, better: 'high' },
      { label: '4K max frame rate', value: (d) => `${videoStats(d.video.modes).any4k} fps`, num: (d) => videoStats(d.video.modes).any4k, better: 'high' },
      { label: 'Max frame rate', value: (d) => `${videoStats(d.video.modes).maxFps} fps`, num: (d) => videoStats(d.video.modes).maxFps, better: 'high' },
      { label: 'Bit depth', value: (d) => `${d.video.maxBit}-bit`, num: (d) => d.video.maxBit, better: 'high' },
      { label: 'Log / profiles', value: (d) => d.video.log.join(', ') },
      { label: 'Codecs', value: (d) => d.video.codecs.join(', ') },
      { label: 'Max bitrate', value: (d) => `${d.video.bitrate} Mbps`, num: (d) => d.video.bitrate, better: 'high' },
      { label: 'HDR', value: (d) => d.video.hdr },
      bool('True vertical', (d) => d.video.vertical),
    ],
  },
  {
    group: 'Photo',
    rows: [
      bool('RAW photos', (d) => d.photo.raw),
      { label: 'Formats', value: (d) => d.photo.formats },
      { label: 'Modes', value: (d) => d.photo.modes.join(', ') },
    ],
  },
  {
    group: 'Flight',
    rows: [
      { label: 'Max flight time', value: (d) => `${d.flight.time} min`, num: (d) => d.flight.time, better: 'high' },
      { label: 'Video transmission', value: (d) => `${d.flight.rangeKm} km · ${d.flight.transmission}`, num: (d) => d.flight.rangeKm, better: 'high' },
      { label: 'Max speed', value: (d) => `${d.flight.maxSpeed} km/h`, num: (d) => d.flight.maxSpeed, better: 'high' },
      { label: 'Wind resistance', value: (d) => `${d.flight.wind} m/s`, num: (d) => d.flight.wind, better: 'high' },
      { label: 'Obstacle sensing', value: (d) => d.flight.obstacleText, num: (d) => OB[d.flight.obstacle], better: 'high' },
      { label: 'Storage', value: (d) => d.flight.storage },
    ],
  },
];

export const gimbalSpec: SpecGroup<Gimbal>[] = [
  {
    group: 'Overview',
    rows: [
      { label: 'Launch price', value: (g) => money(g.price), num: (g) => g.price, better: 'low' },
      { label: 'Released', value: (g) => String(g.year), num: (g) => g.year, better: 'high' },
      { label: 'For', value: (g) => (g.cls === 'Phone' ? 'Smartphones' : 'Mirrorless / DSLR / cinema cameras') },
      { label: 'Category', value: (g) => g.segment },
    ],
  },
  {
    group: 'Performance',
    rows: [
      { label: 'Max payload', value: (g) => (g.payload < 1 ? `${Math.round(g.payload * 1000)} g` : `${g.payload} kg`), num: (g) => g.payload, better: 'high' },
      { label: 'Axes', value: (g) => `${g.axes}-axis`, num: (g) => g.axes, better: 'high' },
      { label: 'Battery life', value: (g) => `${g.battery} h`, num: (g) => g.battery, better: 'high' },
      { label: 'Weight', value: (g) => `${g.weight} g`, num: (g) => g.weight, better: 'low' },
    ],
  },
  {
    group: 'Smart features',
    rows: [
      { label: 'Subject tracking', value: (g) => g.tracking },
      { label: 'Focus / zoom control', value: (g) => g.focus },
      { label: 'Vertical shooting', value: (g) => g.vertical },
      { label: 'Screen', value: (g) => g.screen },
      { label: 'Extras', value: (g) => g.extras.join(', '), num: (g) => g.extras.length, better: 'high' },
      { label: 'Connectivity', value: (g) => g.connectivity },
    ],
  },
];

export function specFor(p: Product): SpecGroup<Product>[] {
  return (p.kind === 'camera' ? cameraSpec : p.kind === 'drone' ? droneSpec : gimbalSpec) as unknown as SpecGroup<Product>[];
}
