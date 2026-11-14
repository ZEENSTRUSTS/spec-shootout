import { cam, R } from './build';

const UHD = '3840x2160';
const FHD = '1920x1080';
const K27 = '2720x1530';
const SD = ['microSD'];
const TRACK = ['Face / subject tracking'];

export const action = [
  // ───────────── DJI Osmo Pocket (3-axis gimbal cameras) ─────────────
  cam({
    id: 'dji-osmo-pocket', brand: 'DJI', model: 'Osmo Pocket', short: 'Osmo Pocket', year: 2018, price: 349, mount: 'Fixed 26mm eq. f/2.0', type: 'Pocket gimbal', seg: 'Pocket gimbal camera',
    s: ['1/2.3-inch', 12, 'CMOS'], iso: [100, 3200], fps: [null, 0], noMech: true, sh: '1/8000 (e)',
    af: ['Contrast-detect + FaceTrack', 1, 40, TRACK], vaf: 45, stab: 'gimbal', batt: 140,
    v: { codecs: ['H.264', 'H.265'], unl: true, rec: 'Until battery/card', m: [`4K UHD|${UHD}|${R.all60}`, `2.7K|${K27}|${R.all60}`, `Full HD|${FHD}|${R.fhd120}`] },
    scr: '1.0" touch', g: 116, slots: SD, bat: 'Built-in 875 mAh', ports: ['USB-C / Lightning phone adapter', 'Wi-Fi via module'],
    hl: ['Started the pocket-gimbal category', 'Tiny screen, small sensor'],
  }),
  cam({
    id: 'dji-pocket-2', brand: 'DJI', model: 'Pocket 2', short: 'Pocket 2', year: 2020, price: 349, mount: 'Fixed 20mm eq. f/1.8', type: 'Pocket gimbal', seg: 'Pocket gimbal camera',
    s: ['1/1.7-inch', 64, 'CMOS'], iso: [100, 6400], fps: [null, 0], noMech: true, sh: '1/8000 (e)',
    af: ['Hybrid PDAF + CDAF', 1, 55, TRACK], vaf: 60, stab: 'gimbal', batt: 140,
    v: { codecs: ['H.264', 'H.265'], unl: true, rec: 'Until battery/card', m: [`4K UHD|${UHD}|${R.all60}`, `2.7K|${K27}|${R.all60}`, `Full HD|${FHD}|${R.fhd240}|1||Slow motion up to 8×`] },
    scr: '1.08" touch', g: 117, slots: SD, bat: 'Built-in 875 mAh', ports: ['USB-C', 'Mic (via handle)', 'Wi-Fi / Bluetooth (Do-It-All handle)'],
    hl: ['64MP + 8× slow motion', 'HDR video, 4 built-in mics'],
  }),
  cam({
    id: 'dji-osmo-pocket-3', brand: 'DJI', model: 'Osmo Pocket 3', short: 'Pocket 3', year: 2023, price: 519, mount: 'Fixed 20mm eq. f/2.0', type: 'Pocket gimbal', seg: 'Pocket gimbal camera',
    s: ['1-inch', 9.4, 'CMOS (37MP photo mode)'], iso: [50, 6400], fps: [null, 0], noMech: true, sh: '1/8000 (e)',
    af: ['PDAF + ActiveTrack 6.0', 1, 74, TRACK], stab: 'gimbal', batt: 166,
    v: { log: ['D-Log M', 'HLG'], codecs: ['H.264', 'H.265'], bit: 10, unl: true, rec: 'Until battery/card', m: [`4K UHD|${UHD}|${R.all60},100,120`, `3K vertical|1728x3072|${R.all60}|1||Native vertical`, `2.7K|${K27}|${R.all60},100,120`, `Full HD|${FHD}|${R.fhd240}`] },
    scr: '2.0" rotating OLED touch', g: 179, slots: SD, bat: 'Built-in 1300 mAh', ports: ['USB-C', 'DJI Mic 2 direct pairing', 'Wi-Fi', 'Bluetooth'],
    hl: ['1-inch sensor on a 3-axis gimbal', 'Vlogging favourite: rotate screen to go vertical'],
  }),

  // ───────────── DJI Osmo Action ─────────────
  cam({
    id: 'dji-osmo-action-4', brand: 'DJI', model: 'Osmo Action 4', short: 'Action 4', year: 2023, price: 399, mount: 'Fixed 155° FOV f/2.8', type: 'Action', seg: 'Action camera',
    s: ['1/1.3-inch', 10, 'CMOS'], iso: [100, 12800], fps: [null, 0], noMech: true, sh: '1/8000 (e)',
    af: ['Fixed focus', 0, 40, ['—']], stab: 'eis', wp: 18, batt: 160,
    v: { log: ['D-Log M', 'HLG'], codecs: ['H.264', 'H.265'], bit: 10, unl: true, rec: 'Until battery/card', m: [`4K (4:3)|3840x2880|${R.all60}`, `4K UHD|${UHD}|${R.all60},100,120`, `2.7K|${K27}|${R.all60},100,120`, `Full HD|${FHD}|${R.fhd240}`] },
    scr: '2.25" front + 1.4" front touch', g: 145, slots: SD, bat: 'Extreme Battery 1770 mAh', ports: ['USB-C', 'Magnetic quick-release', 'Wi-Fi', 'Bluetooth'],
    hl: ['Big 1/1.3" sensor for night shots', 'Waterproof to 18 m, works to −20 °C'],
  }),
  cam({
    id: 'dji-osmo-action-5-pro', brand: 'DJI', model: 'Osmo Action 5 Pro', short: 'Action 5 Pro', year: 2024, price: 349, mount: 'Fixed 155° FOV f/2.8', type: 'Action', seg: 'Action camera',
    s: ['1/1.3-inch', 40, 'CMOS'], iso: [100, 12800], fps: [null, 0], noMech: true, sh: '1/8000 (e)',
    af: ['Fixed focus + subject tracking', 0, 45, TRACK], stab: 'eis', wp: 20, batt: 240,
    v: { log: ['D-Log M', 'HLG'], codecs: ['H.264', 'H.265'], bit: 10, unl: true, rec: 'Until battery/card', m: [`4K (4:3)|3840x2880|${R.all60}`, `4K UHD|${UHD}|${R.all60},100,120`, `2.7K|${K27}|${R.all60},100,120`, `Full HD|${FHD}|${R.fhd240}`] },
    scr: '2.5" rear OLED + 1.46" front OLED touch', g: 146, slots: [...SD, '47GB internal'], bat: 'Extreme Battery Plus 1950 mAh', ports: ['USB-C', 'DJI Mic 2 direct pairing', 'Wi-Fi', 'Bluetooth'],
    hl: ['4-hour battery, 13.5 stops DR', 'Waterproof to 20 m'],
  }),
  cam({
    id: 'dji-osmo-360', brand: 'DJI', model: 'Osmo 360', short: 'Osmo 360', year: 2025, price: 549, mount: 'Dual fisheye lenses', type: '360', seg: '360 camera', verify: true,
    s: ['1-inch', 120, 'Square 1-inch 360° sensor (×2 lenses)'], iso: [100, 51200], fps: [null, 0], noMech: true, sh: '1/8000 (e)',
    af: ['Fixed focus', 0, 40, ['—']], stab: 'eis', wp: 10, batt: 100,
    v: { log: ['D-Log M'], codecs: ['H.264', 'H.265'], bit: 10, unl: true, rec: 'Until battery/card', m: [`8K 360°|7680x3840|${R.all60}|1||Stitched 360`, `6K 360°|5760x2880|${R.all60}`, `4K 360°|3840x1920|100,120`, `4K single-lens|${UHD}|${R.all60},100,120`] },
    scr: '2.0" touch', g: 183, slots: [...SD, '105GB internal'], bat: 'Built-in 1950 mAh', ports: ['USB-C', 'DJI Mic pairing', 'Wi-Fi', 'Bluetooth'],
    hl: ['DJI’s first 360 camera, 8K 360', 'Large 1-inch-class sensor'],
  }),

  // ───────────── Insta360 ─────────────
  cam({
    id: 'insta360-x3', brand: 'Insta360', model: 'X3', short: 'X3', year: 2022, price: 449, mount: 'Dual fisheye lenses', type: '360', seg: '360 camera',
    s: ['1/2-inch', 72, 'CMOS (×2)'], iso: [100, 3200], fps: [null, 0], noMech: true, sh: '1/8000 (e)',
    af: ['Fixed focus', 0, 40, ['—']], stab: 'eis', wp: 10, batt: 81,
    v: { log: ['I-Log'], codecs: ['H.264', 'H.265'], unl: true, rec: 'Until battery/card', m: [`5.7K 360°|5760x2880|${R.cine}|1||Invisible selfie stick`, `4K 360°|3840x1920|50,60`, `4K single-lens|${UHD}|${R.cine}`, `2.7K single-lens|${K27}|${R.all60}`, `Full HD single-lens|${FHD}|${R.all60}`] },
    scr: '2.29" touch', g: 180, slots: SD, bat: 'Removable 1800 mAh', ports: ['USB-C', 'Wi-Fi', 'Bluetooth'],
    hl: ['Shoot everything, reframe later', 'Invisible selfie stick effect'],
  }),
  cam({
    id: 'insta360-x4', brand: 'Insta360', model: 'X4', short: 'X4', year: 2024, price: 499, mount: 'Dual fisheye lenses', type: '360', seg: '360 camera',
    s: ['1/2-inch', 72, 'CMOS (×2)'], iso: [100, 3200], fps: [null, 0], noMech: true, sh: '1/8000 (e)',
    af: ['Fixed focus + gesture control', 0, 42, ['—']], stab: 'eis', wp: 10, batt: 135,
    v: { log: ['I-Log'], codecs: ['H.264', 'H.265'], bit: 10, unl: true, rec: 'Until battery/card', m: [`8K 360°|7680x3840|${R.cine}`, `5.7K 360°|5760x2880|${R.all60}`, `4K 360°|3840x1920|100`, `4K single-lens|${UHD}|${R.all60}`] },
    scr: '2.5" touch', g: 203, slots: SD, bat: 'Removable 2290 mAh', ports: ['USB-C', 'Wi-Fi', 'Bluetooth'],
    hl: ['8K 360 video', 'Replaceable lens guards'],
  }),
  cam({
    id: 'insta360-x5', brand: 'Insta360', model: 'X5', short: 'X5', year: 2025, price: 549, mount: 'Dual fisheye lenses (replaceable)', type: '360', seg: '360 camera', verify: true,
    s: ['1/1.28-inch', 72, 'CMOS (×2)'], iso: [100, 6400], fps: [null, 0], noMech: true, sh: '1/8000 (e)',
    af: ['Fixed focus + gesture control', 0, 44, ['—']], stab: 'eis', wp: 15, batt: 185,
    v: { log: ['I-Log'], codecs: ['H.264', 'H.265'], bit: 10, unl: true, rec: 'Until battery/card', m: [`8K 360°|7680x3840|${R.cine}`, `5.7K 360°|5760x2880|${R.all60}`, `4K 360°|3840x1920|100`, `4K single-lens|${UHD}|${R.all60}`] },
    scr: '2.5" touch', g: 200, slots: SD, bat: 'Removable 2400 mAh', ports: ['USB-C', 'Wi-Fi', 'Bluetooth'],
    hl: ['Bigger 1/1.28" sensors — much better at night', 'User-replaceable lenses'],
  }),
  cam({
    id: 'insta360-ace-pro-2', brand: 'Insta360', model: 'Ace Pro 2', short: 'Ace Pro 2', year: 2024, price: 399, mount: 'Fixed 157° FOV f/2.6 (Leica)', type: 'Action', seg: 'Action camera',
    s: ['1/1.3-inch', 50, 'CMOS (dual AI chip)'], iso: [100, 6400], fps: [null, 0], noMech: true, sh: '1/8000 (e)',
    af: ['Fixed focus', 0, 42, ['—']], stab: 'eis', wp: 12, batt: 180,
    v: { log: ['I-Log'], codecs: ['H.264', 'H.265'], bit: 10, unl: true, rec: 'Until battery/card', m: [`8K|7680x4320|${R.cine}`, `4K UHD|${UHD}|${R.all60},100,120`, `2.7K|${K27}|${R.all60},100,120`, `Full HD|${FHD}|${R.fhd240}`] },
    scr: '2.5" flip-up touch', g: 177, slots: SD, bat: 'Removable 1800 mAh', ports: ['USB-C', 'Wi-Fi', 'Bluetooth'],
    hl: ['8K action cam with a flip screen', 'Leica-tuned lens'],
  }),
  cam({
    id: 'insta360-go-3s', brand: 'Insta360', model: 'GO 3S', short: 'GO 3S', year: 2024, price: 399, mount: 'Fixed wide lens f/2.2', type: 'Action', seg: 'Thumb-size camera', verify: true,
    s: ['1/2.3-inch', 12, 'CMOS'], iso: [100, 3200], fps: [null, 0], noMech: true, sh: '1/8000 (e)',
    af: ['Fixed focus', 0, 38, ['—']], stab: 'eis', wp: 10, batt: 140,
    v: { codecs: ['H.264', 'H.265'], unl: true, rec: 'Until battery', m: [`4K UHD|${UHD}|${R.cine}`, `2.7K|${K27}|${R.all60}`, `Full HD|${FHD}|${R.all60},100,120`] },
    scr: '2.2" flip screen on Action Pod', g: 39, slots: ['64/128GB internal'], bat: 'Built-in + Action Pod', ports: ['USB-C', 'Magnetic mount', 'Wi-Fi', 'Bluetooth'],
    hl: ['39 g magnetic camera — clips anywhere', 'Action Pod adds screen + battery'],
  }),

  // ───────────── GoPro ─────────────
  cam({
    id: 'gopro-hero12', brand: 'GoPro', model: 'HERO12 Black', short: 'HERO12', year: 2023, price: 399, mount: 'Fixed 156° FOV f/2.5', type: 'Action', seg: 'Action camera',
    s: ['1/1.9-inch', 27, 'CMOS (8:7)'], iso: [100, 6400], fps: [null, 0], noMech: true, sh: '1/8000 (e)',
    af: ['Fixed focus', 0, 38, ['—']], stab: 'eis', wp: 10, batt: 150,
    v: { log: ['GP-Log'], codecs: ['H.264', 'H.265'], bit: 10, unl: true, rec: 'Until battery/card', m: [`5.3K|5312x2988|${R.all60}`, `4K (8:7)|3840x3360|${R.all60}|1||Full sensor, reframe to vertical`, `4K UHD|${UHD}|${R.all60},100,120`, `2.7K|${K27}|${R.all60},100,120,200,240`, `Full HD|${FHD}|${R.fhd240}`] },
    scr: '2.27" rear touch + 1.4" front', g: 154, slots: SD, bat: 'Enduro 1720 mAh', ports: ['USB-C', 'Mounting fingers + 1/4" thread', 'Wi-Fi', 'Bluetooth'],
    hl: ['8:7 full-sensor video for vertical + horizontal', 'HyperSmooth 6.0'],
  }),
  cam({
    id: 'gopro-hero13', brand: 'GoPro', model: 'HERO13 Black', short: 'HERO13', year: 2024, price: 399, mount: 'Fixed 156° FOV f/2.5 (HB-series lens mods)', type: 'Action', seg: 'Action camera',
    s: ['1/1.9-inch', 27, 'CMOS (8:7)'], iso: [100, 6400], fps: [null, 0], noMech: true, sh: '1/8000 (e)',
    af: ['Fixed focus', 0, 38, ['—']], stab: 'eis', wp: 10, batt: 170,
    v: { log: ['GP-Log2'], codecs: ['H.264', 'H.265'], bit: 10, unl: true, rec: 'Until battery/card', m: [`5.3K|5312x2988|${R.all60}`, `4K (8:7)|3840x3360|${R.all60}`, `4K UHD|${UHD}|${R.all60},100,120`, `2.7K|${K27}|${R.all60},100,120,200,240,360,400|1||Burst slow-mo up to 400 fps`, `Full HD|${FHD}|${R.fhd240}`] },
    scr: '2.27" rear touch + 1.4" front', g: 154, slots: SD, bat: 'Enduro 1900 mAh', ports: ['USB-C', 'Magnetic latch mount', 'Wi-Fi', 'Bluetooth', 'GPS'],
    hl: ['Swappable HB-series lenses (Macro, ND, Ultra Wide)', '400 fps burst slow-mo'],
  }),
];
