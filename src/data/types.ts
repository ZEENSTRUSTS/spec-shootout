export type Kind = 'camera' | 'drone' | 'gimbal';
export type Brand = 'Sony' | 'Canon' | 'Nikon' | 'Fujifilm' | 'Panasonic' | 'DJI' | 'GoPro' | 'Insta360' | 'Zhiyun' | 'Moza' | 'FeiyuTech' | 'Hohem';
export type CamType = 'Mirrorless' | 'DSLR' | 'Cinema' | 'Compact' | 'Action' | '360' | 'Pocket gimbal';
export const ACTION_TYPES: CamType[] = ['Action', '360', 'Pocket gimbal'];

export type SensorSize =
  | 'Medium Format'
  | 'Full Frame'
  | 'Super 35'
  | 'APS-C'
  | 'Micro Four Thirds'
  | '4/3'
  | '1-inch'
  | '1/1.3-inch'
  | '1/1.5-inch'
  | '1/1.7-inch'
  | '1/2-inch'
  | '1/2.3-inch'
  | '1/1.28-inch'
  | '1/1.9-inch'
  | '1/1.1-inch'
  | '1.4-inch'
  | '1/2.8-inch'
  | '1/4-inch';

/**
 * One recording mode. `fps` lists every frame rate offered in this mode
 * (24 = 23.98/24p, 30 = 29.97p, 60 = 59.94p, 120 = 119.88p).
 * `crop` is relative to the camera's own sensor width (1 = full width).
 */
export interface VideoMode {
  label: string;
  dims: string; // "3840x2160"
  fps: number[];
  crop?: number;
  bit?: number;
  chroma?: string;
  raw?: boolean;
  ext?: boolean; // only via external recorder (HDMI/SDI)
  camera?: string; // drones: which camera records this
  note?: string;
}

export type CameraLook = 'mirrorless' | 'pro' | 'retro' | 'rangefinder' | 'compact' | 'cinema' | 'medium' | 'dslr' | 'dslr-pro' | 'cinema-box' | 'bridge' | 'action' | 'pocket' | '360';
export type DroneLook = 'mavic' | 'air' | 'mini' | 'fpv' | 'flip' | 'inspire' | 'phantom';

export interface Viewfinder {
  kind: 'EVF' | 'OVF' | 'Hybrid';
  dots?: number; // millions (EVF / hybrid)
  mag?: number;
  coverage?: number; // % (OVF)
}

export interface Camera {
  kind: 'camera';
  id: string;
  brand: Brand;
  model: string;
  short: string;
  year: number;
  price: number;
  mount: string;
  type: CamType;
  segment: string;
  look: CameraLook;
  verify?: boolean;
  sensor: { size: SensorSize; mp: number; type: string; cropFactor: number; isoMin: number; isoMax: number; isoExt?: string };
  photo: { mechFps: number | null; eFps: number; preCapture: boolean; mechShutter: boolean; maxShutter: string; pixelShift?: number; rawBits: number };
  af: { system: string; points: number; score: number; video: number; subjects: string[] };
  ibis: { stops: number } | null;
  stab?: 'gimbal' | 'eis';
  waterproof?: number; // metres without housing
  battery?: number; // minutes of recording
  video: {
    log: string[];
    codecs: string[];
    maxBit: number;
    chroma: string;
    intRaw: string | null;
    extRaw: string | null;
    openGate: boolean;
    recLimit: string;
    unlimited: boolean;
    modes: VideoMode[];
  };
  body: {
    vf: Viewfinder | null;
    screen: string;
    weight: number;
    sealed: boolean;
    slots: string[];
    battery: string;
    ports: string[];
  };
  highlights: string[];
}

export interface DroneCamera {
  name: string;
  sensor: SensorSize;
  mp: number;
  focal: string;
  aperture: string;
  maxVideo: string;
}

/** What kind of drone it is (used for the Drones page filter). */
export type DroneUse = 'Camera' | 'FPV' | 'Enterprise' | 'Agriculture' | 'Delivery';

export type Obstacle = 'omni-lidar' | 'omni' | 'forward' | 'downward';

export interface Drone {
  kind: 'drone';
  id: string;
  brand: 'DJI';
  model: string;
  short: string;
  year: number;
  price: number;
  segment: string;
  use: DroneUse;
  look: DroneLook;
  verify?: boolean;
  cameras: DroneCamera[];
  video: { log: string[]; codecs: string[]; maxBit: number; bitrate: number; hdr: string; vertical: boolean; modes: VideoMode[] };
  photo: { raw: boolean; formats: string; modes: string[] };
  flight: {
    time: number;
    rangeKm: number;
    transmission: string;
    maxSpeed: number;
    wind: number;
    obstacle: Obstacle;
    obstacleText: string;
    weight: number;
    storage: string;
    gimbal: string;
    sub250: boolean;
  };
  highlights: string[];
}

export interface Gimbal {
  kind: 'gimbal';
  id: string;
  brand: 'DJI' | 'Zhiyun' | 'Moza' | 'FeiyuTech' | 'Hohem' | 'Insta360';
  model: string;
  short: string;
  year: number;
  price: number;
  segment: string;
  cls: 'Phone' | 'Camera';
  verify?: boolean;
  payload: number; // kg
  weight: number; // g (gimbal incl. battery grip)
  battery: number; // hours
  axes: number;
  tracking: string;
  focus: string;
  screen: string;
  vertical: string;
  extras: string[];
  connectivity: string;
  highlights: string[];
}

export type Product = Camera | Drone | Gimbal;
export type Filmable = Camera | Drone;
