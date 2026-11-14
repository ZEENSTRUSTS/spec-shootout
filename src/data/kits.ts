/**
 * Gear paths: complete starter-to-world-class kits for photographers, videographers and drone pilots.
 * Products from the catalogue are referenced by id (they link to their spec pages and use catalogue prices);
 * everything else (lenses, tripods, lights, audio…) is a plain item with an approximate US street price.
 */

export type Track = 'photo' | 'video' | 'hybrid' | 'action' | 'drone';
export type TierKey = 'beginner' | 'upgrade' | 'intermediate' | 'semipro' | 'pro' | 'elite';

export interface KitItem {
  name: string;
  detail?: string;
  price: number;
}
/** `used` = typical used/second-hand price, for older bodies that are great value today. */
export type KitOption = { id: string; why?: string; used?: number } | KitItem;

export interface KitSlot {
  role: string;
  /** 'one' = choose one of the options; 'all' = get every item listed */
  pick: 'one' | 'all';
  optional?: boolean;
  note?: string;
  options: KitOption[];
}

export interface Kit {
  track: Track;
  tier: TierKey;
  who: string;
  goal: string;
  slots: KitSlot[];
  tips: string[];
}

export const TRACKS: { key: Track; label: string; icon: string; blurb: string }[] = [
  { key: 'photo', label: 'Photography', icon: '📷', blurb: 'Stills: portraits, travel, events, sport and studio.' },
  { key: 'video', label: 'Videography', icon: '🎬', blurb: 'From your first vlog to a full cinema package.' },
  { key: 'hybrid', label: 'Hybrid shooters', icon: '🔀', blurb: 'One kit for photos and video — weddings, content, events.' },
  { key: 'action', label: 'Action & BTS', icon: '🎒', blurb: 'GoPro-style cameras for behind-the-scenes, sport and travel.' },
  { key: 'drone', label: 'Drone pilots', icon: '🛸', blurb: 'Aerial photo and video, from 249 g to the Inspire.' },
];

export const TIERS: { key: TierKey; label: string; icon: string; tag: string; elite?: Partial<Record<Track, string>> }[] = [
  { key: 'beginner', label: 'First gear', icon: '🌱', tag: 'Start here — new or used' },
  { key: 'upgrade', label: 'First upgrade', icon: '🚀', tag: 'Outgrown the basics' },
  { key: 'intermediate', label: 'Intermediate', icon: '🎯', tag: 'Serious hobby, first paid jobs' },
  { key: 'semipro', label: 'Semi-professional', icon: '⭐', tag: 'Regular paid work' },
  { key: 'pro', label: 'Professional', icon: '🏆', tag: 'It’s your job' },
  { key: 'elite', label: 'World-class', icon: '👑', tag: 'The very top', elite: { video: 'Filmmaking / cinema', drone: 'Aerial cinema', action: 'BTS crew / extreme sport' } },
];

export const tierIcon = (t: TierKey) => TIERS.find((x) => x.key === t)!.icon;

export const tierLabel = (t: TierKey, track: Track) => {
  const x = TIERS.find((y) => y.key === t)!;
  return x.elite?.[track] ?? x.label;
};

