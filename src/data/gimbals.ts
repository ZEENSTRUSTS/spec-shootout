import type { Gimbal } from './types';

type G = Omit<Gimbal, 'kind' | 'short'> & { short?: string };
const g = (x: G): Gimbal => ({ kind: 'gimbal', short: x.short ?? x.model, ...x });

export const gimbals: Gimbal[] = [
  // ───────────── DJI camera gimbals ─────────────
  g({
    id: 'dji-ronin-s', brand: 'DJI', model: 'Ronin-S', year: 2018, price: 749, segment: 'Camera gimbal', cls: 'Camera',
    payload: 3.6, weight: 1840, battery: 12, axes: 3, tracking: 'None (phone app only)', focus: 'Electronic focus wheel (some cameras)',
    screen: 'No screen', vertical: 'Via accessory', extras: ['Sport Mode trigger', 'Panorama / time-lapse'], connectivity: 'Bluetooth',
    highlights: ['DJI’s first one-handed camera gimbal', 'Heavy by today’s standards'],
  }),
  g({
    id: 'dji-ronin-sc', brand: 'DJI', model: 'Ronin-SC', year: 2019, price: 439, segment: 'Compact camera gimbal', cls: 'Camera',
    payload: 2, weight: 1100, battery: 11, axes: 3, tracking: 'ActiveTrack 3.0 (phone mounted)', focus: 'Focus wheel (accessory)',
    screen: 'No screen', vertical: 'Via accessory', extras: ['Position-lock axes', 'Force Mobile'], connectivity: 'Bluetooth',
    highlights: ['Ronin-S made for mirrorless', 'ActiveTrack through your phone'],
  }),
  g({
    id: 'dji-rs-2', brand: 'DJI', model: 'RS 2', year: 2020, price: 849, segment: 'Pro camera gimbal', cls: 'Camera',
    payload: 4.5, weight: 1300, battery: 12, axes: 3, tracking: 'Ronin Image Transmitter + ActiveTrack 3.0', focus: 'Focus motor + front dial',
    screen: '1.4" touch', vertical: 'Via accessory', extras: ['Carbon-fibre arms', 'Titan stabilisation', 'SuperSmooth mode'], connectivity: 'Bluetooth, RSA/NATO ports',
    highlights: ['4.5 kg payload at 1.3 kg', 'First RS with a touchscreen'],
  }),
  g({
    id: 'dji-rsc-2', brand: 'DJI', model: 'RSC 2', year: 2020, price: 499, segment: 'Compact camera gimbal', cls: 'Camera',
    payload: 3, weight: 1216, battery: 14, axes: 3, tracking: 'Ronin Image Transmitter + ActiveTrack 3.0', focus: 'Front dial',
    screen: '1" OLED', vertical: 'Native vertical (no accessory)', extras: ['Foldable design', 'Titan stabilisation'], connectivity: 'Bluetooth',
    highlights: ['Folds to A4-paper size', 'Native vertical shooting'],
  }),
  g({
    id: 'dji-rs-3-mini', brand: 'DJI', model: 'RS 3 Mini', year: 2022, price: 369, segment: 'Compact camera gimbal', cls: 'Camera',
    payload: 2, weight: 795, battery: 10, axes: 3, tracking: 'ActiveTrack via phone', focus: 'Bluetooth shutter / zoom',
    screen: '1.4" touch', vertical: 'Native vertical (no accessory)', extras: ['Bluetooth shutter control', 'Detachable tripod'], connectivity: 'Bluetooth',
    highlights: ['Lightweight for mirrorless + small lenses', 'Native vertical shooting'],
  }),
  g({
    id: 'dji-rs-3', brand: 'DJI', model: 'RS 3', year: 2022, price: 549, segment: 'Camera gimbal', cls: 'Camera', verify: true,
    payload: 3, weight: 1300, battery: 12, axes: 3, tracking: 'Ronin Image Transmitter (accessory)', focus: 'Focus motor support',
    screen: '1.8" OLED touch', vertical: 'Vertical via quick-release plate', extras: ['First RS with automated axis locks', 'Bluetooth shutter control', 'Teflon-coated arms'], connectivity: 'Bluetooth',
    highlights: ['Automatic axis locks — fast setup', 'The mid-size RS between Mini and Pro'],
  }),
  g({
    id: 'dji-rs-3-pro', brand: 'DJI', model: 'RS 3 Pro', year: 2022, price: 869, segment: 'Pro camera gimbal', cls: 'Camera',
    payload: 4.5, weight: 1500, battery: 12, axes: 3, tracking: 'Ronin Image Transmitter + ActiveTrack Pro', focus: 'LiDAR focusing (with LiDAR Range Finder)',
    screen: '1.8" OLED touch', vertical: 'Native vertical', extras: ['Carbon-fibre arms', 'Automated axis locks', 'Teflon-coated arms'], connectivity: 'Bluetooth, RSA/NATO ports',
    highlights: ['LiDAR autofocus for manual lenses', 'Carbon-fibre arms'],
  }),
  g({
    id: 'dji-rs-4', brand: 'DJI', model: 'RS 4', year: 2024, price: 549, segment: 'Camera gimbal', cls: 'Camera',
    payload: 3, weight: 1500, battery: 12, axes: 3, tracking: 'RS Intelligent Tracking Module (accessory)', focus: 'Focus motor support',
    screen: '1.8" OLED touch', vertical: '2nd-gen native vertical', extras: ['Automated axis locks', 'Teflon-coated arms', 'Joystick mode switch'], connectivity: 'Bluetooth',
    highlights: ['Faster balancing, automatic axis locks', '2nd-gen native vertical'],
  }),
  g({
    id: 'dji-rs-4-pro', brand: 'DJI', model: 'RS 4 Pro', year: 2024, price: 869, segment: 'Pro camera gimbal', cls: 'Camera',
    payload: 4.5, weight: 1670, battery: 13, axes: 3, tracking: 'RS Intelligent Tracking Module / Ronin Image Transmitter', focus: 'LiDAR focusing (LiDAR Range Finder 2)',
    screen: '1.8" OLED touch', vertical: '2nd-gen native vertical', extras: ['Carbon-fibre arms', 'Car mount mode', 'Teflon-coated arms', 'BG70 grip: 29 h'], connectivity: 'Bluetooth, RSA/NATO ports',
    highlights: ['4.5 kg payload for cine lenses', 'Up to 29 h with the BG70 grip'],
  }),
  g({
    id: 'dji-rs-4-mini', brand: 'DJI', model: 'RS 4 Mini', year: 2025, price: 369, segment: 'Compact camera gimbal', cls: 'Camera', verify: true,
    payload: 2, weight: 890, battery: 13, axes: 3, tracking: 'RS Intelligent Tracking Module (bundled in combo)', focus: 'Bluetooth shutter / zoom',
    screen: '1.4" touch', vertical: 'Native vertical', extras: ['Automatic balancing', 'Detachable tripod'], connectivity: 'Bluetooth',
    highlights: ['Self-balancing compact gimbal', 'Subject tracking without a phone'],
  }),

  // ───────────── DJI phone gimbals ─────────────
  g({
    id: 'dji-rs-5', brand: 'DJI', model: 'RS 5', year: 2026, price: 549, segment: 'Camera gimbal', cls: 'Camera', verify: true,
    payload: 3, weight: 1450, battery: 14, axes: 3, tracking: 'RS Enhanced Intelligent Tracking Module', focus: 'Focus motor support',
    screen: '1.8" OLED touch', vertical: 'Native vertical', extras: ['Automated axis locks', 'Teflon-coated arms'], connectivity: 'Bluetooth',
    highlights: ['Newest mid-size RS', 'Improved built-in tracking module'],
  }),
  g({
    id: 'dji-osmo-mobile-2', brand: 'DJI', model: 'Osmo Mobile 2', year: 2018, price: 129, segment: 'Phone gimbal', cls: 'Phone',
    payload: 0.2, weight: 485, battery: 15, axes: 3, tracking: 'ActiveTrack (app)', focus: 'Zoom slider',
    screen: 'None', vertical: 'Portrait mode via clamp', extras: ['Charges your phone', 'Motion time-lapse'], connectivity: 'Bluetooth',
    highlights: ['15-hour battery', 'Does not fold'],
  }),
  g({
    id: 'dji-osmo-mobile-3', brand: 'DJI', model: 'Osmo Mobile 3', year: 2019, price: 119, segment: 'Phone gimbal', cls: 'Phone',
    payload: 0.23, weight: 405, battery: 15, axes: 3, tracking: 'ActiveTrack 3.0 (app)', focus: 'Zoom slider',
    screen: 'None', vertical: 'Rotate phone clamp', extras: ['First folding Osmo Mobile', 'Gesture control'], connectivity: 'Bluetooth',
    highlights: ['Folds in half', '15-hour battery'],
  }),
  g({
    id: 'dji-om-4', brand: 'DJI', model: 'OM 4', year: 2020, price: 149, segment: 'Phone gimbal', cls: 'Phone',
    payload: 0.29, weight: 390, battery: 15, axes: 3, tracking: 'ActiveTrack 3.0 (app)', focus: 'Zoom slider',
    screen: 'None', vertical: 'Rotate phone clamp', extras: ['Magnetic clamp', 'DynamicZoom', 'Gesture control'], connectivity: 'Bluetooth',
    highlights: ['Magnetic quick-attach clamp', '15-hour battery'],
  }),
  g({
    id: 'dji-om-5', brand: 'DJI', model: 'OM 5', year: 2021, price: 159, segment: 'Phone gimbal', cls: 'Phone',
    payload: 0.29, weight: 290, battery: 6.4, axes: 3, tracking: 'ActiveTrack 4.0 (app)', focus: 'Zoom slider',
    screen: 'None', vertical: 'Rotate phone clamp', extras: ['Built-in 215 mm extension rod', 'Magnetic clamp', 'ShotGuides'], connectivity: 'Bluetooth',
    highlights: ['First Osmo with a built-in extension rod', 'Much lighter than OM 4'],
  }),
  g({
    id: 'dji-osmo-mobile-se', brand: 'DJI', model: 'Osmo Mobile SE', year: 2022, price: 89, segment: 'Phone gimbal', cls: 'Phone',
    payload: 0.29, weight: 352, battery: 8, axes: 3, tracking: 'ActiveTrack 5.0 (app)', focus: 'Zoom via app',
    screen: 'None', vertical: 'Rotate phone clamp', extras: ['Magnetic clamp', 'Tripod included'], connectivity: 'Bluetooth',
    highlights: ['Budget Osmo Mobile', 'No extension rod'],
  }),
  g({
    id: 'dji-osmo-mobile-6', brand: 'DJI', model: 'Osmo Mobile 6', year: 2022, price: 159, segment: 'Phone gimbal', cls: 'Phone',
    payload: 0.29, weight: 309, battery: 6.4, axes: 3, tracking: 'ActiveTrack 6.0 (app)', focus: 'Side wheel: zoom / focus',
    screen: 'Status panel', vertical: 'Rotate phone clamp', extras: ['Built-in 215 mm extension rod', 'Magnetic clamp', 'ShotGuides'], connectivity: 'Bluetooth',
    highlights: ['Built-in extension rod', 'Quick-launch magnetic clamp'],
  }),
  g({
    id: 'dji-osmo-mobile-7', brand: 'DJI', model: 'Osmo Mobile 7', year: 2024, price: 89, segment: 'Phone gimbal', cls: 'Phone',
    payload: 0.3, weight: 300, battery: 10, axes: 3, tracking: 'ActiveTrack 7.0 (app)', focus: 'Zoom via app',
    screen: 'None', vertical: 'Rotate phone clamp', extras: ['Built-in tripod', 'Magnetic clamp'], connectivity: 'Bluetooth',
    highlights: ['Cheapest DJI phone gimbal', '10 h battery'],
  }),
  g({
    id: 'dji-osmo-mobile-7p', brand: 'DJI', model: 'Osmo Mobile 7P', year: 2024, price: 149, segment: 'Phone gimbal', cls: 'Phone',
    payload: 0.3, weight: 368, battery: 10, axes: 3, tracking: 'Multifunctional tracker module (works with any camera app)', focus: 'Side wheel',
    screen: 'Status panel', vertical: 'Rotate phone clamp', extras: ['Built-in extension rod + tripod', 'Fill light on tracker', 'DJI Mic receiver support'], connectivity: 'Bluetooth',
    highlights: ['Tracking module works with the native camera app', 'Fill light + mic receiver'],
  }),

  // ───────────── Zhiyun ─────────────
  g({
    id: 'zhiyun-smooth-4', brand: 'Zhiyun', model: 'Smooth 4', year: 2018, price: 99, segment: 'Phone gimbal', cls: 'Phone',
    payload: 0.21, weight: 520, battery: 12, axes: 3, tracking: 'App tracking', focus: 'Focus / zoom handwheel',
    screen: 'None', vertical: 'Rotate phone clamp', extras: ['PhoneGo mode', 'Full control panel'], connectivity: 'Bluetooth',
    highlights: ['Handwheel for focus pulls', 'Heavy and not foldable'],
  }),
  g({
    id: 'zhiyun-weebill-s', brand: 'Zhiyun', model: 'Weebill S', year: 2019, price: 439, segment: 'Camera gimbal', cls: 'Camera',
    payload: 3, weight: 926, battery: 14, axes: 3, tracking: 'Via app', focus: 'TransMount servo follow focus (accessory)',
    screen: 'OLED status', vertical: 'Via accessory', extras: ['Sling-grip mode', 'Image transmission (accessory)'], connectivity: 'Bluetooth',
    highlights: ['Compact sling-style design', 'Strong motors for its size'],
  }),
  g({
    id: 'zhiyun-crane-3-lab', brand: 'Zhiyun', model: 'Crane 3 Lab', year: 2019, price: 1199, segment: 'Pro camera gimbal', cls: 'Camera', verify: true,
    payload: 4.5, weight: 2290, battery: 18, axes: 3, tracking: 'Via ViaTouch app', focus: 'Built-in focus wheel + TransMount servo',
    screen: 'OLED status', vertical: 'Quick vertical mode', extras: ['Built-in wireless image transmission', 'Quick-release plates'], connectivity: 'Bluetooth, Wi-Fi image transmission',
    highlights: ['Built-in wireless video to your phone', 'Big and heavy'],
  }),
  g({
    id: 'zhiyun-weebill-lab', brand: 'Zhiyun', model: 'Weebill Lab', year: 2019, price: 529, segment: 'Camera gimbal', cls: 'Camera', verify: true,
    payload: 3, weight: 1050, battery: 14, axes: 3, tracking: 'Via ViaTouch app', focus: 'TransMount servo (accessory)',
    screen: 'OLED status', vertical: 'Via accessory', extras: ['Wireless image transmission', 'Sling-grip mode'], connectivity: 'Bluetooth, Wi-Fi image transmission',
    highlights: ['Compact sling-style design', 'Wireless image transmission'],
  }),
  g({
    id: 'zhiyun-crane-m2', brand: 'Zhiyun', model: 'Crane M2', year: 2019, price: 249, segment: 'Compact camera gimbal', cls: 'Camera',
    payload: 0.72, weight: 500, battery: 7, axes: 3, tracking: 'Via app', focus: 'Shutter / zoom control',
    screen: 'OLED status', vertical: 'Quick vertical switch', extras: ['Works with phones, action cams and compacts'], connectivity: 'Bluetooth, Wi-Fi',
    highlights: ['One gimbal for phone, GoPro and compact', 'Very light payload'],
  }),
  g({
    id: 'zhiyun-crane-2s', brand: 'Zhiyun', model: 'Crane 2S', year: 2020, price: 599, segment: 'Pro camera gimbal', cls: 'Camera',
    payload: 3.2, weight: 1460, battery: 12, axes: 3, tracking: 'Via app', focus: 'Built-in focus wheel',
    screen: 'OLED status', vertical: 'Via accessory', extras: ['Axis locks', 'Fill light (accessory)'], connectivity: 'Bluetooth',
    highlights: ['Classic upright gimbal with focus wheel', 'Heavier than newer rivals'],
  }),
  g({
    id: 'zhiyun-smooth-5', brand: 'Zhiyun', model: 'Smooth 5', year: 2021, price: 169, segment: 'Phone gimbal', cls: 'Phone',
    payload: 0.3, weight: 450, battery: 10, axes: 3, tracking: 'App tracking', focus: 'Focus / zoom wheel',
    screen: 'None', vertical: 'Rotate phone clamp', extras: ['Magnetic fill light (combo)', 'Pro-style control panel'], connectivity: 'Bluetooth',
    highlights: ['Most physical controls on a phone gimbal', 'Bulky'],
  }),
  g({
    id: 'zhiyun-smooth-q3', brand: 'Zhiyun', model: 'Smooth Q3', year: 2021, price: 69, segment: 'Phone gimbal', cls: 'Phone',
    payload: 0.28, weight: 340, battery: 7, axes: 3, tracking: 'App tracking', focus: 'Zoom via app',
    screen: 'None', vertical: 'Rotate phone clamp', extras: ['Built-in fill light'], connectivity: 'Bluetooth',
    highlights: ['Built-in fill light at a low price', 'Foldable'],
  }),
  g({
    id: 'zhiyun-weebill-2', brand: 'Zhiyun', model: 'Weebill 2', year: 2021, price: 599, segment: 'Camera gimbal', cls: 'Camera',
    payload: 3.2, weight: 1180, battery: 9, axes: 3, tracking: 'Via screen (subject select)', focus: 'TransMount servo (accessory)',
    screen: '2.88" flip-out touch', vertical: 'Quick vertical mode', extras: ['Flip-out touchscreen', 'Sling-grip mode'], connectivity: 'Bluetooth',
    highlights: ['Big flip-out touchscreen', 'Shorter battery life'],
  }),
  g({
    id: 'zhiyun-crane-m2s', brand: 'Zhiyun', model: 'Crane M2S', year: 2022, price: 269, segment: 'Compact camera gimbal', cls: 'Camera',
    payload: 0.9, weight: 529, battery: 10, axes: 3, tracking: 'Via app', focus: 'Shutter / zoom control',
    screen: 'OLED status', vertical: 'Quick vertical switch', extras: ['Built-in fill light', 'USB-C camera control'], connectivity: 'Bluetooth',
    highlights: ['Tiny gimbal with fill light', 'Fits only light mirrorless kits'],
  }),
  g({
    id: 'zhiyun-crane-m3', brand: 'Zhiyun', model: 'Crane M3', year: 2022, price: 369, segment: 'Compact camera gimbal', cls: 'Camera',
    payload: 1.2, weight: 700, battery: 8, axes: 3, tracking: 'Via app', focus: 'Shutter / zoom control',
    screen: '1.22" touch', vertical: 'Quick vertical switch', extras: ['Built-in fill light', 'Quick-release plate'], connectivity: 'Bluetooth, Wi-Fi',
    highlights: ['Touchscreen + fill light in a small body', 'Low payload'],
  }),
  g({
    id: 'zhiyun-weebill-3', brand: 'Zhiyun', model: 'Weebill 3', year: 2022, price: 499, segment: 'Camera gimbal', cls: 'Camera',
    payload: 3, weight: 1330, battery: 21, axes: 3, tracking: 'Via app', focus: 'Follow-focus wheel (accessory)',
    screen: 'OLED status', vertical: 'Quick vertical mode', extras: ['Built-in fill light', 'Built-in microphone', 'Wrist rest + sling grip'], connectivity: 'Bluetooth',
    highlights: ['21-hour battery', 'Fill light + mic built in'],
  }),
  g({
    id: 'zhiyun-smooth-5s-ai', brand: 'Zhiyun', model: 'Smooth 5S AI', year: 2025, price: 169, segment: 'Phone gimbal', cls: 'Phone', verify: true,
    payload: 0.3, weight: 375, battery: 20, axes: 3, tracking: 'AI tracker module (works with native camera app)', focus: 'Focus / zoom wheel',
    screen: 'None', vertical: 'Rotate phone clamp', extras: ['Magnetic AI tracker', 'Built-in fill light', 'Pro-style control panel'], connectivity: 'Bluetooth',
    highlights: ['AI tracking without the app', 'Fill light + pro controls'],
  }),
  g({
    id: 'dji-osmo-mobile-8', brand: 'DJI', model: 'Osmo Mobile 8', year: 2025, price: 149, segment: 'Phone gimbal', cls: 'Phone', verify: true,
    payload: 0.3, weight: 370, battery: 10, axes: 3, tracking: 'ActiveTrack 7.0 + multifunctional tracker module', focus: 'Side wheel',
    screen: 'Status panel', vertical: 'Rotate phone clamp', extras: ['360° infinite pan', 'Built-in extension rod + tripod', 'Charges your phone'], connectivity: 'Bluetooth',
    highlights: ['360° pan tracking', '10-hour battery'],
  }),
  g({
    id: 'dji-osmo-mobile-8p', brand: 'DJI', model: 'Osmo Mobile 8P', year: 2026, price: 179, segment: 'Phone gimbal', cls: 'Phone', verify: true,
    payload: 0.3, weight: 370, battery: 10, axes: 3, tracking: 'Multifunctional tracker module (works with native camera app)', focus: 'Side wheel',
    screen: 'Detachable touchscreen remote', vertical: 'Rotate phone clamp', extras: ['Detachable remote with screen', 'Built-in extension rod + tripod'], connectivity: 'Bluetooth',
    highlights: ['Detachable touchscreen remote', 'Tracking without the app'],
  }),
  g({
    id: 'zhiyun-crane-3s', brand: 'Zhiyun', model: 'Crane 3S', year: 2020, price: 739, segment: 'Pro camera gimbal', cls: 'Camera',
    payload: 6.5, weight: 2900, battery: 12, axes: 3, tracking: 'None built in', focus: 'TransMount servo follow focus',
    screen: 'OLED status', vertical: 'Via accessory', extras: ['Extendable roll axis', 'Modular SmartSling handle'], connectivity: 'Bluetooth, Wi-Fi image transmission (accessory)',
    highlights: ['6.5 kg payload for cinema rigs', 'Heavy and big'],
  }),
  g({
    id: 'zhiyun-crane-m3s', brand: 'Zhiyun', model: 'Crane M3S', year: 2023, price: 369, segment: 'Compact camera gimbal', cls: 'Camera', verify: true,
    payload: 1.8, weight: 710, battery: 10, axes: 3, tracking: 'Via app', focus: 'Shutter / zoom control',
    screen: '1.22" touch', vertical: 'Quick vertical switch', extras: ['Built-in fill light', 'Quick-release plate'], connectivity: 'Bluetooth',
    highlights: ['Fill light built in', 'For mirrorless, compacts and phones'],
  }),
  g({
    id: 'zhiyun-weebill-3s', brand: 'Zhiyun', model: 'Weebill 3S', year: 2023, price: 399, segment: 'Camera gimbal', cls: 'Camera',
    payload: 3, weight: 1250, battery: 21, axes: 3, tracking: 'Via app', focus: 'Follow-focus wheel (accessory)',
    screen: 'OLED status', vertical: 'Quick vertical mode', extras: ['Built-in 1 W fill light', 'Wrist rest + sling grip', 'Built-in microphone'], connectivity: 'Bluetooth',
    highlights: ['21-hour battery', 'Sling-grip ergonomics'],
  }),
  g({
    id: 'zhiyun-crane-4', brand: 'Zhiyun', model: 'Crane 4', year: 2024, price: 599, segment: 'Pro camera gimbal', cls: 'Camera', verify: true,
    payload: 6, weight: 1700, battery: 11, axes: 3, tracking: 'Via app / tracker', focus: 'Built-in follow-focus wheel',
    screen: '1.3" touch', vertical: 'Quick vertical mode', extras: ['Built-in fill light', 'Sling handle', 'Auto-locking axes'], connectivity: 'Bluetooth',
    highlights: ['Big payload for cine setups', 'Follow-focus wheel built in'],
  }),
  g({
    id: 'zhiyun-smooth-q4', brand: 'Zhiyun', model: 'Smooth Q4', year: 2022, price: 89, segment: 'Phone gimbal', cls: 'Phone',
    payload: 0.28, weight: 266, battery: 6, axes: 3, tracking: 'App tracking', focus: 'Zoom slider',
    screen: 'None', vertical: 'Rotate phone clamp', extras: ['Built-in extension rod'], connectivity: 'Bluetooth',
    highlights: ['Pocketable budget phone gimbal', 'Extension rod built in'],
  }),
  g({
    id: 'zhiyun-smooth-5s', brand: 'Zhiyun', model: 'Smooth 5S', year: 2023, price: 149, segment: 'Phone gimbal', cls: 'Phone',
    payload: 0.3, weight: 358, battery: 20, axes: 3, tracking: 'App tracking', focus: 'Focus / zoom wheel',
    screen: 'None', vertical: 'Rotate phone clamp', extras: ['Built-in fill light', 'Pro-style control panel'], connectivity: 'Bluetooth',
    highlights: ['Fill light + pro controls', '20-hour battery'],
  }),

  // ───────────── Moza ─────────────
  g({
    id: 'zhiyun-weebill-5', brand: 'Zhiyun', model: 'Weebill 5', year: 2025, price: 449, segment: 'Camera gimbal', cls: 'Camera', verify: true,
    payload: 3, weight: 1300, battery: 20, axes: 3, tracking: 'Via app / tracker module', focus: 'Follow-focus wheel',
    screen: 'Touchscreen', vertical: 'Quick vertical mode', extras: ['Built-in fill light', 'Sling grip'], connectivity: 'Bluetooth',
    highlights: ['Newest Weebill sling-style gimbal', 'Long battery'],
  }),
  g({
    id: 'zhiyun-smooth-q5-ultra', brand: 'Zhiyun', model: 'Smooth-Q5 Ultra', year: 2025, price: 129, segment: 'Phone gimbal', cls: 'Phone', verify: true,
    payload: 0.3, weight: 300, battery: 10, axes: 3, tracking: 'AI tracking module', focus: 'Zoom via app',
    screen: 'None', vertical: 'Rotate phone clamp', extras: ['Built-in fill light', 'Extension rod'], connectivity: 'Bluetooth',
    highlights: ['Compact AI-tracking phone gimbal'],
  }),
  g({
    id: 'moza-air-2', brand: 'Moza', model: 'Air 2', year: 2019, price: 549, segment: 'Pro camera gimbal', cls: 'Camera',
    payload: 4.2, weight: 1650, battery: 16, axes: 3, tracking: 'Via app', focus: 'Built-in focus wheel + follow-focus motor (accessory)',
    screen: 'OLED status', vertical: 'Via accessory', extras: ['Hot-swappable 18650 batteries', 'Sling mode'], connectivity: 'Bluetooth',
    highlights: ['4.2 kg payload for the price', 'Swappable batteries'],
  }),
  g({
    id: 'moza-aircross-3', brand: 'Moza', model: 'AirCross 3', year: 2022, price: 339, segment: 'Camera gimbal', cls: 'Camera', verify: true,
    payload: 3.2, weight: 1020, battery: 12, axes: 3, tracking: 'Via app', focus: 'Focus wheel',
    screen: 'OLED status', vertical: 'Quick vertical mode', extras: ['Foldable design', 'Axis locks'], connectivity: 'Bluetooth',
    highlights: ['Light, foldable mid-size gimbal', 'Good value'],
  }),
  g({
    id: 'moza-mini-s', brand: 'Moza', model: 'Mini-S Essential', short: 'Mini-S', year: 2020, price: 69, segment: 'Phone gimbal', cls: 'Phone', verify: true,
    payload: 0.28, weight: 397, battery: 10, axes: 3, tracking: 'App tracking', focus: 'Zoom via app',
    screen: 'None', vertical: 'Rotate phone clamp', extras: ['Foldable', 'Gesture control'], connectivity: 'Bluetooth',
    highlights: ['Cheap folding phone gimbal'],
  }),

  // ───────────── FeiyuTech ─────────────
  g({
    id: 'feiyutech-ak2000s', brand: 'FeiyuTech', model: 'AK2000S', year: 2020, price: 299, segment: 'Camera gimbal', cls: 'Camera',
    payload: 2.2, weight: 1250, battery: 12, axes: 3, tracking: 'Via app', focus: 'Built-in focus wheel',
    screen: 'Touchscreen', vertical: 'Via accessory', extras: ['Quick-release plate', 'Sling mode'], connectivity: 'Bluetooth, Wi-Fi',
    highlights: ['Budget camera gimbal with touchscreen', 'Slower to balance'],
  }),
  g({
    id: 'feiyutech-scorp-pro', brand: 'FeiyuTech', model: 'SCORP Pro', year: 2022, price: 469, segment: 'Camera gimbal', cls: 'Camera', verify: true,
    payload: 2.5, weight: 1130, battery: 13, axes: 3, tracking: 'Built-in AI tracking (camera hot-shoe module)', focus: 'Focus wheel',
    screen: '1.3" touch', vertical: 'Quick vertical mode', extras: ['Sling-style dual grip', 'Wrist rest'], connectivity: 'Bluetooth',
    highlights: ['Built-in AI tracking, no phone', 'Sling grip for low shots'],
  }),
  g({
    id: 'feiyutech-vimble-3', brand: 'FeiyuTech', model: 'Vimble 3', year: 2021, price: 89, segment: 'Phone gimbal', cls: 'Phone', verify: true,
    payload: 0.28, weight: 320, battery: 8, axes: 3, tracking: 'App tracking', focus: 'Zoom via app',
    screen: 'None', vertical: 'Rotate phone clamp', extras: ['Built-in extension rod', 'Magnetic clamp'], connectivity: 'Bluetooth',
    highlights: ['Extension rod + tripod', 'Budget pick'],
  }),

  // ───────────── Hohem ─────────────
  g({
    id: 'hohem-isteady-x2', brand: 'Hohem', model: 'iSteady X2', year: 2021, price: 79, segment: 'Phone gimbal', cls: 'Phone', verify: true,
    payload: 0.28, weight: 259, battery: 10, axes: 3, tracking: 'App tracking', focus: 'Zoom via app',
    screen: 'None', vertical: 'Rotate phone clamp', extras: ['Folds small', 'Removable remote'], connectivity: 'Bluetooth',
    highlights: ['Tiny folding phone gimbal', 'Cheap first gimbal'],
  }),
  g({
    id: 'hohem-isteady-v2s', brand: 'Hohem', model: 'iSteady V2S', year: 2023, price: 129, segment: 'Phone gimbal', cls: 'Phone', verify: true,
    payload: 0.3, weight: 286, battery: 8, axes: 3, tracking: 'AI vision sensor (works with any camera app)', focus: 'Zoom via app',
    screen: 'None', vertical: 'Rotate phone clamp', extras: ['Fill light on the sensor', 'Built-in extension rod + tripod'], connectivity: 'Bluetooth',
    highlights: ['AI tracking without an app', 'Fill light built in'],
  }),
  g({
    id: 'hohem-isteady-mt2', brand: 'Hohem', model: 'iSteady MT2', year: 2022, price: 199, segment: 'Compact camera gimbal', cls: 'Camera', verify: true,
    payload: 1.2, weight: 620, battery: 10, axes: 3, tracking: 'AI vision sensor (no app)', focus: 'Shutter / zoom control',
    screen: 'None', vertical: 'Quick vertical switch', extras: ['Built-in fill light', 'Works with phones and small cameras'], connectivity: 'Bluetooth',
    highlights: ['Gesture + AI tracking built in', 'Light payload'],
  }),
  g({
    id: 'hohem-isteady-m6', brand: 'Hohem', model: 'iSteady M6', year: 2023, price: 169, segment: 'Phone gimbal', cls: 'Phone', verify: true,
    payload: 0.4, weight: 380, battery: 8, axes: 3, tracking: 'Magnetic AI tracker with screen (works with any camera app)', focus: 'Zoom via app',
    screen: 'Tracker preview screen', vertical: 'Rotate phone clamp', extras: ['Magnetic fill light', 'Strong motors for big phones'], connectivity: 'Bluetooth',
    highlights: ['AI tracker with its own screen', 'Holds heavy phones with lenses'],
  }),
  g({
    id: 'hohem-isteady-v3', brand: 'Hohem', model: 'iSteady V3', year: 2024, price: 99, segment: 'Phone gimbal', cls: 'Phone', verify: true,
    payload: 0.3, weight: 335, battery: 8, axes: 3, tracking: 'AI tracker module (works with any camera app)', focus: 'Zoom via app',
    screen: 'None', vertical: 'Rotate phone clamp', extras: ['Fill light on tracker', 'Built-in extension rod + tripod'], connectivity: 'Bluetooth',
    highlights: ['AI tracking at a budget price'],
  }),

  // ───────────── Insta360 ─────────────
  g({
    id: 'hohem-isteady-m7', brand: 'Hohem', model: 'iSteady M7', year: 2025, price: 189, segment: 'Phone gimbal', cls: 'Phone', verify: true,
    payload: 0.5, weight: 400, battery: 8, axes: 3, tracking: 'Magnetic AI tracker with screen', focus: 'Zoom via app',
    screen: 'Tracker preview screen', vertical: 'Rotate phone clamp', extras: ['Strong motors for big phones + lens kits', 'Magnetic fill light'], connectivity: 'Bluetooth',
    highlights: ['Carries the heaviest phones', 'AI tracker with its own screen'],
  }),
  g({
    id: 'hohem-isteady-v3-ultra', brand: 'Hohem', model: 'iSteady V3 Ultra', year: 2025, price: 129, segment: 'Phone gimbal', cls: 'Phone', verify: true,
    payload: 0.3, weight: 340, battery: 8, axes: 3, tracking: 'AI tracker module (works with any camera app)', focus: 'Zoom via app',
    screen: 'Tracker preview screen', vertical: 'Rotate phone clamp', extras: ['Fill light', 'Built-in extension rod + tripod'], connectivity: 'Bluetooth',
    highlights: ['V3 with an upgraded tracker'],
  }),
  g({
    id: 'hohem-isteady-mt3-pro', brand: 'Hohem', model: 'iSteady MT3 Pro', year: 2025, price: 279, segment: 'Compact camera gimbal', cls: 'Camera', verify: true,
    payload: 1.8, weight: 800, battery: 10, axes: 3, tracking: 'AI vision tracker (no app)', focus: 'Shutter / zoom control',
    screen: 'Touchscreen', vertical: 'Quick vertical switch', extras: ['Built-in fill light', 'Works with phones and mirrorless'], connectivity: 'Bluetooth',
    highlights: ['AI tracking for small cameras', 'Budget alternative to RS Mini'],
  }),
  g({
    id: 'insta360-flow', brand: 'Insta360', model: 'Flow', year: 2023, price: 159, segment: 'Phone gimbal', cls: 'Phone',
    payload: 0.3, weight: 369, battery: 12, axes: 3, tracking: 'Deep Track (app)', focus: 'Zoom wheel',
    screen: 'None', vertical: 'Rotate phone clamp', extras: ['Built-in selfie stick + tripod', 'Power-bank charging'], connectivity: 'Bluetooth',
    highlights: ['Selfie stick and tripod built in', 'Charges your phone'],
  }),
  g({
    id: 'insta360-flow-pro', brand: 'Insta360', model: 'Flow Pro', year: 2024, price: 169, segment: 'Phone gimbal', cls: 'Phone',
    payload: 0.3, weight: 369, battery: 12, axes: 3, tracking: 'Apple DockKit (any camera app) + 360° pan tracking', focus: 'Zoom wheel',
    screen: 'None', vertical: 'Rotate phone clamp', extras: ['360° infinite pan', 'Built-in selfie stick + tripod'], connectivity: 'Bluetooth',
    highlights: ['Tracks in the native iPhone camera app', 'Infinite 360° pan'],
  }),
  g({
    id: 'insta360-flow-2-pro', brand: 'Insta360', model: 'Flow 2 Pro', year: 2025, price: 169, segment: 'Phone gimbal', cls: 'Phone', verify: true,
    payload: 0.3, weight: 351, battery: 10, axes: 3, tracking: 'Apple DockKit + AI tracking (works with Android apps too)', focus: 'Zoom wheel',
    screen: 'None', vertical: 'Rotate phone clamp', extras: ['360° infinite pan', 'Magnetic quick-release clamp', 'Built-in selfie stick + tripod'], connectivity: 'Bluetooth',
    highlights: ['Native-camera tracking on iPhone and Android', 'Magnetic clamp'],
  }),
];
