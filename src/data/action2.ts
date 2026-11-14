/** Action, pocket-gimbal and 360 cameras that fill the gaps in each lineup (2018 → 2026). */
import { cam, R } from './build';

const UHD = '3840x2160';
const FHD = '1920x1080';
const K27 = '2720x1530';
const SD = ['microSD'];
const TRACK = ['Face / subject tracking'];
const NONE = ['—'];
const P = ['USB-C', 'Wi-Fi', 'Bluetooth'];

export const action2 = [
  // ───────────── DJI Osmo Pocket ─────────────
  cam({
    id: 'dji-osmo-pocket-4', brand: 'DJI', model: 'Osmo Pocket 4', short: 'Pocket 4', year: 2026, price: 499, mount: 'Fixed 20mm eq. f/2.0', type: 'Pocket gimbal', seg: 'Pocket gimbal camera', verify: true,
    s: ['1-inch', 9.4, 'CMOS (14-stop DR)'], iso: [50, 12800], fps: [null, 0], noMech: true, sh: '1/8000 (e)',
    af: ['PDAF + ActiveTrack 7.0', 1, 80, TRACK], stab: 'gimbal', batt: 240,
    v: { log: ['D-Log M', 'HLG'], codecs: ['H.264', 'H.265'], bit: 10, unl: true, rec: 'Until battery / storage', m: [`4K UHD|${UHD}|${R.all60},100,120,240|1||240 fps slow motion`, `3K vertical|1728x3072|${R.all60}|1||Native vertical`, `2.7K|${K27}|${R.all60},100,120`, `Full HD|${FHD}|${R.fhd240}`] },
    scr: '2.0" rotating OLED touch', g: 179, slots: ['107GB internal', 'microSD'], bat: 'Built-in', ports: ['USB-C', 'DJI Mic 2 / 3 / Mini direct pairing', 'Wi-Fi', 'Bluetooth'],
    hl: ['4K240 on a 1-inch gimbal camera', '107GB built-in storage'],
  }),
  cam({
    id: 'dji-osmo-pocket-4p', brand: 'DJI', model: 'Osmo Pocket 4P', short: 'Pocket 4P', year: 2026, price: 619, mount: 'Dual: 20mm eq. f/2.0 + 3× telephoto', type: 'Pocket gimbal', seg: 'Pocket gimbal camera', verify: true,
    s: ['1-inch', 9.4, 'CMOS (main) + tele camera'], iso: [50, 12800], fps: [null, 0], noMech: true, sh: '1/8000 (e)',
    af: ['PDAF + ActiveTrack (12× zoom)', 1, 82, TRACK], stab: 'gimbal', batt: 210,
    v: { log: ['D-Log 2', 'D-Log M', 'HLG'], codecs: ['H.264', 'H.265'], bit: 10, unl: true, rec: 'Until battery / storage', m: [`4K UHD|${UHD}|${R.all60},100,120,240|1||Main camera`, `4K UHD (3× tele)|${UHD}|${R.all60}|3||Telephoto camera`, `3K vertical|1728x3072|${R.all60}|1||Native vertical`, `Full HD|${FHD}|${R.fhd240}`] },
    scr: '2.0" 1000-nit rotating touch', g: 230, slots: ['~100GB internal', 'microSD'], bat: 'Built-in', ports: ['USB-C', 'DJI Mic direct pairing', 'Wi-Fi', 'Bluetooth'],
    hl: ['First dual-camera pocket gimbal', '17-stop claimed dynamic range'],
  }),

  // ───────────── DJI Osmo Action / Nano ─────────────
  cam({
    id: 'dji-osmo-action', brand: 'DJI', model: 'Osmo Action', short: 'Action', year: 2019, price: 349, mount: 'Fixed 145° FOV f/2.8', type: 'Action', seg: 'Action camera',
    s: ['1/2.3-inch', 12, 'CMOS'], iso: [100, 3200], fps: [null, 0], noMech: true, sh: '1/8000 (e)',
    af: ['Fixed focus', 0, 30, NONE], stab: 'eis', wp: 11, batt: 135,
    v: { codecs: ['H.264', 'H.265'], unl: true, rec: 'Until battery/card', m: [`4K UHD|${UHD}|${R.all60}`, `2.7K|${K27}|${R.all60}`, `Full HD|${FHD}|${R.fhd240}`] },
    scr: '2.25" rear touch + 1.4" front', g: 134, slots: SD, bat: '1300 mAh', ports: P,
    hl: ['DJI’s first action camera — front screen', 'RockSteady EIS'],
  }),
  cam({
    id: 'dji-osmo-action-2', brand: 'DJI', model: 'Action 2', short: 'Action 2', year: 2021, price: 399, mount: 'Fixed 155° FOV f/2.8', type: 'Action', seg: 'Modular action camera',
    s: ['1/1.7-inch', 12, 'CMOS'], iso: [100, 6400], fps: [null, 0], noMech: true, sh: '1/8000 (e)',
    af: ['Fixed focus', 0, 32, NONE], stab: 'eis', wp: 10, batt: 70,
    v: { codecs: ['H.264', 'H.265'], unl: false, rec: 'Heat-limited', m: [`4K UHD|${UHD}|${R.all60},100,120`, `2.7K|${K27}|${R.all60},100,120`, `Full HD|${FHD}|${R.fhd240}`] },
    scr: '1.76" touch', g: 56, slots: ['32GB internal', 'microSD (with module)'], bat: '580 mAh (+ modules)', ports: ['USB-C', 'Magnetic mount', 'Wi-Fi', 'Bluetooth'],
    hl: ['Tiny magnetic cube camera', 'Overheats in 4K'],
  }),
  cam({
    id: 'dji-osmo-action-3', brand: 'DJI', model: 'Osmo Action 3', short: 'Action 3', year: 2022, price: 329, mount: 'Fixed 155° FOV f/2.8', type: 'Action', seg: 'Action camera',
    s: ['1/1.7-inch', 12, 'CMOS'], iso: [100, 12800], fps: [null, 0], noMech: true, sh: '1/8000 (e)',
    af: ['Fixed focus', 0, 34, NONE], stab: 'eis', wp: 16, batt: 160,
    v: { log: ['D-Cinelike'], codecs: ['H.264', 'H.265'], bit: 10, unl: true, rec: 'Until battery/card', m: [`4K (4:3)|3840x2880|${R.all60}`, `4K UHD|${UHD}|${R.all60},100,120`, `2.7K|${K27}|${R.all60},100,120`, `Full HD|${FHD}|${R.fhd240}`] },
    scr: '2.25" rear touch + 1.4" front touch', g: 145, slots: SD, bat: 'Extreme 1770 mAh', ports: ['USB-C', 'Magnetic quick-release', 'Wi-Fi', 'Bluetooth'],
    hl: ['Great cold-weather battery', 'Magnetic quick-release mount'],
  }),
  cam({
    id: 'dji-osmo-action-6', brand: 'DJI', model: 'Osmo Action 6', short: 'Action 6', year: 2025, price: 389, mount: 'Fixed 155° FOV, f/2.0–4.0 variable aperture', type: 'Action', seg: 'Action camera', verify: true,
    s: ['1/1.1-inch', 38, 'Square CMOS'], iso: [100, 25600], fps: [null, 0], noMech: true, sh: '1/8000 (e)',
    af: ['Fixed focus + subject tracking', 0, 46, TRACK], stab: 'eis', wp: 20, batt: 240,
    v: { log: ['D-Log M'], codecs: ['H.264', 'H.265'], bit: 10, unl: true, rec: 'Until battery/card', m: [`4K (1:1 / 4:3)|3840x3840|${R.all60}|1||Reframe square later`, `4K UHD|${UHD}|${R.all60},100,120`, `2.7K|${K27}|${R.all60},100,120,240`, `Full HD|${FHD}|${R.fhd240}`] },
    scr: '2.5" rear touch + 1.46" front touch', g: 149, slots: ['Internal', 'microSD'], bat: 'Extreme 1950 mAh', ports: ['USB-C', 'Magnetic quick-release', 'DJI Mic pairing', 'Wi-Fi', 'Bluetooth'],
    hl: ['First action cam with a variable aperture', 'Square sensor for vertical + horizontal'],
  }),
  cam({
    id: 'dji-osmo-nano', brand: 'DJI', model: 'Osmo Nano', short: 'Nano', year: 2025, price: 389, mount: 'Fixed 143° FOV f/2.8', type: 'Action', seg: 'Wearable mini camera', verify: true,
    s: ['1/1.3-inch', 35, 'CMOS'], iso: [100, 12800], fps: [null, 0], noMech: true, sh: '1/8000 (e)',
    af: ['Fixed focus', 0, 38, NONE], stab: 'eis', wp: 10, batt: 90,
    v: { log: ['D-Log M'], codecs: ['H.264', 'H.265'], bit: 10, unl: true, rec: 'Until battery', m: [`4K UHD|${UHD}|${R.all60},100,120`, `2.7K|${K27}|${R.all60},100,120`, `Full HD|${FHD}|${R.fhd240}`] },
    scr: 'OLED touch on the Vision Dock', g: 52, slots: ['64GB / 128GB internal'], bat: 'Built-in (+ Vision Dock)', ports: ['USB-C', 'Magnetic mount', 'DJI Mic 3 pairing', 'Wi-Fi', 'Bluetooth'],
    hl: ['52 g magnetic POV camera — great for BTS', 'Clips onto clothing hands-free'],
  }),

  // ───────────── GoPro ─────────────
  cam({
    id: 'gopro-hero7', brand: 'GoPro', model: 'HERO7 Black', short: 'HERO7', year: 2018, price: 399, mount: 'Fixed wide FOV f/2.8', type: 'Action', seg: 'Action camera',
    s: ['1/2.3-inch', 12, 'CMOS'], iso: [100, 6400], fps: [null, 0], noMech: true, sh: '1/8000 (e)',
    af: ['Fixed focus', 0, 30, NONE], stab: 'eis', wp: 10, batt: 90,
    v: { codecs: ['H.264', 'H.265'], unl: true, rec: 'Until battery/card', m: [`4K UHD|${UHD}|${R.all60}`, `2.7K|${K27}|${R.all60},100,120`, `Full HD|${FHD}|${R.fhd240}`] },
    scr: '2.0" rear touch', g: 116, slots: SD, bat: '1220 mAh', ports: ['USB-C', 'Micro HDMI', 'Wi-Fi', 'Bluetooth', 'GPS'],
    hl: ['HyperSmooth: gimbal-like stabilisation', 'Cheap used BTS camera'],
  }),
  cam({
    id: 'gopro-hero8', brand: 'GoPro', model: 'HERO8 Black', short: 'HERO8', year: 2019, price: 399, mount: 'Fixed wide FOV f/2.8', type: 'Action', seg: 'Action camera',
    s: ['1/2.3-inch', 12, 'CMOS'], iso: [100, 6400], fps: [null, 0], noMech: true, sh: '1/8000 (e)',
    af: ['Fixed focus', 0, 30, NONE], stab: 'eis', wp: 10, batt: 90,
    v: { codecs: ['H.264', 'H.265'], unl: true, rec: 'Until battery/card', m: [`4K UHD|${UHD}|${R.all60}`, `2.7K|${K27}|${R.all60},100,120`, `Full HD|${FHD}|${R.fhd240}`] },
    scr: '2.0" rear touch', g: 126, slots: SD, bat: '1220 mAh', ports: ['USB-C', 'Media Mod (mic/HDMI)', 'Wi-Fi', 'Bluetooth', 'GPS'],
    hl: ['Built-in mounting fingers', 'Media Mod adds a mic and shoe'],
  }),
  cam({
    id: 'gopro-hero9', brand: 'GoPro', model: 'HERO9 Black', short: 'HERO9', year: 2020, price: 449, mount: 'Fixed wide FOV f/2.5', type: 'Action', seg: 'Action camera',
    s: ['1/2.3-inch', 23.6, 'CMOS'], iso: [100, 6400], fps: [null, 0], noMech: true, sh: '1/8000 (e)',
    af: ['Fixed focus', 0, 32, NONE], stab: 'eis', wp: 10, batt: 100,
    v: { codecs: ['H.264', 'H.265'], unl: true, rec: 'Until battery/card', m: [`5K|5120x2880|${R.cine}`, `4K UHD|${UHD}|${R.all60}`, `2.7K|${K27}|${R.all60},100,120`, `Full HD|${FHD}|${R.fhd240}`] },
    scr: '2.27" rear touch + 1.4" front colour', g: 158, slots: SD, bat: '1720 mAh', ports: ['USB-C', 'Max Lens Mod', 'Wi-Fi', 'Bluetooth', 'GPS'],
    hl: ['First GoPro with a front colour screen', '5K video'],
  }),
  cam({
    id: 'gopro-hero10', brand: 'GoPro', model: 'HERO10 Black', short: 'HERO10', year: 2021, price: 499, mount: 'Fixed wide FOV f/2.5', type: 'Action', seg: 'Action camera',
    s: ['1/2.3-inch', 23, 'CMOS (GP2)'], iso: [100, 6400], fps: [null, 0], noMech: true, sh: '1/8000 (e)',
    af: ['Fixed focus', 0, 32, NONE], stab: 'eis', wp: 10, batt: 100,
    v: { codecs: ['H.264', 'H.265'], unl: true, rec: 'Until battery/card', m: [`5.3K|5312x2988|${R.all60}`, `4K UHD|${UHD}|${R.all60},100,120`, `2.7K|${K27}|${R.all60},100,120,200,240`, `Full HD|${FHD}|${R.fhd240}`] },
    scr: '2.27" rear touch + 1.4" front colour', g: 153, slots: SD, bat: '1720 mAh', ports: ['USB-C', 'Media Mod', 'Wi-Fi', 'Bluetooth', 'GPS'],
    hl: ['GP2 chip: 5.3K60 and 4K120', 'Runs hot'],
  }),
  cam({
    id: 'gopro-hero11', brand: 'GoPro', model: 'HERO11 Black', short: 'HERO11', year: 2022, price: 499, mount: 'Fixed wide FOV f/2.5', type: 'Action', seg: 'Action camera',
    s: ['1/1.9-inch', 27, 'CMOS (8:7)'], iso: [100, 6400], fps: [null, 0], noMech: true, sh: '1/8000 (e)',
    af: ['Fixed focus', 0, 36, NONE], stab: 'eis', wp: 10, batt: 120,
    v: { log: ['GP-Log (Labs)'], codecs: ['H.264', 'H.265'], bit: 10, unl: true, rec: 'Until battery/card', m: [`5.3K|5312x2988|${R.all60}`, `5.3K (8:7)|5312x4648|${R.cine}`, `4K UHD|${UHD}|${R.all60},100,120`, `2.7K|${K27}|${R.all60},100,120,200,240`, `Full HD|${FHD}|${R.fhd240}`] },
    scr: '2.27" rear touch + 1.4" front colour', g: 154, slots: SD, bat: 'Enduro 1720 mAh', ports: ['USB-C', 'Media Mod', 'Wi-Fi', 'Bluetooth', 'GPS'],
    hl: ['8:7 sensor: crop vertical or horizontal later', '10-bit colour'],
  }),
  cam({
    id: 'gopro-hero-2024', brand: 'GoPro', model: 'HERO (2024)', short: 'HERO', year: 2024, price: 199, mount: 'Fixed wide FOV', type: 'Action', seg: 'Budget action camera',
    s: ['1/2.3-inch', 12, 'CMOS'], iso: [100, 3200], fps: [null, 0], noMech: true, sh: '1/8000 (e)',
    af: ['Fixed focus', 0, 26, NONE], stab: 'eis', wp: 5, batt: 100,
    v: { codecs: ['H.264'], unl: true, rec: 'Until battery/card', m: [`4K UHD|${UHD}|${R.cine}`, `2.7K|${K27}|${R.all60}`, `Full HD|${FHD}|${R.all60}`] },
    scr: '1.76" rear touch', g: 86, slots: SD, bat: 'Built-in 1255 mAh', ports: ['USB-C', 'Wi-Fi', 'Bluetooth'],
    hl: ['Smallest, cheapest GoPro', 'No front screen, no HyperSmooth slow-mo'],
  }),
  cam({
    id: 'gopro-max', brand: 'GoPro', model: 'MAX', short: 'MAX', year: 2019, price: 499, mount: 'Dual fisheye lenses', type: '360', seg: '360 camera',
    s: ['1/2.3-inch', 16.6, 'CMOS (×2)'], iso: [100, 3200], fps: [null, 0], noMech: true, sh: '1/8000 (e)',
    af: ['Fixed focus', 0, 30, NONE], stab: 'eis', wp: 5, batt: 75,
    v: { codecs: ['H.264', 'H.265'], unl: true, rec: 'Until battery/card', m: [`5.6K 360°|5376x2688|${R.cine}`, `3K 360°|3072x1536|${R.all60}`, `1440p HERO mode|1920x1440|${R.all60}`] },
    scr: '1.7" touch', g: 154, slots: SD, bat: '1600 mAh', ports: ['USB-C', 'Wi-Fi', 'Bluetooth', 'GPS'],
    hl: ['360 + single-lens HERO mode', 'Six microphones'],
  }),
  cam({
    id: 'gopro-max-2', brand: 'GoPro', model: 'MAX2', short: 'MAX2', year: 2025, price: 499, mount: 'Dual fisheye lenses (replaceable)', type: '360', seg: '360 camera', verify: true,
    s: ['1/2-inch', 29, 'CMOS (×2)'], iso: [100, 6400], fps: [null, 0], noMech: true, sh: '1/8000 (e)',
    af: ['Fixed focus', 0, 40, NONE], stab: 'eis', wp: 5, batt: 100,
    v: { log: ['GP-Log2'], codecs: ['H.265'], bit: 10, unl: true, rec: 'Until battery/card', m: [`8K 360°|7680x3840|${R.cine}|1||True 8K`, `5.6K 360°|5632x2816|${R.all60}`, `4K single-lens|${UHD}|${R.all60}`] },
    scr: 'Rear touch', g: 195, slots: SD, bat: 'Enduro', ports: ['USB-C', 'Wi-Fi', 'Bluetooth', 'GPS'],
    hl: ['“True” 8K 360 video', 'Six mics, replaceable lenses'],
  }),

  // ───────────── Insta360 ─────────────
  cam({
    id: 'insta360-one-x', brand: 'Insta360', model: 'ONE X', short: 'ONE X', year: 2018, price: 399, mount: 'Dual fisheye lenses', type: '360', seg: '360 camera',
    s: ['1/2.3-inch', 18, 'CMOS (×2)'], iso: [100, 3200], fps: [null, 0], noMech: true, sh: '1/8000 (e)',
    af: ['Fixed focus', 0, 28, NONE], stab: 'eis', batt: 60,
    v: { codecs: ['H.264'], unl: true, rec: 'Until battery/card', m: [`5.7K 360°|5760x2880|${R.cine}`, `4K 360°|3840x1920|50`, `3K 360°|3008x1504|100`] },
    scr: 'Status display', g: 115, slots: SD, bat: '1200 mAh', ports: ['Micro USB', 'Wi-Fi', 'Bluetooth'],
    hl: ['FlowState stabilisation', 'Not waterproof without a case'],
  }),
  cam({
    id: 'insta360-one-x2', brand: 'Insta360', model: 'ONE X2', short: 'ONE X2', year: 2020, price: 429, mount: 'Dual fisheye lenses', type: '360', seg: '360 camera',
    s: ['1/2.3-inch', 18, 'CMOS (×2)'], iso: [100, 3200], fps: [null, 0], noMech: true, sh: '1/8000 (e)',
    af: ['Fixed focus', 0, 32, NONE], stab: 'eis', wp: 10, batt: 80,
    v: { codecs: ['H.264', 'H.265'], unl: true, rec: 'Until battery/card', m: [`5.7K 360°|5760x2880|${R.cine}`, `4K 360°|3840x1920|50`, `3K 360°|3040x1520|100`, `Steady Cam 1440p|2560x1440|${R.cine}`] },
    scr: '1.33" round touch', g: 149, slots: SD, bat: '1630 mAh', ports: ['USB-C', 'Wi-Fi', 'Bluetooth'],
    hl: ['Waterproof 360 with a touchscreen', 'Invisible selfie stick'],
  }),
  cam({
    id: 'insta360-one-rs-1inch', brand: 'Insta360', model: 'ONE RS 1-Inch 360 Edition', short: 'ONE RS 1"', year: 2022, price: 799, mount: 'Dual Leica fisheye lenses', type: '360', seg: 'Premium 360 camera',
    s: ['1-inch', 21, 'CMOS (×2)'], iso: [100, 6400], fps: [null, 0], noMech: true, sh: '1/8000 (e)',
    af: ['Fixed focus', 0, 40, NONE], stab: 'eis', wp: 3, batt: 65,
    v: { log: ['Log'], codecs: ['H.264', 'H.265'], unl: true, rec: 'Until battery/card', m: [`6K 360°|6144x3072|${R.cine}`, `4K 360°|3840x1920|${R.all60}`] },
    scr: 'Touch screen', g: 239, slots: SD, bat: '1350 mAh', ports: ['USB-C', 'Wi-Fi', 'Bluetooth'],
    hl: ['Two 1-inch sensors: best 360 low light of its time', 'Co-engineered with Leica'],
  }),
  cam({
    id: 'insta360-ace-pro', brand: 'Insta360', model: 'Ace Pro', short: 'Ace Pro', year: 2023, price: 449, mount: 'Fixed Leica 151° FOV f/2.6', type: 'Action', seg: 'Action camera',
    s: ['1/1.3-inch', 48, 'CMOS'], iso: [100, 6400], fps: [null, 0], noMech: true, sh: '1/8000 (e)',
    af: ['Fixed focus + gesture control', 0, 40, NONE], stab: 'eis', wp: 10, batt: 100,
    v: { log: ['I-Log'], codecs: ['H.264', 'H.265'], bit: 10, unl: true, rec: 'Until battery/card', m: [`8K|7680x4320|${R.cine}`, `4K UHD|${UHD}|${R.all60},100,120`, `2.7K|${K27}|${R.all60},100,120`, `Full HD|${FHD}|${R.fhd240}`] },
    scr: '2.4" flip-up touch', g: 179, slots: SD, bat: '1650 mAh', ports: ['USB-C', 'Magnetic mount', 'Wi-Fi', 'Bluetooth'],
    hl: ['Flip-up screen for selfies', 'Great low-light for an action cam'],
  }),
  cam({
    id: 'insta360-go-3', brand: 'Insta360', model: 'GO 3', short: 'GO 3', year: 2023, price: 379, mount: 'Fixed wide FOV f/2.2', type: 'Action', seg: 'Thumb-size camera',
    s: ['1/2.3-inch', 9, 'CMOS'], iso: [100, 3200], fps: [null, 0], noMech: true, sh: '1/8000 (e)',
    af: ['Fixed focus', 0, 26, NONE], stab: 'eis', wp: 5, batt: 45,
    v: { codecs: ['H.264', 'H.265'], unl: false, rec: 'Short clips (heat)', m: [`2.7K|${K27}|${R.cine}`, `Full HD|${FHD}|${R.all60}`] },
    scr: 'Flip screen on Action Pod', g: 35, slots: ['32–128GB internal'], bat: 'Built-in + Action Pod', ports: ['USB-C', 'Magnetic pendant', 'Wi-Fi', 'Bluetooth'],
    hl: ['35 g magnetic thumb camera — great for BTS', 'No 4K'],
  }),
  cam({
    id: 'insta360-go-ultra', brand: 'Insta360', model: 'GO Ultra', short: 'GO Ultra', year: 2025, price: 449, mount: 'Fixed wide FOV', type: 'Action', seg: 'Thumb-size camera', verify: true,
    s: ['1/1.28-inch', 50, 'CMOS'], iso: [100, 6400], fps: [null, 0], noMech: true, sh: '1/8000 (e)',
    af: ['Fixed focus', 0, 34, NONE], stab: 'eis', wp: 10, batt: 70,
    v: { log: ['I-Log'], codecs: ['H.264', 'H.265'], bit: 10, unl: true, rec: 'Until battery', m: [`4K UHD|${UHD}|${R.all60}`, `2.7K|${K27}|${R.all60},100,120`, `Full HD|${FHD}|${R.fhd240}`] },
    scr: 'Flip screen on Action Pod', g: 53, slots: ['microSD'], bat: 'Built-in + Action Pod', ports: ['USB-C', 'Magnetic pendant', 'Wi-Fi', 'Bluetooth'],
    hl: ['4K60 in a 53 g magnetic camera', 'Much bigger sensor than GO 3'],
  }),
  cam({
    id: 'insta360-x4-air', brand: 'Insta360', model: 'X4 Air', short: 'X4 Air', year: 2025, price: 399, mount: 'Dual fisheye lenses (replaceable)', type: '360', seg: '360 camera', verify: true,
    s: ['1/2-inch', 72, 'CMOS (×2)'], iso: [100, 6400], fps: [null, 0], noMech: true, sh: '1/8000 (e)',
    af: ['Fixed focus', 0, 40, NONE], stab: 'eis', wp: 15, batt: 88,
    v: { log: ['I-Log'], codecs: ['H.264', 'H.265'], bit: 10, unl: true, rec: 'Until battery/card', m: [`8K 360°|7680x3840|${R.cine}`, `5.7K 360°|5760x2880|${R.all60}`, `4K single-lens|${UHD}|${R.all60}`] },
    scr: '2.5" touch', g: 165, slots: SD, bat: 'Removable', ports: ['USB-C', 'Wi-Fi', 'Bluetooth'],
    hl: ['Lighter, cheaper 8K 360', 'Replaceable lenses'],
  }),
  cam({
    id: 'insta360-x6', brand: 'Insta360', model: 'X6', short: 'X6', year: 2026, price: 669, mount: 'Dual fisheye lenses (replaceable)', type: '360', seg: '360 camera', verify: true,
    s: ['1/1.1-inch', 72, 'Square CMOS (×2)'], iso: [100, 6400], fps: [null, 0], noMech: true, sh: '1/8000 (e)',
    af: ['Fixed focus + AI subject tracking', 0, 48, TRACK], stab: 'eis', wp: 20, batt: 180,
    v: { log: ['I-Log'], codecs: ['H.264', 'H.265'], bit: 10, unl: true, rec: 'Until battery/storage', m: [`8K 360°|7680x3840|${R.cine},50`, `5.7K 360°|5760x2880|${R.all60}`, `4K single-lens|${UHD}|${R.all60},100,120`] },
    scr: 'Touch screen', g: 200, slots: ['64GB internal', 'microSD'], bat: 'Removable', ports: ['USB-C', 'Mic Air / Mic Pro direct pairing', 'Wi-Fi', 'Bluetooth'],
    hl: ['1-inch-equivalent 360 image', '8K50, Dolby Atmos audio, on-camera AI edits'],
  }),

  // ───────────── 2025–26 GoPro additions ─────────────
  cam({
    id: 'gopro-mission-1-pro', brand: 'GoPro', model: 'Mission 1 Pro', short: 'Mission 1 Pro', year: 2026, price: 699, mount: 'Fixed wide lens', type: 'Action', seg: 'Cinematic action camera', verify: true,
    s: ['1-inch', 50, 'CMOS (4:3, GP3)'], iso: [100, 12800], fps: [null, 0], noMech: true, sh: '1/8000 (e)',
    af: ['Fixed focus', 0, 46, NONE], stab: 'eis', batt: 120,
    v: { log: ['GP-Log2'], codecs: ['H.265'], bit: 10, og: true, unl: true, rec: 'Until battery/card', m: [`8K|7680x4320|${R.all60}`, `8K Open Gate (4:3)|8192x6144|${R.cine}`, `4K UHD|${UHD}|${R.all60},100,120,200,240`, `Full HD|${FHD}|${R.fhd240},480,960|1||Up to 960 fps`] },
    scr: 'Rear touch + front screen', g: 207, slots: SD, bat: 'Enduro', ports: ['USB-C', 'Wi-Fi', 'Bluetooth', 'GPS'],
    hl: ['1-inch sensor, 8K60 and 4K240', 'GoPro’s filmmaking-grade action camera'],
  }),
  cam({
    id: 'gopro-mission-1', brand: 'GoPro', model: 'Mission 1', short: 'Mission 1', year: 2026, price: 599, mount: 'Fixed wide lens', type: 'Action', seg: 'Cinematic action camera', verify: true,
    s: ['1-inch', 50, 'CMOS (4:3, GP3)'], iso: [100, 12800], fps: [null, 0], noMech: true, sh: '1/8000 (e)',
    af: ['Fixed focus', 0, 44, NONE], stab: 'eis', batt: 120,
    v: { log: ['GP-Log2'], codecs: ['H.265'], bit: 10, og: true, unl: true, rec: 'Until battery/card', m: [`8K|7680x4320|${R.cine}`, `4K Open Gate (4:3)|4096x3072|${R.all60},100,120`, `4K UHD|${UHD}|${R.all60},100,120`, `Full HD|${FHD}|${R.fhd240}`] },
    scr: 'Rear touch + front screen', g: 207, slots: SD, bat: 'Enduro', ports: ['USB-C', 'Wi-Fi', 'Bluetooth', 'GPS'],
    hl: ['1-inch sensor for less', '8K30 (Pro does 8K60)'],
  }),
  cam({
    id: 'gopro-lit-hero', brand: 'GoPro', model: 'LIT HERO', short: 'LIT HERO', year: 2025, price: 269, mount: 'Fixed wide FOV f/2.3', type: 'Action', seg: 'Compact vlog action camera', verify: true,
    s: ['1/2.8-inch', 12, 'CMOS'], iso: [100, 3200], fps: [null, 0], noMech: true, sh: '1/8000 (e)',
    af: ['Fixed focus', 0, 24, NONE], stab: 'eis', wp: 5, batt: 100,
    v: { codecs: ['H.264', 'H.265'], unl: true, rec: 'Until battery/card', m: [`4K UHD|${UHD}|${R.all60}`, `2.7K|${K27}|${R.all60},100,120`, `Full HD|${FHD}|${R.fhd120}`] },
    scr: '1.76" rear', g: 93, slots: SD, bat: 'Enduro', ports: ['USB-C', 'Built-in light (3 levels)', 'Wi-Fi', 'Bluetooth'],
    hl: ['Built-in light for selfies and BTS', '93 g, AirPods-case size'],
  }),
];
