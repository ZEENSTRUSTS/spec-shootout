import { cam, R } from './build';

const P = ['USB-C', 'Full-size HDMI', 'Mic in', 'Headphone out', 'Wi-Fi', 'Bluetooth'];
const P_M = ['Micro USB', 'Micro HDMI', 'Mic in', 'Wi-Fi'];
const DFD = 'Contrast-detect DFD';
const PANA = ['Human (eye/face/body/head)', 'Animal (incl. eye)', 'Car', 'Motorcycle'];
const OLD = ['Face / Eye', 'Human body'];
const FHD = '1920x1080';
const UHD = '3840x2160';
const DCI = '4096x2160';

export const panasonic = [
  cam({
    id: 'panasonic-gh4', brand: 'Panasonic', model: 'Lumix GH4', year: 2014, price: 1699, mount: 'Micro Four Thirds', type: 'Mirrorless', seg: 'Video pioneer',
    s: ['Micro Four Thirds', 16, 'Live MOS'], iso: [200, 25600, '100–25,600'], fps: [12, 40], sh: '1/8000',
    af: [DFD, 49, 54, ['Face']], vaf: 45,
    v: { log: ['V-Log L (paid upgrade)', 'Cine-D'], codecs: ['MOV / MP4 (100 Mbps)', 'AVCHD'], ext: '10-bit 4:2:2 over HDMI', unl: true, rec: 'Unlimited (non-EU)', m: [`C4K|${DCI}|24|1.15`, `4K UHD|${UHD}|${R.cine}|1.15`, `Full HD|${FHD}|${R.all60}`, `Full HD VFR|${FHD}|96|1||Slow motion`, `4K UHD (HDMI 10-bit)|${UHD}|${R.cine}|1.15|10:422:ext`] },
    vf: 'EVF 2.36 0.67', scr: '3.0" 1.04M-dot vari-angle touch', g: 560, seal: true, slots: ['SD UHS-I'], bat: 'DMW-BLF19', ports: ['Micro USB', 'Micro HDMI', 'Mic in', 'Headphone out', 'Wi-Fi', 'NFC'],
    hl: ['First mirrorless with internal 4K', 'No IBIS'],
  }),
  cam({
    id: 'panasonic-g85', brand: 'Panasonic', model: 'Lumix G85 / G80', short: 'G85', year: 2016, price: 899, mount: 'Micro Four Thirds', type: 'Mirrorless', seg: 'Enthusiast',
    s: ['Micro Four Thirds', 16, 'Live MOS (no low-pass filter)'], iso: [200, 25600, '100–25,600'], fps: [9, 40],
    af: [DFD, 49, 54, ['Face / Eye']], vaf: 48, ibis: 5,
    v: { codecs: ['MP4', 'AVCHD'], rec: '29:59 (EU) / unlimited', m: [`4K UHD|${UHD}|${R.cine}|1.1`, `Full HD|${FHD}|${R.all60}`] },
    vf: 'EVF 2.36 0.74', scr: '3.0" 1.04M-dot vari-angle touch', g: 505, seal: true, slots: ['SD UHS-I'], bat: 'DMW-BLC12', ports: P_M,
    hl: ['Budget 4K with IBIS', '4K Photo mode'],
  }),
  cam({
    id: 'panasonic-gh5', brand: 'Panasonic', model: 'Lumix GH5', year: 2017, price: 1999, mount: 'Micro Four Thirds', type: 'Mirrorless', seg: 'Video pro',
    s: ['Micro Four Thirds', 20.3, 'Live MOS (no low-pass filter)'], iso: [200, 25600, '100–25,600'], fps: [12, 60], pre: true, sh: '1/8000',
    af: [DFD, 225, 62, OLD], vaf: 55, ibis: 5,
    v: { log: ['V-Log L (paid upgrade)', 'HLG'], codecs: ['ALL-I 400 Mbps (fw)', 'MOV / MP4', 'AVCHD'], bit: 10, ch: '4:2:2', unl: true, rec: 'Unlimited', m: [`C4K / 4K UHD|${DCI}|${R.cine}|1|10:422|Full sensor width`, `C4K / 4K UHD|${DCI}|50,60|1|8:420`, `6K Anamorphic (4:3)|4992x3744|${R.cine}|1|10:420|Firmware 2.0`, `Full HD|${FHD}|${R.all60}|1|10:422`, `Full HD VFR|${FHD}|${R.hi},150,180|1|8:420|Slow motion`] },
    vf: 'EVF 3.68 0.76', scr: '3.2" 1.62M-dot vari-angle touch', g: 725, seal: true, slots: ['SD UHS-II', 'SD UHS-II'], bat: 'DMW-BLF19', ports: P,
    hl: ['10-bit 4:2:2 internally in 2017', 'Unlimited recording'],
  }),
  cam({
    id: 'panasonic-g9', brand: 'Panasonic', model: 'Lumix G9', year: 2017, price: 1699, mount: 'Micro Four Thirds', type: 'Mirrorless', seg: 'Stills / wildlife',
    s: ['Micro Four Thirds', 20.3, 'Live MOS (no low-pass filter)'], iso: [200, 25600, '100–25,600'], fps: [12, 60], pre: true, sh: '1/8000', shift: 80,
    af: [DFD, 225, 66, OLD], vaf: 55, ibis: 6.5,
    v: { log: ['V-Log L (paid upgrade)', 'HLG'], codecs: ['MOV / MP4', 'AVCHD'], rec: '29:59 / unlimited (firmware)', m: [`C4K / 4K UHD|${DCI}|${R.all60}|1`, `Full HD|${FHD}|${R.all60}`, `Full HD VFR|${FHD}|${R.hi},150,180|1||Slow motion`] },
    vf: 'EVF 3.68 0.83', scr: '3.0" 1.04M-dot vari-angle touch', g: 658, seal: true, slots: ['SD UHS-II', 'SD UHS-II'], bat: 'DMW-BLF19', ports: P,
    hl: ['80MP high-res mode', '60 fps bursts'],
  }),
  cam({
    id: 'panasonic-gh5s', brand: 'Panasonic', model: 'Lumix GH5S', year: 2018, price: 2499, mount: 'Micro Four Thirds', type: 'Mirrorless', seg: 'Video pro',
    s: ['Micro Four Thirds', 10.2, 'Multi-aspect Live MOS (Dual Native ISO)', 1.9], iso: [160, 51200, '80–204,800'], fps: [12, 12], sh: '1/8000',
    af: [DFD, 225, 60, OLD], vaf: 55,
    v: { log: ['V-Log L', 'HLG'], codecs: ['ALL-I 400 Mbps', 'MOV / MP4'], bit: 10, ch: '4:2:2', unl: true, rec: 'Unlimited', m: [`C4K / 4K UHD|${DCI}|${R.cine}|1|10:422`, `C4K / 4K UHD|${DCI}|50,60|1|10:420`, `Full HD|${FHD}|${R.all60}|1|10:422`, `Full HD VFR|${FHD}|${R.hi},150,180,200,240|1||Slow motion`] },
    vf: 'EVF 3.68 0.76', scr: '3.2" 1.62M-dot vari-angle touch', g: 660, seal: true, slots: ['SD UHS-II', 'SD UHS-II'], bat: 'DMW-BLF19', ports: [...P, 'Timecode in/out'],
    hl: ['Low-light GH with timecode', 'No IBIS'],
  }),
  cam({
    id: 'panasonic-s1', brand: 'Panasonic', model: 'Lumix S1', year: 2019, price: 2499, mount: 'L-Mount', type: 'Mirrorless', seg: 'Full frame hybrid',
    s: ['Full Frame', 24.2, 'CMOS'], iso: [100, 51200, '50–204,800'], fps: [9, 9], sh: '1/8000', shift: 96,
    af: [DFD, 225, 66, OLD], vaf: 55, ibis: 5.5,
    v: { log: ['V-Log (paid upgrade)', 'HLG'], codecs: ['H.265', 'H.264'], bit: 8, ch: '4:2:0', ext: '10-bit 4:2:2 over HDMI (with upgrade)', rec: '29:59 (4K60) / unlimited', m: [`4K UHD|${UHD}|${R.cine}|1|10:422|10-bit with paid upgrade`, `4K UHD|${UHD}|50,60|1.5|8:420|APS-C crop`, `Full HD|${FHD}|${R.all60}`, `Full HD VFR|${FHD}|${R.hi},150,180|1||Slow motion`] },
    vf: 'EVF 5.76 0.78', scr: '3.2" 2.1M-dot 3-way tilt touch', g: 1021, seal: true, slots: ['XQD / CFexpress B', 'SD UHS-II'], bat: 'DMW-BLJ31', ports: P,
    hl: ['Built like a tank, superb 5.76M EVF', 'Heavy; contrast AF'],
  }),
  cam({
    id: 'panasonic-s1r', brand: 'Panasonic', model: 'Lumix S1R', year: 2019, price: 3699, mount: 'L-Mount', type: 'Mirrorless', seg: 'High-res',
    s: ['Full Frame', 47.3, 'CMOS (no low-pass filter)'], iso: [100, 25600, '50–51,200'], fps: [9, 9], sh: '1/8000', shift: 187,
    af: [DFD, 225, 66, OLD], vaf: 52, ibis: 5.5,
    v: { log: ['HLG'], codecs: ['H.265', 'H.264'], rec: '29:59 per clip', m: [`4K UHD|${UHD}|${R.cine}|1`, `4K UHD|${UHD}|50,60|1.09`, `Full HD|${FHD}|${R.all60}`, `Full HD VFR|${FHD}|${R.hi},150,180|1||Slow motion`] },
    vf: 'EVF 5.76 0.78', scr: '3.2" 2.1M-dot 3-way tilt touch', g: 1016, seal: true, slots: ['XQD / CFexpress B', 'SD UHS-II'], bat: 'DMW-BLJ31', ports: P,
    hl: ['47MP + 187MP high-res mode', 'Stills-focused'],
  }),
  cam({
    id: 'panasonic-s1h', brand: 'Panasonic', model: 'Lumix S1H', year: 2019, price: 3999, mount: 'L-Mount', type: 'Mirrorless', seg: 'Cinema hybrid',
    s: ['Full Frame', 24.2, 'CMOS (Dual Native ISO)'], iso: [100, 51200, '50–204,800'], fps: [9, 9], sh: '1/8000',
    af: [DFD, 225, 66, OLD], vaf: 55, ibis: 6.5,
    v: { log: ['V-Log', 'HLG'], codecs: ['H.265', 'ALL-I H.264', 'MOV'], bit: 10, ch: '4:2:2', ext: '5.9K ProRes RAW / BRAW over HDMI', og: true, unl: true, rec: 'Unlimited (built-in fan)', m: [`6K (3:2)|5952x3968|${R.cine}|1|10:420|Open gate`, `5.9K|5888x3312|${R.cine}|1|10:420`, `C4K / 4K UHD|${DCI}|${R.cine}|1|10:422`, `C4K / 4K UHD|${DCI}|50,60|1.5||APS-C crop`, `Full HD|${FHD}|${R.all60}`, `Full HD VFR|${FHD}|${R.hi},150,180|1||Slow motion`] },
    vf: 'EVF 5.76 0.78', scr: '3.2" 2.33M-dot 3-way tilt touch', g: 1164, seal: true, slots: ['SD UHS-II', 'SD UHS-II'], bat: 'DMW-BLJ31', ports: [...P, 'Timecode'],
    hl: ['Netflix-approved mirrorless', '6K open gate + fan'],
  }),
  cam({
    id: 'panasonic-g100', brand: 'Panasonic', model: 'Lumix G100', year: 2020, price: 749, mount: 'Micro Four Thirds', type: 'Mirrorless', seg: 'Vlog', look: 'compact',
    s: ['Micro Four Thirds', 20.3, 'Live MOS'], iso: [200, 25600, '100–25,600'], fps: [10, 10],
    af: [DFD, 49, 54, ['Face / Eye']], vaf: 48,
    v: { log: ['V-Log L (firmware)'], codecs: ['MP4', 'AVCHD'], rec: '10 min (4K)', m: [`4K UHD|${UHD}|${R.cine}|1.26`, `Full HD|${FHD}|${R.all60}`, `Full HD VFR|${FHD}|${R.hi}|1||Slow motion`] },
    vf: 'EVF 3.68 0.73', scr: '3.0" 1.84M-dot vari-angle touch', g: 412, slots: ['SD UHS-I'], bat: 'DMW-BLG10', ports: ['Micro USB', 'Micro HDMI', 'Mic in', 'Wi-Fi', 'Bluetooth'],
    hl: ['OZO audio tracks voices', 'No IBIS, cropped 4K'],
  }),
  cam({
    id: 'panasonic-s5', brand: 'Panasonic', model: 'Lumix S5', year: 2020, price: 1999, mount: 'L-Mount', type: 'Mirrorless', seg: 'Video hybrid',
    s: ['Full Frame', 24.2, 'CMOS (Dual Native ISO)'], iso: [100, 51200, '50–204,800'], fps: [7, 7], sh: '1/8000', shift: 96,
    af: [DFD, 225, 66, OLD], vaf: 55, ibis: 5,
    v: { log: ['V-Log', 'HLG'], codecs: ['H.265', 'H.264'], bit: 10, ch: '4:2:2', ext: '5.9K ProRes RAW / BRAW over HDMI', rec: '30 min (4K60) / unlimited (4K30)', m: [`4K UHD / C4K|${DCI}|${R.cine}|1|10:422|Full width`, `4K UHD / C4K|${DCI}|50,60|1.5|10:420|APS-C crop`, `Full HD|${FHD}|${R.all60}`, `Full HD VFR|${FHD}|${R.hi},150,180|1||Slow motion`] },
    vf: 'EVF 2.36 0.74', scr: '3.0" 1.84M-dot vari-angle touch', g: 714, seal: true, slots: ['SD UHS-II', 'SD UHS-I'], bat: 'DMW-BLK22', ports: ['USB-C', 'Micro HDMI', 'Mic in', 'Headphone out', 'Wi-Fi', 'Bluetooth'],
    hl: ['V-Log full frame on a budget', 'Contrast AF can pulse'],
  }),
  cam({
    id: 'panasonic-gh5ii', brand: 'Panasonic', model: 'Lumix GH5 II', year: 2021, price: 1699, mount: 'Micro Four Thirds', type: 'Mirrorless', seg: 'Video / streaming',
    s: ['Micro Four Thirds', 20.3, 'Live MOS (AR-coated)'], iso: [200, 25600, '100–25,600'], fps: [12, 60], pre: true, sh: '1/8000',
    af: [DFD, 225, 64, OLD], vaf: 58, ibis: 6.5,
    v: { log: ['V-Log L', 'HLG'], codecs: ['ALL-I 400 Mbps', 'MOV / MP4'], bit: 10, ch: '4:2:2', unl: true, rec: 'Unlimited', m: [`C4K / 4K UHD|${DCI}|${R.cine}|1|10:422`, `C4K / 4K UHD|${DCI}|50,60|1|10:420`, `Full HD|${FHD}|${R.all60}|1|10:422`, `Full HD VFR|${FHD}|${R.hi},150,180|1||Slow motion`] },
    vf: 'EVF 3.68 0.76', scr: '3.0" 1.84M-dot vari-angle touch', g: 727, seal: true, slots: ['SD UHS-II', 'SD UHS-II'], bat: 'DMW-BLK22', ports: [...P, 'Wireless live streaming'],
    hl: ['V-Log L included + live streaming', '4K60 10-bit'],
  }),
  cam({
    id: 'panasonic-gh6', brand: 'Panasonic', model: 'Lumix GH6', year: 2022, price: 2199, mount: 'Micro Four Thirds', type: 'Mirrorless', seg: 'Video pro',
    s: ['Micro Four Thirds', 25.2, 'Live MOS (Dynamic Range Boost)'], iso: [100, 12800, '50–25,600'], fps: [14, 75], pre: true, sh: '1/32000 (e)', shift: 100,
    af: [DFD, 315, 68, OLD], vaf: 60, ibis: 7.5,
    v: { log: ['V-Log', 'HLG'], codecs: ['ProRes 422 HQ', 'ALL-I H.264', 'H.265'], bit: 10, ch: '4:2:2', ext: 'ProRes RAW / BRAW over HDMI (firmware)', og: true, unl: true, rec: 'Unlimited (built-in fan)', m: [`5.7K|5728x3024|${R.all60}|1|10:422|ProRes 422 HQ`, `5.8K Open Gate (4:3)|5760x4320|${R.cine}|1|10:420|Anamorphic-friendly`, `C4K / 4K UHD|${DCI}|${R.all60}|1|10:422`, `C4K / 4K UHD|${DCI}|${R.hi}|1|10:420`, `Full HD VFR|${FHD}|${R.fhd240},300|1|10:420|Up to 300 fps`] },
    vf: 'EVF 3.68 0.76', scr: '3.0" 1.84M-dot free-angle tilt touch', g: 823, seal: true, slots: ['CFexpress B', 'SD UHS-II'], bat: 'DMW-BLK22', ports: P,
    hl: ['Internal ProRes 5.7K60', 'Contrast AF'],
  }),
  cam({
    id: 'panasonic-s5ii', brand: 'Panasonic', model: 'Lumix S5II', year: 2023, price: 1999, mount: 'L-Mount', type: 'Mirrorless', seg: 'Video hybrid',
    s: ['Full Frame', 24.2, 'CMOS (Phase Hybrid AF)'], iso: [100, 51200, '50–204,800'], fps: [9, 30], pre: true, sh: '1/8000', shift: 96,
    af: ['Phase Hybrid AF', 779, 84, PANA], ibis: 6.5,
    v: { log: ['V-Log', 'HLG', 'REAL TIME LUT'], codecs: ['H.265', 'H.264'], bit: 10, ch: '4:2:2', og: true, unl: true, rec: 'Unlimited (built-in fan)', m: [`6K Open Gate (3:2)|5952x3968|${R.cine}|1|10:420`, `5.9K|5888x3312|${R.cine}|1|10:420`, `C4K / 4K UHD|${DCI}|${R.cine}|1|10:422|Full width`, `C4K / 4K UHD|${DCI}|50,60|1.5||APS-C crop`, `Full HD|${FHD}|${R.all60}`, `Full HD VFR|${FHD}|${R.hi},150,180|1||Slow motion`] },
    vf: 'EVF 3.68 0.78', scr: '3.0" 1.84M-dot vari-angle touch', g: 740, seal: true, slots: ['SD UHS-II', 'SD UHS-II'], bat: 'DMW-BLK22', ports: P,
    hl: ['Phase-detect AF finally', 'Unlimited recording with fan'],
  }),
  cam({
    id: 'panasonic-s5iix', brand: 'Panasonic', model: 'Lumix S5IIX', year: 2023, price: 2199, mount: 'L-Mount', type: 'Mirrorless', seg: 'Video hybrid',
    s: ['Full Frame', 24.2, 'CMOS (Phase Hybrid AF)'], iso: [100, 51200, '50–204,800'], fps: [9, 30], pre: true, sh: '1/8000', shift: 96,
    af: ['Phase Hybrid AF', 779, 84, PANA], ibis: 6.5,
    v: { log: ['V-Log', 'HLG', 'REAL TIME LUT'], codecs: ['ProRes 422 HQ', 'ProRes 422', 'ALL-I H.264', 'H.265'], bit: 10, ch: '4:2:2', ext: '5.9K ProRes RAW / BRAW over HDMI', og: true, unl: true, rec: 'Unlimited (built-in fan)', m: [`6K Open Gate (3:2)|5952x3968|${R.cine}|1|10:420`, `5.9K|5888x3312|${R.cine}|1`, `C4K / 4K UHD|${DCI}|${R.cine}|1||Full width`, `C4K / 4K UHD|${DCI}|50,60|1.5||APS-C crop`, `Full HD|${FHD}|${R.all60}`, `Full HD VFR|${FHD}|${R.hi},150,180|1||Slow motion`, `5.9K RAW (HDMI)|5888x3312|${R.cine}|1|12:raw:ext`] },
    vf: 'EVF 3.68 0.78', scr: '3.0" 1.84M-dot vari-angle touch', g: 740, seal: true, slots: ['SD UHS-II', 'SD UHS-II'], bat: 'DMW-BLK22', ports: ['USB-C (SSD recording)', 'Full-size HDMI', 'Mic in', 'Headphone out', 'Ethernet (via USB)', 'Wi-Fi', 'Bluetooth'],
    hl: ['ProRes straight to USB-C SSD', 'Best-value video full frame'],
  }),
  cam({
    id: 'panasonic-g9ii', brand: 'Panasonic', model: 'Lumix G9 II', year: 2023, price: 1899, mount: 'Micro Four Thirds', type: 'Mirrorless', seg: 'Wildlife / hybrid', verify: true,
    s: ['Micro Four Thirds', 25.2, 'CMOS (Phase Hybrid AF)'], iso: [100, 25600, '50–25,600'], fps: [10, 60], pre: true, sh: '1/32000 (e)', shift: 100,
    af: ['Phase Hybrid AF', 779, 85, PANA], ibis: 8,
    v: { log: ['V-Log', 'HLG', 'REAL TIME LUT'], codecs: ['ProRes 422 HQ', 'ALL-I H.264', 'H.265'], bit: 10, ch: '4:2:2', ext: 'ProRes RAW / BRAW over HDMI', og: true, rec: 'Thermal', m: [`5.8K Open Gate (4:3)|5760x4320|${R.cine}|1`, `5.7K|5728x3024|${R.all60}`, `C4K / 4K UHD|${DCI}|${R.all60},100,120|1`, `Full HD|${FHD}|${R.fhd240}`] },
    vf: 'EVF 3.68 0.8', scr: '3.0" 1.84M-dot vari-angle touch', g: 658, seal: true, slots: ['SD UHS-II', 'SD UHS-II'], bat: 'DMW-BLK22', ports: P,
    hl: ['60 fps with PDAF tracking', 'Internal ProRes, 8-stop IBIS'],
  }),
  cam({
    id: 'panasonic-gh7', brand: 'Panasonic', model: 'Lumix GH7', year: 2024, price: 2199, mount: 'Micro Four Thirds', type: 'Mirrorless', seg: 'Video pro',
    s: ['Micro Four Thirds', 25.2, 'BSI CMOS (Dual Gain)'], iso: [100, 25600, '50–25,600'], fps: [10, 75], pre: true, sh: '1/32000 (e)', shift: 100,
    af: ['Phase Hybrid AF', 779, 85, PANA], ibis: 7.5,
    v: { log: ['V-Log', 'HLG', 'REAL TIME LUT'], codecs: ['ProRes RAW', 'ProRes RAW HQ', 'ProRes 422 HQ', 'ALL-I H.264', 'H.265'], bit: 10, ch: '4:2:2', raw: '12-bit ProRes RAW (5.7K)', ext: 'BRAW over HDMI', og: true, unl: true, rec: 'Unlimited (built-in fan)', m: [`5.7K ProRes RAW|5728x3024|${R.all60}|1|12:raw`, `5.8K Open Gate (4:3)|5760x4320|${R.cine}|1||Anamorphic-friendly`, `C4K / 4K UHD|${DCI}|${R.all60},100,120|1`, `Full HD|${FHD}|${R.fhd240}`] },
    vf: 'EVF 3.68 0.76', scr: '3.0" 1.84M-dot free-angle tilt touch', g: 805, seal: true, slots: ['CFexpress B', 'SD UHS-II'], bat: 'DMW-BLK22', ports: ['USB-C (SSD recording)', 'Full-size HDMI', 'Mic in', 'Headphone out', '32-bit float audio (XLR2)', 'Wi-Fi', 'Bluetooth'],
    hl: ['Internal ProRes RAW + 32-bit float audio', 'C4K120 full sensor'],
  }),
  cam({
    id: 'panasonic-s9', brand: 'Panasonic', model: 'Lumix S9', year: 2024, price: 1499, mount: 'L-Mount', type: 'Mirrorless', seg: 'Vlog full frame', look: 'compact',
    s: ['Full Frame', 24.2, 'CMOS (Phase Hybrid AF)'], iso: [100, 51200, '50–204,800'], fps: [null, 30], pre: true, noMech: true, sh: '1/8000 (e)',
    af: ['Phase Hybrid AF', 779, 83, PANA], ibis: 5,
    v: { log: ['V-Log', 'REAL TIME LUT'], codecs: ['H.265', 'H.264'], bit: 10, ch: '4:2:2', og: true, rec: 'Thermal (no fan)', m: [`6K Open Gate (3:2)|5952x3968|${R.cine}|1|10:420`, `4K UHD|${UHD}|${R.cine}|1||Full width`, `C4K / 4K UHD|${DCI}|50,60|1.5||APS-C crop`, `Full HD|${FHD}|${R.fhd120}`] },
    scr: '3.0" 1.84M-dot flip touch', g: 486, slots: ['SD UHS-II'], bat: 'DMW-BLK22 compatible', ports: ['USB-C (SSD recording)', 'Micro HDMI', 'Mic in', 'Wi-Fi', 'Bluetooth'],
    hl: ['Tiny full frame for creators', 'No EVF, no mechanical shutter'],
  }),
];
