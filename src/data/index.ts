import { canon } from './canon';
import { sony } from './sony';
import { nikon } from './nikon';
import { fujifilm } from './fujifilm';
import { panasonic } from './panasonic';
import { action } from './action';
import { more } from './more';
import { action2 } from './action2';
import { drones as droneLine } from './drones';
import { drones2 } from './drones2';
import { gimbals } from './gimbals';
import { ACTION_TYPES, type Camera, type Product } from './types';

export type Section = 'cameras' | 'action' | 'drones' | 'gimbals';

export const cameras: Camera[] = [...canon, ...sony, ...nikon, ...fujifilm, ...panasonic, ...more, ...action, ...action2];
/** Every DJI drone: the core consumer line plus early, 2026, enterprise, farm and delivery models. */
export const drones = [...droneLine, ...drones2];
export const products: Product[] = [...cameras, ...drones, ...gimbals];
const map = new Map(products.map((p) => [p.id, p]));
export const byId = (id: string | undefined) => (id ? map.get(id) : undefined);

export function sectionOf(p: Product): Section {
  if (p.kind === 'drone') return 'drones';
  if (p.kind === 'gimbal') return 'gimbals';
  return ACTION_TYPES.includes(p.type) ? 'action' : 'cameras';
}
export const inSection = (s: Section) => products.filter((p) => sectionOf(p) === s);
export const brandsIn = (s: Section) => [...new Set(inSection(s).map((p) => p.brand))];

export const SECTION_INFO: Record<Section, { title: string; noun: string; plural: string }> = {
  cameras: { title: 'Cameras', noun: 'camera', plural: 'cameras' },
  action: { title: 'Action & 360', noun: 'action camera', plural: 'action & 360 cameras' },
  drones: { title: 'Drones', noun: 'drone', plural: 'drones' },
  gimbals: { title: 'Gimbals', noun: 'gimbal', plural: 'gimbals' },
};
export { gimbals };