export const kits: Kit[] = [
  // ════════════════════════ PHOTO ════════════════════════
  {
    track: 'photo', tier: 'beginner',
    who: 'You’re moving up from a phone and want proper photos: blurry backgrounds, sharp action and real zoom.',
    goal: 'An interchangeable-lens body, a zoom for everyday shots and a cheap fast prime for portraits.',
    slots: [
      { role: 'Camera', pick: 'one', options: [
        { id: 'canon-60d', why: 'Classic used DSLR — still takes great photos', used: 220 },
        { id: 'canon-600d', why: 'Cheap used Rebel with a flip screen', used: 150 },
        { id: 'canon-700d', why: 'Touchscreen Rebel, cheap used', used: 220 },
        { id: 'nikon-d3300', why: 'Sharp 24MP, tiny kit lens', used: 180 },
        { id: 'nikon-d5300', why: '24MP + flip screen + GPS', used: 230 },
        { id: 'sony-a6000', why: 'Small mirrorless, fast AF, cheap used', used: 280 },
        { id: 'fujifilm-xt200', why: 'Fuji colours, big flip screen', used: 350 },
        { id: 'canon-2000d', why: 'Cheapest new Canon DSLR' },
        { id: 'canon-r100', why: 'Cheapest new Canon mirrorless' },
        { id: 'canon-r50', why: 'Best new beginner AF' },
        { id: 'nikon-z50ii', why: 'Best grip and EVF here' },
      ] },
      { role: 'Lenses', pick: 'all', note: 'Different ranges: wide-to-normal zoom plus a portrait prime.', options: [
        { name: 'Kit zoom 18–45mm / 16–50mm', detail: 'Usually bundled with the body — landscapes, travel, everyday', price: 100 },
        { name: '50mm f/1.8 prime', detail: 'Canon RF 50mm f/1.8, Nikon Z DX 24mm f/1.7 or similar — portraits with blurry backgrounds, low light', price: 200 },
      ] },
      { role: 'Telephoto zoom', pick: 'one', optional: true, options: [
        { name: '55–210mm / 50–250mm budget telephoto', detail: 'Kids’ sport, animals, zoomed-in landscapes', price: 300 },
      ] },
      { role: 'Tripod', pick: 'one', options: [
        { name: 'Ulanzi / K&F Concept aluminium travel tripod', detail: 'Ball head, folds to ~40 cm', price: 70 },
        { name: 'Manfrotto Element Traveller Small', detail: 'Lighter, sturdier legs', price: 110 },
      ] },
      { role: 'Flash', pick: 'one', optional: true, options: [
        { name: 'Godox TT350', detail: 'Small hot-shoe flash; bounce it off the ceiling indoors', price: 85 },
        { name: 'Godox TT685 II', detail: 'More power, bigger head, AA batteries', price: 110 },
      ] },
      { role: 'Cards & power', pick: 'all', options: [
        { name: '2 × 64GB SD card (UHS-I, V30)', price: 30 },
        { name: 'Spare battery', price: 50 },
      ] },
      { role: 'Bag', pick: 'one', options: [
        { name: 'Small camera sling (Lowepro / Peak Design Everyday Sling 3L)', price: 60 },
      ] },
    ],
    tips: ['Spend on light and lenses before a pricier body.', 'Shoot RAW and edit in Lightroom or the free Darktable.', 'Learn aperture priority (A/Av) first — it covers 80% of shots.'],
  },
  {
    track: 'photo', tier: 'upgrade',
    who: 'You’ve outgrown the kit lens and want sharper, brighter results and faster autofocus.',
    goal: 'A faster APS-C body, a constant-aperture zoom, a real telephoto and off-camera flash.',
    slots: [
      { role: 'Camera', pick: 'one', options: [
        { id: 'canon-80d', why: '45-point AF, weather sealing — used bargain', used: 450 },
        { id: 'nikon-d7200', why: 'Dual slots, sealed, great sensor', used: 400 },
        { id: 'fujifilm-xt3', why: 'X-T line dials, superb used value', used: 600 },
        { id: 'panasonic-g85', why: 'IBIS + sealing on a budget', used: 350 },
        { id: 'canon-r10', why: 'Fast burst and tracking' },
        { id: 'sony-a6400', why: 'Huge lens choice, great eye AF' },
        { id: 'fujifilm-xt30ii', why: 'Dials + Fuji colour' },
        { id: 'nikon-z50ii', why: 'Modern AF, great handling' },
      ] },
      { role: 'Lenses', pick: 'all', note: 'Wide-to-portrait zoom, a fast prime and a telephoto.', options: [
        { name: 'Sigma 18–50mm f/2.8 DC DN', detail: 'Bright everyday zoom — replaces the kit lens', price: 550 },
        { name: '30–35mm f/1.4 prime (Sigma 30mm f/1.4 / Viltrox 33mm f/1.4)', detail: 'Low light and natural-perspective portraits', price: 300 },
        { name: '70–300mm / 55–210mm telephoto zoom', detail: 'Sport, wildlife, compressed landscapes', price: 450 },
      ] },
      { role: 'Tripod', pick: 'one', options: [
        { name: 'K&F Concept / Sirui carbon travel tripod', detail: 'Lighter, steadier for long exposures', price: 160 },
      ] },
      { role: 'Flash', pick: 'all', options: [
        { name: 'Godox V860 III (Li-ion)', detail: 'Fast recycling, works as an off-camera light', price: 180 },
        { name: 'Godox X3 trigger', detail: 'Fire the flash off-camera', price: 60 },
      ] },
      { role: 'Filters', pick: 'all', options: [
        { name: 'Circular polariser (CPL)', detail: 'Deeper skies, cuts reflections', price: 60 },
      ] },
      { role: 'Cards & power', pick: 'all', options: [
        { name: '2 × 128GB SD card (V60)', price: 70 },
        { name: '2 spare batteries', price: 90 },
      ] },
    ],
    tips: ['A constant f/2.8 zoom is the biggest image-quality jump at this level.', 'Get the flash off the camera — side light instantly looks more professional.'],
  },
  {
    track: 'photo', tier: 'intermediate',
    who: 'You shoot regularly — portraits, travel, maybe paid gigs for friends — and want full-frame quality.',
    goal: 'A full-frame body, a quality standard zoom, a portrait prime and a telephoto.',
    slots: [
      { role: 'Camera', pick: 'one', options: [
        { id: 'canon-6d', why: 'Full frame for the price of a kit lens', used: 450 },
        { id: 'nikon-d750', why: 'Legendary full-frame DSLR', used: 650 },
        { id: 'canon-6dii', why: 'Flip screen full frame', used: 700 },
        { id: 'sony-a7iii', why: 'The full-frame benchmark, now cheap used', used: 1000 },
        { id: 'nikon-z6ii', why: 'Dual slots, IBIS', used: 900 },
        { id: 'canon-rp', why: 'Cheapest full-frame RF', used: 600 },
        { id: 'canon-r8', why: 'R6 II sensor and AF in a small body' },
        { id: 'nikon-z5ii', why: 'IBIS, dual slots' },
        { id: 'sony-a7cii', why: 'Compact 33MP' },
      ] },
      { role: 'Lenses', pick: 'all', options: [
        { name: '28–75mm f/2.8 (Tamron) or 24–105mm f/4', detail: 'Workhorse zoom for events and travel', price: 900 },
        { name: '85mm f/1.8 prime', detail: 'Classic portrait lens', price: 550 },
        { name: '70–200mm f/4 or 70–300mm', detail: 'Sport, wildlife, outdoor portraits', price: 1000 },
      ] },
      { role: 'Tripod', pick: 'one', options: [
        { name: 'Peak Design Travel Tripod (aluminium)', detail: 'Packs tiny, sets up fast', price: 380 },
        { name: 'Leofoto / Sirui carbon tripod + ball head', price: 300 },
      ] },
      { role: 'Lighting', pick: 'all', options: [
        { name: 'Godox V1 round-head flash', detail: 'Soft, natural fall-off', price: 260 },
        { name: 'Godox XPro II trigger', price: 70 },
        { name: 'Light stand + 80 cm octa softbox', price: 90 },
      ] },
      { role: 'Filters', pick: 'all', options: [
        { name: 'CPL + 6-stop ND filter (magnetic or screw-in)', detail: 'Skies, water, long exposures', price: 160 },
      ] },
      { role: 'Cards, power & backup', pick: 'all', options: [
        { name: '2 × 128GB SD card (V90)', price: 140 },
        { name: '2 spare batteries', price: 140 },
        { name: '2TB portable SSD for backup', price: 150 },
      ] },
    ],
    tips: ['Back up every shoot to two places before formatting the cards.', 'One great prime beats two average zooms for portraits.'],
  },
  {
    track: 'photo', tier: 'semipro',
    who: 'You’re taking paid work — weddings, events, portraits or sport — and need reliability as well as quality.',
    goal: 'A fast full-frame body, the f/2.8 “holy trinity” zooms and portable strobes.',
    slots: [
      { role: 'Camera', pick: 'one', options: [
        { id: 'canon-5div', why: 'Wedding workhorse DSLR', used: 1200 },
        { id: 'nikon-d850', why: '45MP DSLR legend', used: 1500 },
        { id: 'canon-r6ii', why: 'Event and wedding all-rounder' },
        { id: 'canon-r6iii', why: 'Latest R6' },
        { id: 'sony-a7iv', why: '33MP hybrid' },
        { id: 'sony-a7v', why: 'Partially stacked, AI AF' },
        { id: 'nikon-z6iii', why: 'Superb EVF' },
        { id: 'fujifilm-xt5', why: '40MP APS-C' },
      ] },
      { role: 'Lenses', pick: 'all', note: 'Third-party f/2.8 zooms (Sigma/Tamron) cut the cost by about half.', options: [
        { name: '24–70mm f/2.8', detail: 'The event workhorse', price: 1200 },
        { name: '70–200mm f/2.8', detail: 'Ceremonies, sport, compressed portraits', price: 1500 },
        { name: '35mm or 50mm f/1.4 prime', detail: 'Low light, storytelling', price: 750 },
      ] },
      { role: 'Ultra-wide', pick: 'one', optional: true, options: [
        { name: '16–35mm f/4 or 14–24mm f/2.8', detail: 'Interiors, landscapes, big group shots', price: 1100 },
      ] },
      { role: 'Lighting', pick: 'all', options: [
        { name: 'Godox AD200 Pro II pocket strobe', detail: 'Overpowers the sun on location', price: 350 },
        { name: 'Godox V1 on-camera flash', price: 260 },
        { name: 'Godox XPro II trigger + stand + umbrella', price: 160 },
      ] },
      { role: 'Tripod', pick: 'one', options: [
        { name: 'Peak Design Travel Tripod (carbon)', price: 600 },
        { name: 'Leofoto LS-324C + ball head', price: 450 },
      ] },
      { role: 'Cards, power & backup', pick: 'all', options: [
        { name: 'Fast cards for both slots (V90 SD / CFexpress)', price: 300 },
        { name: '3 spare batteries', price: 210 },
        { name: '2 × 4TB drives (two-copy backup)', price: 260 },
      ] },
      { role: 'Bag', pick: 'one', options: [{ name: 'Rolling or backpack pro bag (Think Tank / Peak Design)', price: 300 }] },
    ],
    tips: ['Dual card slots and a backup body (even an older one) matter once clients are paying.', 'Get gear insurance and liability cover.'],
  },
  {
    track: 'photo', tier: 'pro',
    who: 'Photography is your job. You need resolution, speed and lenses that never hold you back.',
    goal: 'A flagship-class body, native pro glass, studio-grade lighting and a backup body.',
    slots: [
      { role: 'Camera', pick: 'one', options: [
        { id: 'canon-r5', why: '45MP + IBIS, great used', used: 2200 },
        { id: 'canon-1dxii', why: 'Pro sports DSLR', used: 1800 },
        { id: 'canon-r5ii', why: 'Stacked 45MP' },
        { id: 'nikon-z8', why: 'Z9 in a smaller body' },
        { id: 'sony-a7rv', why: '61MP studio/landscape' },
        { id: 'sony-a9ii', why: '20 fps sports body', used: 2000 },
        { id: 'fujifilm-gfx100sii', why: '102MP medium format' },
      ] },
      { role: 'Lenses', pick: 'all', options: [
        { name: 'Native 24–70mm f/2.8 (L / S / GM II)', price: 2300 },
        { name: 'Native 70–200mm f/2.8', price: 2700 },
        { name: '85mm f/1.2–1.4 portrait prime', price: 1800 },
        { name: '14–24mm or 16–35mm f/2.8', price: 2200 },
      ] },
      { role: 'Lighting', pick: 'one', options: [
        { name: '2 × Godox AD600 Pro II + modifiers', detail: 'Studio power that runs on batteries', price: 2000 },
        { name: 'Profoto B10X Plus duo kit', detail: 'Premium, compact, superb colour', price: 3800 },
      ] },
      { role: 'Support', pick: 'all', options: [
        { name: 'Gitzo / Really Right Stuff carbon tripod + head', price: 1400 },
      ] },
      { role: 'Backup body', pick: 'one', options: [
        { name: 'Second body (same system, previous generation)', detail: 'Never lose a job to a failed camera', price: 2000 },
      ] },
      { role: 'Workflow', pick: 'all', options: [
        { name: 'CFexpress cards ×3 + reader', price: 750 },
        { name: 'Calibrated monitor (BenQ SW / Eizo)', price: 1500 },
        { name: 'NAS or RAID backup', price: 900 },
      ] },
    ],
    tips: ['Rent specialist lenses (tilt-shift, super-tele) until you use them every month.', 'Calibrate your monitor — clients see your prints, not your screen.'],
  },
  {
    track: 'photo', tier: 'elite',
    who: 'Top-level sport, wildlife, commercial or fashion photography where only the best tools will do.',
    goal: 'A flagship or medium-format body, exotic glass and premium lighting — usually two of everything.',
    slots: [
      { role: 'Camera', pick: 'one', options: [
        { id: 'canon-r1', why: 'Sport/news flagship' },
        { id: 'sony-a1ii', why: '50MP at 30 fps' },
        { id: 'nikon-z9', why: 'No mechanical shutter' },
        { id: 'sony-a9iii', why: 'Global shutter, 120 fps' },
        { id: 'canon-1dxiii', why: 'Last great sports DSLR', used: 3500 },
        { id: 'fujifilm-gfx100ii', why: '102MP medium format for commercial work' },
      ] },
      { role: 'Lenses', pick: 'all', options: [
        { name: '400mm f/2.8 or 600mm f/4 super-telephoto', detail: 'Sport and wildlife', price: 13000 },
        { name: '50mm f/1.2 prime', price: 2200 },
        { name: 'Native 24–70mm + 70–200mm f/2.8', price: 5000 },
      ] },
      { role: 'Lighting', pick: 'one', options: [
        { name: 'Profoto Pro-11 / Broncolor Scoro studio packs', price: 15000 },
        { name: 'Profoto B10X Plus × 3 location kit', price: 5800 },
      ] },
      { role: 'Support', pick: 'all', options: [
        { name: 'Gitzo Systematic tripod + Wimberley gimbal head', price: 2000 },
      ] },
      { role: 'Second body', pick: 'one', options: [{ name: 'Matching second flagship body', price: 6000 }] },
      { role: 'Workflow', pick: 'all', options: [
        { name: 'Eizo ColorEdge monitor + calibration', price: 2500 },
        { name: 'Tethering cables, CFexpress cards, RAID', price: 2000 },
      ] },
    ],
    tips: ['Most world-class photographers rent exotic lenses and studio packs per job.', 'Your edit, retouch and delivery workflow matter as much as the camera.'],
  },

  // ════════════════════════ VIDEO ════════════════════════
  {
    track: 'video', tier: 'beginner',
    who: 'You want to start a YouTube channel, vlog or make short films — on a budget.',
    goal: 'A camera with a flip screen, good audio and a small light. Audio matters more than 4K.',
    slots: [
      { role: 'Camera', pick: 'one', options: [
        { id: 'canon-60d', why: 'Manual audio, 1080p — the classic film-school DSLR', used: 200 },
        { id: 'canon-70d', why: 'Dual Pixel AF for smooth focus', used: 300 },
        { id: 'panasonic-g7', why: 'Cheapest 4K with a mic jack', used: 250 },
        { id: 'canon-m50', why: 'Flip screen vlog body', used: 350 },
        { id: 'sony-zv1', why: 'Vlog compact, great AF', used: 400 },
        { id: 'dji-pocket-2', why: 'Pocket gimbal, cheap used', used: 200 },
        { id: 'dji-osmo-pocket-3', why: 'Gimbal built in — easiest start' },
        { id: 'canon-r50v', why: 'Vlog-first body' },
        { id: 'sony-zv-e10ii', why: '4K60 10-bit, big lens range' },
      ] },
      { role: 'Lens', pick: 'one', optional: true, note: 'Only for interchangeable-lens cameras.', options: [
        { name: 'Kit zoom (bundled)', detail: 'Fine for starting out', price: 100 },
        { name: 'Wide fast prime (Sigma 16mm f/1.4 / Viltrox 13mm f/1.4)', detail: 'Wide enough to vlog at arm’s length, blurry background', price: 400 },
      ] },
      { role: 'Audio', pick: 'one', options: [
        { name: 'DJI Mic Mini (2 transmitters)', detail: 'Wireless lav for clean voice anywhere', price: 170 },
        { name: 'Rode VideoMicro II on-camera mic', price: 80 },
      ] },
      { role: 'Light', pick: 'one', options: [
        { name: 'Small bi-colour LED panel (Ulanzi / Neewer)', price: 50 },
        { name: 'Amaran Ace 25c', detail: 'Brighter, RGB colours', price: 100 },
      ] },
      { role: 'Support', pick: 'one', options: [
        { name: 'Ulanzi MT-44 tripod grip', detail: 'Vlog handle + desk tripod', price: 30 },
        { name: 'Travel tripod with pan head', price: 80 },
      ] },
      { role: 'Cards & software', pick: 'all', options: [
        { name: '128GB V30 card', price: 25 },
        { name: 'DaVinci Resolve (free) or CapCut', price: 0 },
      ] },
    ],
    tips: ['Viewers forgive soft video but not bad sound — buy the mic first.', 'Shoot near a window; light makes a cheap camera look expensive.'],
  },
  {
    track: 'video', tier: 'upgrade',
    who: 'You’re posting regularly and want a more cinematic look: shallow depth of field, smooth motion, better colour.',
    goal: 'A better body, a bright zoom, ND filters for proper shutter speed, a gimbal and a real key light.',
    slots: [
      { role: 'Camera', pick: 'one', options: [
        { id: 'panasonic-gh5', why: '10-bit 4K60 legend, cheap used', used: 600 },
        { id: 'panasonic-g85', why: 'IBIS + 4K budget pick', used: 350 },
        { id: 'fujifilm-xt3', why: '10-bit 4K60, F-Log', used: 600 },
        { id: 'sony-a6400', why: 'Great AF, 4K' },
        { id: 'fujifilm-xs20', why: 'IBIS, 6.2K, F-Log 2' },
        { id: 'sony-zv-e10ii', why: 'Cheapest 10-bit 4K60 Sony' },
        { id: 'panasonic-s9', why: 'Full frame, tiny, open gate' },
      ] },
      { role: 'Lenses', pick: 'all', options: [
        { name: 'Sigma 18–50mm f/2.8 (or 28–60mm on full frame)', detail: 'Bright run-and-gun zoom', price: 550 },
        { name: '23–35mm f/1.4 prime', detail: 'Cinematic interviews and B-roll', price: 400 },
      ] },
      { role: 'ND filter', pick: 'one', options: [{ name: 'Variable ND 2–5 stop (K&F / Freewell)', detail: 'Keeps the 180° shutter rule in daylight', price: 90 }] },
      { role: 'Audio', pick: 'all', options: [
        { name: 'DJI Mic 2 (2 TX + RX) or Rode Wireless GO (Gen 3)', price: 320 },
        { name: 'Rode VideoMic GO II on-camera', price: 100 },
      ] },
      { role: 'Lighting', pick: 'all', options: [
        { name: 'Amaran 100d S + light dome / softbox', price: 260 },
        { name: 'Light stand', price: 30 },
      ] },
      { role: 'Gimbal', pick: 'one', options: [
        { id: 'dji-rs-4-mini', why: 'Self-balancing, light' },
        { id: 'zhiyun-crane-m3s', why: 'Built-in fill light' },
      ] },
      { role: 'Tripod', pick: 'one', options: [{ name: 'SmallRig AD-01 video tripod with fluid head', price: 180 }] },
    ],
    tips: ['Shutter at double the frame rate (1/50 for 25p) — ND makes that possible outdoors.', 'Learn log + a simple LUT before buying a bigger camera.'],
  },
  {
    track: 'video', tier: 'intermediate',
    who: 'You’re shooting paid content: brand videos, music videos, events or documentaries.',
    goal: 'A video-first body, proper audio recording, a two-light setup and a monitor.',
    slots: [
      { role: 'Camera', pick: 'one', options: [
        { id: 'panasonic-s5', why: 'Full frame 10-bit, cheap used', used: 900 },
        { id: 'sony-a7siii', why: 'Low-light king, cheap used', used: 2000 },
        { id: 'sony-fx30', why: 'Cinema Line, cheap' },
        { id: 'panasonic-s5ii', why: 'Full frame, PDAF, unlimited rec' },
        { id: 'panasonic-gh7', why: 'ProRes RAW internal' },
        { id: 'fujifilm-xh2s', why: 'ProRes, stacked sensor' },
        { id: 'sony-a7iv', why: 'Hybrid 4K60' },
        { id: 'nikon-z6iii', why: 'N-RAW, 6K' },
      ] },
      { role: 'Lenses', pick: 'all', options: [
        { name: '24–70mm f/2.8 (or APS-C 17–70mm f/2.8)', price: 1000 },
        { name: '35mm or 50mm f/1.4–1.8 prime', price: 500 },
      ] },
      { role: 'Audio', pick: 'all', options: [
        { name: 'Deity S-Mic 2 / Rode NTG4 shotgun + boom pole', price: 450 },
        { name: 'Zoom F3 or Tascam FR-AV2 32-bit float recorder', price: 280 },
        { name: 'DJI Mic 2 wireless kit', price: 350 },
      ] },
      { role: 'Lighting', pick: 'all', options: [
        { name: 'Amaran 200x S (key light) + light dome', price: 450 },
        { name: 'Amaran 100x S (fill / backlight)', price: 200 },
        { name: 'RGB tubes (Amaran PT2c pair)', price: 250 },
      ] },
      { role: 'Monitor', pick: 'one', options: [{ name: 'Atomos Shinobi II or Ninja', price: 450 }] },
      { role: 'Gimbal', pick: 'one', options: [
        { id: 'dji-rs-4', why: 'Fast setup, native vertical' },
        { id: 'zhiyun-weebill-3s', why: 'Long battery, sling grip' },
      ] },
      { role: 'Rig & storage', pick: 'all', options: [
        { name: 'SmallRig cage + top handle', price: 120 },
        { name: '2TB portable SSD (Samsung T7) for editing', price: 150 },
      ] },
    ],
    tips: ['Record a second audio source on every paid job.', 'Three-point lighting (key, fill, back) is the biggest upgrade for interviews.'],
  },
  {
    track: 'video', tier: 'semipro',
    who: 'You run a small production business: commercials, weddings, documentaries with a crew of 1–3.',
    goal: 'A cinema-grade full-frame body, cine-style lenses, focus control and a bigger lighting package.',
    slots: [
      { role: 'Camera', pick: 'one', options: [
        { id: 'canon-c100ii', why: 'Real cinema body (ND, XLR) for cheap used', used: 900 },
        { id: 'panasonic-s1h', why: 'Netflix-approved full frame', used: 1500 },
        { id: 'sony-fx3', why: 'Industry-favourite small cinema camera' },
        { id: 'sony-fx2', why: 'Cheapest full-frame Cinema Line' },
        { id: 'nikon-zr', why: 'R3D NE RAW internally' },
        { id: 'canon-c70', why: 'Built-in ND, XLR' },
        { id: 'canon-r5c', why: '8K RAW hybrid' },
        { id: 'canon-c50', why: '7K open-gate RAW' },
      ] },
      { role: 'Lenses', pick: 'one', options: [
        { name: 'f/2.8 zoom pair: 24–70mm + 70–200mm', detail: 'Fast and flexible', price: 2700 },
        { name: 'Cine prime set (DZOFilm Vespid / Sirui Aurora, 3–4 lenses)', detail: 'Consistent look, geared for follow focus', price: 3000 },
      ] },
      { role: 'Focus', pick: 'one', options: [{ name: 'Tilta Nucleus Nano II wireless follow focus', price: 300 }] },
      { role: 'Audio', pick: 'all', options: [
        { name: 'Sennheiser MKE 600 / Deity S-Mic 2 on boom', price: 400 },
        { name: 'Rode Wireless PRO (2 TX, 32-bit float)', price: 400 },
        { name: 'Zoom F6 field recorder', price: 700 },
      ] },
      { role: 'Lighting', pick: 'all', options: [
        { name: 'Aputure LS 300x (key)', price: 900 },
        { name: 'Amaran 200x S + 100x S', price: 650 },
        { name: 'Light stands, sandbags, diffusion frame', price: 400 },
      ] },
      { role: 'Monitor & video', pick: 'all', options: [
        { name: 'Atomos Ninja (ProRes RAW) 5"', price: 700 },
        { name: 'Hollyland Mars 4K wireless video', price: 700 },
      ] },
      { role: 'Gimbal', pick: 'one', options: [{ id: 'dji-rs-4-pro', why: 'Carries cine lenses, LiDAR focus option' }] },
      { role: 'Tripod', pick: 'one', options: [{ name: 'Sachtler Ace XL fluid head + legs', price: 900 }] },
    ],
    tips: ['Match colour across cameras with the same log profile and a test chart.', 'Rent bigger lights per job before buying them.'],
  },
  {
    track: 'video', tier: 'pro',
    who: 'You shoot broadcast, commercials or features for clients with real budgets.',
    goal: 'A true cinema camera, cine lenses, professional sound and a lighting truck’s core.',
    slots: [
      { role: 'Camera', pick: 'one', options: [
        { id: 'sony-fx6', why: 'Documentary and broadcast standard' },
        { id: 'canon-c80', why: 'Built-in ND, compact' },
        { id: 'canon-c400', why: '6K RAW, Genlock' },
        { id: 'canon-c300iii', why: 'Super 35 broadcast workhorse' },
        { id: 'sony-fx9', why: 'Full-frame 6K doc camera' },
        { id: 'canon-c500ii', why: '5.9K RAW full frame' },
      ] },
      { role: 'Lenses', pick: 'one', options: [
        { name: 'Sigma Cine FF High Speed prime set (5 lenses)', price: 17000 },
        { name: 'Canon / Fujinon cine zoom pair', price: 25000 },
      ] },
      { role: 'Focus & control', pick: 'all', options: [{ name: 'Tilta Nucleus-M II / DJI Focus Pro lens control', price: 1500 }] },
      { role: 'Audio', pick: 'all', options: [
        { name: 'Sound Devices MixPre-6 II', price: 1000 },
        { name: 'Sennheiser MKH 416 shotgun', price: 1000 },
        { name: 'Sennheiser EW-DP wireless (2 channels)', price: 1300 },
      ] },
      { role: 'Lighting', pick: 'all', options: [
        { name: 'Aputure LS 600d Pro + Light Dome 150', price: 2000 },
        { name: 'Aputure LS 300x + Nova P300c soft panel', price: 2600 },
        { name: 'Infinibar / tube RGB kit', price: 900 },
      ] },
      { role: 'Monitoring', pick: 'all', options: [
        { name: 'SmallHD Cine 7 director’s monitor', price: 2500 },
        { name: 'Teradek Bolt 6 wireless video', price: 3000 },
      ] },
      { role: 'Support', pick: 'all', options: [
        { name: 'Sachtler aktiv8 fluid head + tripod', price: 3000 },
        { name: 'DJI RS 4 Pro or Easyrig', price: 1000 },
      ] },
    ],
    tips: ['Timecode-sync camera and audio on multi-camera shoots.', 'Hire a sound recordist — it frees you to light and frame.'],
  },
  {
    track: 'video', tier: 'elite',
    who: 'Feature films, high-end commercials and series. Almost everything here is rented per production.',
    goal: 'A Hollywood-grade camera, cine primes, remote focus, big lights and full sound.',
    slots: [
      { role: 'Camera', pick: 'one', options: [
        { name: 'ARRI ALEXA 35 / ALEXA Mini LF', detail: 'Industry standard; typically rented at $1,500+/day', price: 75000 },
        { name: 'RED V-RAPTOR [X] 8K VV', price: 30000 },
        { id: 'sony-venice-2', why: 'Sony’s Hollywood A-camera' },
        { id: 'sony-burano', why: 'One-operator Venice' },
        { id: 'canon-c500ii', why: 'Owned A-cam for smaller productions' },
      ] },
      { role: 'Lenses', pick: 'one', options: [
        { name: 'ARRI Signature / Cooke S7i primes', detail: 'Rental only for most', price: 150000 },
        { name: 'Zeiss Supreme Prime set', price: 90000 },
      ] },
      { role: 'Camera support', pick: 'all', options: [
        { name: 'O’Connor / Sachtler Cine head + legs', price: 12000 },
        { name: 'DJI Ronin 2 or Steadicam', price: 10000 },
        { name: 'Dana Dolly / track', price: 1500 },
      ] },
      { role: 'Focus & video village', pick: 'all', options: [
        { name: 'ARRI Hi-5 / Teradek RT wireless focus', price: 8000 },
        { name: 'Teradek Bolt 6 XT + SmallHD director’s monitors', price: 9000 },
      ] },
      { role: 'Lighting', pick: 'all', options: [
        { name: 'ARRI SkyPanel S60-C × 2', price: 12000 },
        { name: 'Aputure STORM 1200x / ARRI Orbiter', price: 4000 },
        { name: 'Grip package: C-stands, flags, frames, haze', price: 6000 },
      ] },
      { role: 'Sound', pick: 'all', options: [
        { name: 'Sound Devices 833 mixer-recorder', price: 4000 },
        { name: 'Sennheiser MKH 50 + Schoeps CMIT 5 boom mics', price: 4000 },
        { name: 'Lectrosonics wireless (4 channels)', price: 12000 },
      ] },
      { role: 'Post', pick: 'all', options: [{ name: 'DaVinci Resolve Studio + Blackmagic grading panel', price: 3000 }] },
    ],
    tips: ['At this level the crew is the kit: DP, focus puller, gaffer, sound mixer.', 'Rent from a rental house; own only what you use every week.'],
  },

  // ════════════════════════ HYBRID ════════════════════════
  {
    track: 'hybrid', tier: 'beginner',
    who: 'You want one camera that does good photos AND video — for content, family, small events.',
    goal: 'A body with a flip screen, a mic input and decent autofocus, plus a fast prime and clean audio.',
    slots: [
      { role: 'Camera', pick: 'one', options: [
        { id: 'canon-70d', why: 'Dual Pixel AF, flip screen — cheap used', used: 300 },
        { id: 'canon-m50', why: 'Small, flip screen, great colours — used', used: 350 },
        { id: 'panasonic-g7', why: '4K + mic jack for very little', used: 250 },
        { id: 'sony-a6100', why: 'Fast eye AF, 4K', used: 450 },
        { id: 'fujifilm-xt200', why: 'Big flip screen, Fuji colour', used: 350 },
        { id: 'nikon-z30', why: 'Vlog-friendly Z body' },
        { id: 'canon-r50', why: 'Best new beginner AF' },
        { id: 'sony-zv-e10ii', why: '10-bit 4K60' },
      ] },
      { role: 'Lenses', pick: 'all', options: [
        { name: 'Kit zoom (bundled)', detail: 'Everyday photos and B-roll', price: 100 },
        { name: '24–35mm f/1.4–1.8 prime', detail: 'Blurry backgrounds for portraits and talking heads', price: 250 },
      ] },
      { role: 'Audio', pick: 'one', options: [
        { name: 'DJI Mic Mini / Rode Wireless Micro', price: 120 },
        { name: 'Rode VideoMicro II', price: 80 },
      ] },
      { role: 'Light', pick: 'one', options: [{ name: 'Small bi-colour LED panel', price: 50 }] },
      { role: 'Support', pick: 'one', options: [{ name: 'Travel tripod with pan head', price: 80 }] },
      { role: 'Cards & power', pick: 'all', options: [
        { name: '2 × 128GB SD (V30)', price: 40 },
        { name: '2 spare batteries', price: 60 },
      ] },
    ],
    tips: ['Shoot photos in RAW and video in a flat profile — both edit better.', 'A cheap used DSLR + a 50mm f/1.8 still makes beautiful images.'],
  },
  {
    track: 'hybrid', tier: 'upgrade',
    who: 'You make content or do small paid gigs and need both stills and video to look professional.',
    goal: '10-bit video, IBIS or a gimbal, a bright zoom and a real key light.',
    slots: [
      { role: 'Camera', pick: 'one', options: [
        { id: 'panasonic-gh5', why: 'IBIS + 10-bit, great used', used: 600 },
        { id: 'fujifilm-xt3', why: '10-bit 4K60 + Fuji stills', used: 600 },
        { id: 'sony-a6400', why: 'Great AF for both' },
        { id: 'sony-a6700', why: 'IBIS, 10-bit, AI AF' },
        { id: 'fujifilm-xs20', why: 'IBIS, 6.2K, great JPEGs' },
        { id: 'canon-r10', why: 'Fast stills, clean 4K' },
        { id: 'nikon-z50ii', why: 'Great handling, 10-bit N-Log' },
      ] },
      { role: 'Lenses', pick: 'all', options: [
        { name: 'Sigma 18–50mm f/2.8', price: 550 },
        { name: '30–35mm f/1.4 prime', price: 300 },
      ] },
      { role: 'Audio', pick: 'one', options: [{ name: 'DJI Mic 2 (2 TX)', price: 320 }] },
      { role: 'Lighting', pick: 'all', options: [{ name: 'Amaran 100d S + softbox + stand', price: 280 }] },
      { role: 'Flash', pick: 'one', optional: true, options: [{ name: 'Godox V860 III + trigger', price: 240 }] },
      { role: 'Gimbal', pick: 'one', optional: true, options: [{ id: 'dji-rs-4-mini', why: 'Self-balancing' }, { id: 'zhiyun-crane-m3s', why: 'Fill light built in' }] },
      { role: 'ND filter', pick: 'one', options: [{ name: 'Variable ND', price: 90 }] },
    ],
    tips: ['Learn one log profile and one LUT well.', 'Batch your shoot: stills first, then video, with the same light.'],
  },
  {
    track: 'hybrid', tier: 'intermediate',
    who: 'Weddings, events, brand shoots — clients want photos and a highlight film.',
    goal: 'A full-frame hybrid body, a 2.8 zoom, a portrait prime, two lights and pro audio.',
    slots: [
      { role: 'Camera', pick: 'one', options: [
        { id: 'sony-a7iii', why: 'Still the value full-frame hybrid', used: 1000 },
        { id: 'canon-r6', why: 'Great AF + IBIS, used', used: 1200 },
        { id: 'panasonic-s5', why: '10-bit full frame, cheap used', used: 900 },
        { id: 'sony-a7iv', why: '33MP + 10-bit 4K60' },
        { id: 'canon-r8', why: 'R6 II sensor, light' },
        { id: 'panasonic-s5ii', why: 'PDAF, unlimited 6K' },
        { id: 'nikon-z5ii', why: 'IBIS, dual slots, N-Log' },
        { id: 'fujifilm-xt5', why: '40MP + 6.2K' },
      ] },
      { role: 'Lenses', pick: 'all', options: [
        { name: '28–75mm / 24–70mm f/2.8', price: 1000 },
        { name: '85mm f/1.8', price: 550 },
      ] },
      { role: 'Audio', pick: 'all', options: [
        { name: 'DJI Mic 2 kit', price: 350 },
        { name: 'Zoom F3 32-bit recorder + shotgun', price: 450 },
      ] },
      { role: 'Lighting', pick: 'all', options: [
        { name: 'Amaran 200x S + dome', price: 450 },
        { name: 'Godox V1 flash + trigger', price: 330 },
      ] },
      { role: 'Gimbal', pick: 'one', options: [{ id: 'dji-rs-4', why: 'Fast setup' }, { id: 'zhiyun-weebill-3s', why: 'Long battery' }] },
      { role: 'Backup', pick: 'all', options: [{ name: '2 × 2TB SSDs', price: 300 }] },
    ],
    tips: ['Use a second body (even an older one) so photos and video run at the same time.', 'Always record backup audio at weddings.'],
  },
  {
    track: 'hybrid', tier: 'semipro',
    who: 'A small studio doing hybrid work every week.',
    goal: 'Two matching bodies, the f/2.8 trinity, portable strobes and LED lights.',
    slots: [
      { role: 'Camera', pick: 'one', options: [
        { id: 'canon-r6iii', why: 'Event all-rounder' },
        { id: 'sony-a7v', why: 'AI AF, partially stacked' },
        { id: 'nikon-z6iii', why: 'N-RAW + great EVF' },
        { id: 'panasonic-s1ii', why: 'Open gate + ProRes RAW' },
        { id: 'canon-r6ii', why: 'Proven and cheaper' },
        { id: 'fujifilm-xh2s', why: 'Stacked APS-C, ProRes' },
      ] },
      { role: 'Lenses', pick: 'all', options: [
        { name: '24–70mm f/2.8', price: 1200 },
        { name: '70–200mm f/2.8', price: 1500 },
        { name: '35mm or 50mm f/1.4', price: 750 },
      ] },
      { role: 'Lighting', pick: 'all', options: [
        { name: 'Godox AD200 Pro II', price: 350 },
        { name: 'Aputure LS 300x', price: 900 },
      ] },
      { role: 'Audio', pick: 'all', options: [{ name: 'Rode Wireless PRO + shotgun', price: 650 }] },
      { role: 'Monitor', pick: 'one', options: [{ name: 'Atomos Ninja 5"', price: 700 }] },
      { role: 'Gimbal', pick: 'one', options: [{ id: 'dji-rs-4-pro', why: 'Heavy lenses' }, { id: 'dji-rs-5', why: 'Newest RS' }] },
    ],
    tips: ['Match colour across both bodies before the job.', 'Insure your kit.'],
  },
  {
    track: 'hybrid', tier: 'pro',
    who: 'Commercial hybrid production — high-res stills and cinema-grade video for brands.',
    goal: 'A high-resolution hybrid flagship, native glass, strobes + LEDs and full audio.',
    slots: [
      { role: 'Camera', pick: 'one', options: [
        { id: 'canon-r5', why: '45MP + 8K, great used', used: 2200 },
        { id: 'canon-r5ii', why: 'Stacked 45MP, 8K60 RAW' },
        { id: 'nikon-z8', why: '8K N-RAW + 45MP' },
        { id: 'panasonic-s1rii', why: '44MP + 8K' },
        { id: 'canon-r5c', why: 'Cinema-ready R5' },
      ] },
      { role: 'Lenses', pick: 'all', options: [
        { name: 'Native 24–70mm + 70–200mm f/2.8', price: 5000 },
        { name: '85mm f/1.2–1.4', price: 1800 },
      ] },
      { role: 'Lighting', pick: 'all', options: [
        { name: '2 × Godox AD600 Pro II', price: 2000 },
        { name: 'Aputure LS 600d + dome', price: 2000 },
      ] },
      { role: 'Audio', pick: 'all', options: [{ name: 'Sound Devices MixPre-6 II + MKH 416', price: 2000 }] },
      { role: 'Second body', pick: 'one', options: [{ id: 'sony-fx3', why: 'Dedicated video B-cam' }, { name: 'Matching second hybrid body', price: 3000 }] },
    ],
    tips: ['Split stills and motion into separate set-ups on big jobs.', 'Tether stills to a laptop for client review.'],
  },
  {
    track: 'hybrid', tier: 'elite',
    who: 'Top commercial and editorial creators who deliver world-class stills and films from one set.',
    goal: 'Flagship do-everything bodies, exotic glass and a full production package.',
    slots: [
      { role: 'Camera', pick: 'one', options: [
        { id: 'sony-a1ii', why: '50MP 30 fps + 8K' },
        { id: 'nikon-z9', why: '8K N-RAW, pro build' },
        { id: 'canon-r1', why: 'Pro AF, 6K RAW' },
        { id: 'panasonic-s1rii', why: 'High-res + open gate' },
      ] },
      { role: 'Lenses', pick: 'all', options: [
        { name: 'f/1.2 prime set (35/50/85)', price: 7000 },
        { name: 'Native 24–70 + 70–200 f/2.8', price: 5000 },
      ] },
      { role: 'Lighting', pick: 'one', options: [{ name: 'Profoto + ARRI/Aputure hybrid lighting package', price: 15000 }] },
      { role: 'Video B-cam', pick: 'one', options: [{ id: 'sony-fx6', why: 'Matches Sony colour' }, { id: 'canon-c80', why: 'Matches Canon colour' }] },
      { role: 'Workflow', pick: 'all', options: [{ name: 'Calibrated monitor, RAID, tethering', price: 4000 }] },
    ],
    tips: ['At this level, hire separate photo and video leads and share the light.'],
  },

  // ════════════════════════ ACTION & BTS ════════════════════════
  {
    track: 'action', tier: 'beginner',
    who: 'You just want a GoPro-style camera to catch behind-the-scenes, travel or sport — cheaply.',
    goal: 'A small tough camera, spare batteries and a few mounts.',
    slots: [
      { role: 'Camera', pick: 'one', options: [
        { id: 'gopro-hero7', why: 'HyperSmooth BTS cam, cheap used', used: 120 },
        { id: 'gopro-hero8', why: 'Built-in mount fingers, used', used: 150 },
        { id: 'dji-osmo-action', why: 'Front screen, cheap used', used: 120 },
        { id: 'dji-osmo-action-3', why: 'Magnetic mount, great battery, used', used: 180 },
        { id: 'dji-pocket-2', why: 'Tiny gimbal camera for BTS, used', used: 200 },
        { id: 'gopro-hero-2024', why: 'Cheapest new GoPro' },
        { id: 'insta360-go-3', why: 'Clip it on your shirt — hands-free BTS' },
      ] },
      { role: 'Mounts', pick: 'all', options: [
        { name: 'Mount kit: chest strap, head strap, clamp, suction cup', price: 35 },
        { name: 'Mini tripod / selfie stick', price: 25 },
      ] },
      { role: 'Power & cards', pick: 'all', options: [
        { name: '2 spare batteries + dual charger', price: 40 },
        { name: '128GB microSD (V30)', price: 20 },
      ] },
    ],
    tips: ['Mount it on your chest or a C-stand for hands-free BTS.', 'Turn on horizon lock for smooth, level shots.'],
  },
  {
    track: 'action', tier: 'upgrade',
    who: 'You post BTS and adventure clips regularly and want better low light and audio.',
    goal: 'A newer action cam with 10-bit colour, wireless audio and ND filters.',
    slots: [
      { role: 'Camera', pick: 'one', options: [
        { id: 'gopro-hero11', why: '8:7 sensor, 10-bit, used', used: 250 },
        { id: 'gopro-hero12', why: 'Log + long battery' },
        { id: 'dji-osmo-action-4', why: '1/1.3" sensor, great low light' },
        { id: 'insta360-ace-pro', why: 'Flip screen, good low light' },
        { id: 'dji-osmo-nano', why: '52 g magnetic POV cam' },
        { id: 'insta360-go-ultra', why: '4K60 thumb camera' },
        { id: 'dji-osmo-pocket-3', why: 'Gimbal + 1-inch for talking BTS' },
      ] },
      { role: 'Audio', pick: 'one', options: [{ name: 'DJI Mic Mini (pairs direct with DJI cams)', price: 120 }, { name: 'GoPro Media Mod', price: 80 }] },
      { role: 'Filters', pick: 'all', options: [{ name: 'ND 8/16/32 set', price: 50 }] },
      { role: 'Mounts', pick: 'all', options: [{ name: 'Magnetic quick-release + extension pole', price: 60 }] },
      { role: 'Power & cards', pick: 'all', options: [{ name: '3 batteries + charger + 2 cards', price: 90 }] },
    ],
    tips: ['Shoot 10-bit log so it grades with your main camera.', 'Use ND to get natural motion blur.'],
  },
  {
    track: 'action', tier: 'intermediate',
    who: 'BTS for paid shoots, sports creators, travel channels.',
    goal: 'A flagship action cam plus a 360 camera for “reframe later” shots.',
    slots: [
      { role: 'Action camera', pick: 'one', options: [
        { id: 'gopro-hero13', why: 'Lens mods, GPS' },
        { id: 'dji-osmo-action-5-pro', why: 'Mic pairing, 4 h battery' },
        { id: 'dji-osmo-action-6', why: 'Variable aperture, square sensor' },
        { id: 'insta360-ace-pro-2', why: 'Flip screen, 8K' },
      ] },
      { role: '360 camera', pick: 'one', optional: true, options: [
        { id: 'insta360-x4', why: '8K 360, cheap now' },
        { id: 'insta360-x5', why: 'Replaceable lenses' },
        { id: 'dji-osmo-360', why: 'DJI ecosystem' },
      ] },
      { role: 'Audio', pick: 'one', options: [{ name: 'DJI Mic 2 / Mic 3', price: 300 }] },
      { role: 'Accessories', pick: 'all', options: [
        { name: 'Invisible selfie stick + bullet-time handle', price: 60 },
        { name: 'Battery hub + 4 batteries', price: 120 },
      ] },
    ],
    tips: ['A 360 camera on a stick gives drone-like BTS shots without a drone.'],
  },
  {
    track: 'action', tier: 'semipro',
    who: 'A dedicated BTS shooter on commercial sets.',
    goal: 'Multi-angle coverage: action cam + 360 + pocket gimbal, all with good audio.',
    slots: [
      { role: 'Main action cam', pick: 'one', options: [
        { id: 'dji-osmo-action-6', why: 'Best low light' },
        { id: 'gopro-hero13', why: 'Mounting ecosystem' },
      ] },
      { role: '360 camera', pick: 'one', options: [
        { id: 'insta360-x5', why: 'Proven 8K 360' },
        { id: 'gopro-max-2', why: 'True 8K' },
        { id: 'dji-osmo-360', why: '1-inch-class 360' },
      ] },
      { role: 'Pocket gimbal', pick: 'one', options: [
        { id: 'dji-osmo-pocket-4', why: '4K240, 1-inch' },
        { id: 'dji-osmo-pocket-3', why: 'Proven, cheaper' },
      ] },
      { role: 'Audio', pick: 'all', options: [{ name: 'DJI Mic 3 (2 TX) + spare', price: 400 }] },
      { role: 'Power', pick: 'all', options: [{ name: 'Power bank + battery hubs', price: 150 }] },
    ],
    tips: ['Sync clips by clapping on camera at the start of each take.'],
  },
  {
    track: 'action', tier: 'pro',
    who: 'Professional BTS, extreme sports and documentary crews.',
    goal: 'The newest flagships: dual-lens pocket gimbal, 1-inch-class 360 and a follow-me drone.',
    slots: [
      { role: 'Pocket gimbal', pick: 'one', options: [{ id: 'dji-osmo-pocket-4p', why: 'Dual camera, 3× tele' }, { id: 'dji-osmo-pocket-4', why: 'Single camera, cheaper' }] },
      { role: '360 camera', pick: 'one', options: [{ id: 'insta360-x6', why: '8K50, 1-inch-equivalent' }, { id: 'gopro-max-2', why: 'True 8K' }] },
      { role: 'Action camera', pick: 'one', options: [{ id: 'dji-osmo-action-6', why: 'Variable aperture' }, { id: 'gopro-hero13', why: 'Lens mods' }] },
      { role: 'Follow-me drone', pick: 'one', optional: true, options: [{ id: 'dji-neo-2', why: 'Gesture control + LiDAR' }, { id: 'dji-neo', why: 'Cheaper' }] },
      { role: 'Audio', pick: 'all', options: [{ name: 'DJI Mic 3 kit (2 TX)', price: 330 }] },
    ],
    tips: ['Deliver BTS in the same frame rate as the main production.'],
  },
  {
    track: 'action', tier: 'elite',
    who: 'Big-budget BTS crews and extreme-sport productions covering every angle.',
    goal: 'Many synced cameras, timecode, wireless mics and specialist mounts.',
    slots: [
      { role: 'Cameras', pick: 'all', options: [
        { name: '4 × flagship action cams (Action 6 / HERO13)', price: 1600 },
        { name: '2 × 360 cameras (X6 / MAX2)', price: 1340 },
        { name: '2 × pocket gimbals (Pocket 4P)', price: 1240 },
      ] },
      { role: 'Sync & audio', pick: 'all', options: [
        { name: 'Timecode boxes (Tentacle Sync E × 4)', price: 800 },
        { name: '4-channel wireless mic system', price: 1200 },
      ] },
      { role: 'Mounts', pick: 'all', options: [{ name: 'Car, helmet, board and suction rigs', price: 600 }] },
      { role: 'Aerial', pick: 'one', optional: true, options: [{ id: 'dji-avata-2', why: 'FPV flythroughs' }] },
    ],
    tips: ['Timecode everything — it saves days in the edit.'],
  },

  // ════════════════════════ DRONE ════════════════════════
  {
    track: 'drone', tier: 'beginner',
    who: 'Your first drone — learn to fly safely and grab aerial photos and video.',
    goal: 'A sub-250 g drone (fewer rules in most countries), spare batteries and a card.',
    slots: [
      { role: 'Drone', pick: 'one', options: [
        { id: 'dji-mini-se', why: 'Cheapest DJI drone, used', used: 150 },
        { id: 'dji-mavic-mini', why: 'Original sub-250 g, used', used: 150 },
        { id: 'dji-mini-2', why: '4K + OcuSync, used', used: 250 },
        { id: 'dji-spark', why: 'Gesture-control fun, used', used: 150 },
        { id: 'dji-neo', why: 'Palm take-off selfie drone' },
        { id: 'dji-neo-2', why: 'LiDAR + gesture control' },
        { id: 'dji-mini-2-se', why: '10 km link, cheap' },
        { id: 'dji-mini-4k', why: 'Cheapest 3-axis 4K' },
      ] },
      { role: 'Batteries', pick: 'one', options: [{ name: 'Fly More kit or 2 spare batteries + hub', price: 120 }] },
      { role: 'Cards', pick: 'all', options: [{ name: '128GB microSD (V30)', price: 20 }] },
      { role: 'Accessories', pick: 'all', options: [
        { name: 'Foldable landing pad', price: 20 },
        { name: 'Propeller guards (if not included)', price: 20 },
      ] },
      { role: 'Paperwork', pick: 'all', options: [{ name: 'Local registration / recreational test (e.g. FAA TRUST in the US — free)', price: 0 }] },
    ],
    tips: ['Practise in an open field in Normal mode before flying near anything.', 'Check local no-fly zones with your country’s drone app before every flight.'],
  },
  {
    track: 'drone', tier: 'upgrade',
    who: 'You fly often and want better images, obstacle sensing and longer flights.',
    goal: 'A sub-250 g drone with a bigger sensor, obstacle avoidance and ND filters.',
    slots: [
      { role: 'Drone', pick: 'one', options: [
        { id: 'dji-mavic-air-2', why: '48MP, 4K60 — great used', used: 400 },
        { id: 'dji-air-2s', why: '1-inch sensor, used', used: 550 },
        { id: 'dji-avata', why: 'Prop-guarded FPV, used', used: 400 },
        { id: 'dji-mini-3', why: 'Long flights, true vertical' },
        { id: 'dji-mini-3-pro', why: 'Great used value' },
        { id: 'dji-mini-4-pro', why: 'Omni sensing, 4K100' },
        { id: 'dji-flip', why: 'Fold-flat, guarded' },
      ] },
      { role: 'Batteries', pick: 'one', options: [{ name: 'Fly More Combo (3 batteries + hub + bag)', price: 200 }] },
      { role: 'Filters', pick: 'all', options: [{ name: 'ND 8/16/32 filter set', detail: 'Smooth motion blur in bright light', price: 60 }] },
      { role: 'Protection', pick: 'all', options: [{ name: 'DJI Care Refresh (1 year)', price: 80 }] },
      { role: 'Cards', pick: 'all', options: [{ name: '2 × 128GB microSD (V30)', price: 40 }] },
    ],
    tips: ['Use ND filters and a 1/50 shutter for cinematic motion.', 'Fly smooth, slow, single-axis moves — they look the most professional.'],
  },
  {
    track: 'drone', tier: 'intermediate',
    who: 'You want to sell aerial shots — real estate, travel content, events.',
    goal: 'A 1-inch-sensor drone, a commercial licence and enough batteries for a full job.',
    slots: [
      { role: 'Drone', pick: 'one', options: [
        { id: 'dji-mavic-2-pro', why: '1-inch Hasselblad, used', used: 650 },
        { id: 'dji-phantom-4-pro-v2', why: 'Mechanical shutter, used', used: 800 },
        { id: 'dji-air-3', why: 'Dual camera' },
        { id: 'dji-air-3s', why: '1-inch + 70mm, LiDAR' },
        { id: 'dji-mini-5-pro', why: '1-inch under 250 g' },
      ] },
      { role: 'Batteries', pick: 'one', options: [{ name: 'Fly More Combo + 1 extra battery', price: 350 }] },
      { role: 'Filters', pick: 'all', options: [{ name: 'ND/PL filter set', price: 100 }] },
      { role: 'Licence', pick: 'all', options: [{ name: 'Commercial licence (e.g. FAA Part 107 test in the US)', price: 175 }] },
      { role: 'Protection', pick: 'all', options: [{ name: 'DJI Care Refresh', price: 150 }] },
      { role: 'Cards & storage', pick: 'all', options: [
        { name: '2 × 256GB microSD (V30)', price: 60 },
        { name: '2TB portable SSD', price: 150 },
      ] },
    ],
    tips: ['You need a commercial licence before charging for drone work in most countries.', 'Shoot 10-bit D-Log M so footage grades like your ground camera.'],
  },
  {
    track: 'drone', tier: 'semipro',
    who: 'Drone work is part of your business: real estate, weddings, tourism, construction.',
    goal: 'A Mavic-class drone, a bright controller, insurance and a full set of batteries.',
    slots: [
      { role: 'Drone', pick: 'one', options: [
        { id: 'dji-mavic-3', why: '4/3 Hasselblad, used', used: 1100 },
        { id: 'dji-mavic-3-classic', why: '4/3 for less' },
        { id: 'dji-mavic-3-pro', why: 'Three cameras' },
        { id: 'dji-air-3s', why: 'Lighter backup' },
      ] },
      { role: 'Controller', pick: 'one', options: [{ name: 'DJI RC Pro (bright 1000-nit screen)', price: 1000 }] },
      { role: 'Batteries', pick: 'one', options: [{ name: '4+ batteries and charging hub', price: 600 }] },
      { role: 'Filters', pick: 'all', options: [{ name: 'Pro ND/PL set', price: 150 }] },
      { role: 'Business', pick: 'all', options: [
        { name: 'Commercial licence', price: 175 },
        { name: 'Liability insurance (per year)', price: 600 },
      ] },
      { role: 'Case', pick: 'all', options: [{ name: 'Hard case (Nanuk / Pelican)', price: 200 }] },
    ],
    tips: ['Carry a pre-flight checklist and log every flight.', 'Get airspace authorisation in advance for controlled areas.'],
  },
  {
    track: 'drone', tier: 'pro',
    who: 'Professional aerial cinematography for commercials, tourism boards and TV.',
    goal: 'A flagship drone with the best camera, ProRes or big-sensor capture, plus an FPV drone for dynamic shots.',
    slots: [
      { role: 'Drone', pick: 'one', options: [
        { id: 'dji-inspire-2', why: 'Interchangeable-lens cinema drone, used', used: 2500 },
        { id: 'dji-mavic-4-pro', why: '100MP, 6K HDR' },
        { id: 'dji-mavic-3-cine', why: 'ProRes 422 HQ' },
        { id: 'dji-mavic-3-pro', why: 'Three-camera workhorse' },
      ] },
      { role: 'FPV drone', pick: 'one', optional: true, options: [
        { id: 'dji-avata-2', why: 'Immersive flythroughs, safer prop guards' },
      ] },
      { role: 'Controller', pick: 'one', options: [{ name: 'DJI RC Pro 2', price: 1100 }] },
      { role: 'Batteries', pick: 'one', options: [{ name: '6 batteries + 2 charging hubs + car charger', price: 1000 }] },
      { role: 'Filters', pick: 'all', options: [{ name: 'Pro ND/PL set (PolarPro / Freewell)', price: 250 }] },
      { role: 'Business', pick: 'all', options: [
        { name: 'Commercial licence + waivers', price: 300 },
        { name: 'Liability + hull insurance (per year)', price: 1200 },
      ] },
    ],
    tips: ['Fly with a visual observer on busy sets.', 'Deliver in the same log profile and frame rate as the main cameras.'],
  },
  {
    track: 'drone', tier: 'elite',
    who: 'Feature films and high-end commercials where the drone carries a cinema camera.',
    goal: 'A dual-operator cinema drone with interchangeable lenses — or a heavy-lifter flying an ALEXA or RED.',
    slots: [
      { role: 'Drone', pick: 'one', options: [
        { id: 'dji-inspire-3', why: 'Full-frame 8K RAW, DL-mount lenses' },
        { name: 'Freefly Alta X heavy-lift + ALEXA Mini LF / RED', detail: 'Usually hired with a specialist crew', price: 60000 },
      ] },
      { role: 'Lenses', pick: 'all', options: [{ name: 'DL-mount primes (18/24/35/50mm)', price: 5000 }] },
      { role: 'Power & media', pick: 'all', options: [
        { name: 'TB51 batteries × 8 + charging hubs', price: 2500 },
        { name: 'DJI PROSSD 1TB × 2', price: 1600 },
      ] },
      { role: 'Control', pick: 'all', options: [
        { name: 'Second RC Plus for the camera operator', price: 1300 },
        { name: 'High-bright monitors + wireless video to video village', price: 3000 },
      ] },
      { role: 'Crew & cover', pick: 'all', options: [
        { name: 'Pilot + camera operator + visual observer', detail: 'Per-day rate varies', price: 0 },
        { name: 'Aviation insurance (per year)', price: 5000 },
      ] },
    ],
    tips: ['Two operators — one flies, one frames — is what makes Inspire shots look like cinema.', 'Plan permits weeks ahead for city or film-set flights.'],
  },
];

export const kitFor = (track: Track, tier: TierKey) => kits.find((k) => k.track === track && k.tier === tier)!;
export const allKits = kits;
