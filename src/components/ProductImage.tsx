import type { Camera, Drone, Product } from '../data/types';

import { useEffect, useState } from 'react';
import { allSets, usePhotoSets, type PhotoSet } from '../lib/photoStore';
export type { PhotoSet };

// Manual overrides: drop src/assets/photos/<product-id>.(jpg|png|webp) to replace the main photo.
const local = import.meta.glob('../assets/photos/*.{jpg,jpeg,png,webp}', { eager: true, import: 'default' }) as Record<string, string>;
const localFor = (id: string) => {
  const key = Object.keys(local).find((p) => p.split('/').pop()!.replace(/\.\w+$/, '') === id);
  return key ? local[key] : undefined;
};

export const photosFor = (id: string): string[] => {
  const l = localFor(id);
  const set = allSets()[id]?.files ?? [];
  return l ? [l, ...set] : set;
};
export const creditFor = (id: string): PhotoSet | undefined => allSets()[id];

/**
 * Product photo. Hovering cycles through every angle (front, side, back…) like a retailer gallery.
 * `index` lets a parent (detail gallery) pick the angle.
 */
export function ProductImage({ product, size = 'md', index, cycle = true }: { product: Product; size?: 'sm' | 'md' | 'lg'; index?: number; cycle?: boolean }) {
  usePhotoSets();
  const files = photosFor(product.id);
  const [i, setI] = useState(0);
  const [hover, setHover] = useState(false);
  const [warm, setWarm] = useState(false); // load extra angles only once someone hovers
  const [broken, setBroken] = useState<Record<string, true>>({});
  const ok = files.map((f) => (broken[f] ? null : f));
  const shown = index ?? i;

  useEffect(() => {
    if (!hover || !cycle || files.length < 2) {
      setI(0);
      return;
    }
    setI(1);
    const t = setInterval(() => setI((x) => (x + 1) % files.length), 750);
    return () => clearInterval(t);
  }, [hover, cycle, files.length]);

  if (!ok.some(Boolean))
    return (
      <div className={`pimg pimg-${size}`}>
        {product.kind === 'camera' ? <CameraArt c={product} /> : product.kind === 'drone' ? <DroneArt d={product} /> : <GimbalArt phone={product.cls === 'Phone'} label={product.short} brand={product.brand} />}
      </div>
    );

  return (
    <div
      className={`pimg pimg-${size} has-photo ${hover && files.length > 1 ? 'cycling' : ''}`}
      onMouseEnter={() => {
        setWarm(true);
        setHover(true);
      }}
      onMouseLeave={() => setHover(false)}
    >
      {ok.map((f, k) =>
        f && (k === 0 || warm || index != null) ? (
          <img referrerPolicy="no-referrer"
            key={f}
            src={f}
            alt={`${product.brand} ${product.model}${k ? ` — view ${k + 1}` : ''}`}
            className={k === shown ? 'on' : ''}
            loading={k === 0 ? 'lazy' : 'eager'}
            decoding="async"
            onError={() => setBroken((b) => ({ ...b, [f]: true }))}
          />
        ) : null,
      )}
      {files.length > 1 && size !== 'sm' && (
        <div className="pimg-dots" aria-hidden>
          {files.map((f, k) => (
            <span key={f} className={k === shown ? 'on' : ''} />
          ))}
        </div>
      )}
    </div>
  );
}

const ACCENT: Record<string, string> = {
  Sony: '#e8702a',
  Canon: '#d0021b',
  Nikon: '#f5c400',
  Fujifilm: '#2fb36c',
  Panasonic: '#3a7bd5',
};

function CameraArt({ c }: { c: Camera }) {
  const accent = ACCENT[c.brand] ?? '#888';
  const uid = c.id;
  const retro = c.look === 'retro' || (c.brand === 'Fujifilm' && c.look === 'rangefinder');
  const cinema = c.look === 'cinema' || c.look === 'cinema-box';
  const compact = c.look === 'compact';
  const pro = c.look === 'pro' || c.look === 'dslr-pro';
  const medium = c.look === 'medium' || c.look === 'bridge';
  const rangefinder = c.look === 'rangefinder';

  const bx = compact ? 60 : 40;
  const bw = compact ? 200 : 240;
  const by = 78;
  const bh = pro ? 150 : compact ? 96 : 108;
  const lensCx = compact ? 182 : 190;
  const lensCy = by + (pro ? 60 : bh / 2 + 4);
  const lensR = medium ? 56 : compact ? 40 : 50;
  const fixedLens = c.mount.startsWith('Fixed');
  const body = cinema ? '#26292e' : '#1c1e22';

  return (
    <svg viewBox="0 0 320 250" role="img" aria-label={`${c.brand} ${c.model} illustration`}>
      <defs>
        <linearGradient id={`b-${uid}`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor={retro ? '#d7dadf' : '#3a3e45'} />
          <stop offset="1" stopColor={retro ? '#9fa4ab' : '#24272c'} />
        </linearGradient>
        <radialGradient id={`g-${uid}`} cx="0.38" cy="0.35" r="0.75">
          <stop offset="0" stopColor="#6b7cff" stopOpacity="0.85" />
          <stop offset="0.35" stopColor="#1d2240" />
          <stop offset="0.8" stopColor="#07080d" />
          <stop offset="1" stopColor="#000" />
        </radialGradient>
        <linearGradient id={`t-${uid}`} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#2d3036" />
          <stop offset="1" stopColor="#141518" />
        </linearGradient>
      </defs>

      <ellipse cx="160" cy="236" rx="120" ry="7" fill="#000" opacity="0.35" />

      {/* EVF hump / top plate */}
      {!compact && !cinema && !rangefinder && (
        <path
          d={`M${lensCx - 42} ${by + 2} L${lensCx - 30} ${by - 30} L${lensCx + 30} ${by - 30} L${lensCx + 42} ${by + 2} Z`}
          fill={retro ? `url(#b-${uid})` : body}
          stroke="#000"
          strokeOpacity="0.4"
        />
      )}
      {retro && (
        <>
          <rect x={bx + 20} y={by - 16} width="34" height="16" rx="3" fill="#b9bdc3" stroke="#6d7177" />
          <rect x={bx + bw - 64} y={by - 16} width="34" height="16" rx="3" fill="#b9bdc3" stroke="#6d7177" />
          {[0, 1, 2, 3, 4, 5].map((i) => (
            <line key={i} x1={bx + 24 + i * 5} y1={by - 14} x2={bx + 24 + i * 5} y2={by - 2} stroke="#6d7177" />
          ))}
        </>
      )}
      {!retro && !cinema && (
        <rect x={bx + bw - 70} y={by - 10} width="40" height="10" rx="3" fill="#2b2e33" stroke="#000" strokeOpacity="0.5" />
      )}
      {cinema && (
        <>
          <rect x={bx + 30} y={by - 22} width={bw - 60} height="10" rx="4" fill="#2e3136" />
          <rect x={bx + 40} y={by - 14} width="10" height="14" fill="#2e3136" />
          <rect x={bx + bw - 50} y={by - 14} width="10" height="14" fill="#2e3136" />
        </>
      )}

      {/* Body */}
      <rect x={bx} y={by} width={bw} height={bh} rx={cinema ? 8 : 16} fill={body} stroke="#000" strokeOpacity="0.5" />
      {retro && <rect x={bx} y={by} width={bw} height="26" rx="12" fill={`url(#b-${uid})`} />}
      {/* leatherette texture */}
      <rect x={bx + 6} y={by + (retro ? 30 : 10)} width={bw - 12} height={bh - (retro ? 36 : 16)} rx="10" fill={`url(#t-${uid})`} opacity="0.7" />

      {/* Grip */}
      {!retro && !compact && (
        <rect x={bx - 6} y={by + 4} width="64" height={bh - 8} rx="18" fill="#17181b" stroke="#000" strokeOpacity="0.6" />
      )}
      {pro && <rect x={bx} y={by + bh - 50} width={bw} height="46" rx="10" fill="#16171a" />}
      {c.brand === 'Nikon' && !retro && <path d={`M${bx + 2} ${by + 24} l14 -10 l3 4 l-14 10 z`} fill={accent} />}

      {/* Rangefinder window */}
      {rangefinder && (
        <rect x={bx + 18} y={by + 14} width="34" height="22" rx="3" fill="#0b0c10" stroke="#555" />
      )}
      {cinema &&
        [0, 1, 2, 3, 4, 5, 6].map((i) => (
          <rect key={i} x={bx + 14} y={by + 20 + i * 10} width="26" height="4" rx="2" fill="#0d0e10" />
        ))}

      {/* Lens */}
      <circle cx={lensCx} cy={lensCy} r={lensR + 8} fill="#0f1012" />
      <circle cx={lensCx} cy={lensCy} r={lensR + 4} fill="none" stroke="#b9bec6" strokeWidth="3" />
      {c.brand === 'Canon' && <circle cx={lensCx} cy={lensCy} r={lensR + 1} fill="none" stroke={accent} strokeWidth="2" />}
      {c.brand === 'Sony' && c.segment !== 'Vlog' && (
        <circle cx={lensCx} cy={lensCy} r={lensR + 1} fill="none" stroke={accent} strokeWidth="1.2" />
      )}
      <circle cx={lensCx} cy={lensCy} r={lensR - 2} fill="#141519" />
      {Array.from({ length: 24 }).map((_, i) => {
        const a = (i / 24) * Math.PI * 2;
        return (
          <line
            key={i}
            x1={lensCx + Math.cos(a) * (lensR - 6)}
            y1={lensCy + Math.sin(a) * (lensR - 6)}
            x2={lensCx + Math.cos(a) * (lensR - 1)}
            y2={lensCy + Math.sin(a) * (lensR - 1)}
            stroke="#2a2c31"
            strokeWidth="2"
          />
        );
      })}
      <circle cx={lensCx} cy={lensCy} r={lensR * 0.66} fill={`url(#g-${uid})`} stroke="#000" />
      <circle cx={lensCx} cy={lensCy} r={lensR * 0.3} fill="none" stroke="#5a64c7" strokeOpacity="0.35" />
      <ellipse cx={lensCx - lensR * 0.22} cy={lensCy - lensR * 0.25} rx={lensR * 0.16} ry={lensR * 0.09} fill="#fff" opacity="0.55" transform={`rotate(-30 ${lensCx} ${lensCy})`} />
      {fixedLens && <circle cx={lensCx} cy={lensCy} r={lensR + 8} fill="none" stroke="#c9ccd1" strokeWidth="2" />}

      {/* Details */}
      <circle cx={bx + bw - 22} cy={by + 18} r="4" fill={c.brand === 'Panasonic' || cinema ? '#d33' : '#333'} />
      <text x={bx + bw - 14} y={by + bh - 10} textAnchor="end" fontSize="11" fontFamily="system-ui, sans-serif" fontWeight="700" fill={retro ? '#e9ebee' : '#c7cbd1'} letterSpacing="0.5">
        {c.short}
      </text>
      <text x={bx + (retro ? 72 : 70)} y={by + (retro ? 18 : 22)} fontSize="10" fontFamily="system-ui, sans-serif" fontWeight="800" fill={retro ? '#2b2e33' : '#9aa0a8'} letterSpacing="2">
        {c.brand.toUpperCase()}
      </text>
    </svg>
  );
}

function DroneArt({ d }: { d: Drone }) {
  const uid = d.id;
  const look = d.look;
  const scale = look === 'inspire' ? 1.12 : look === 'mini' || look === 'flip' ? 0.82 : look === 'air' ? 0.92 : 1;
  const color = look === 'fpv' || look === 'inspire' ? '#2b2e33' : look === 'phantom' ? '#d9dce0' : '#8b9198';
  const armEnds: [number, number][] = [
    [-92, -62],
    [92, -62],
    [-92, 62],
    [92, 62],
  ];
  const propR = look === 'fpv' ? 34 : look === 'flip' ? 40 : 40;

  return (
    <svg viewBox="0 0 320 250" role="img" aria-label={`${d.brand} ${d.model} illustration`}>
      <defs>
        <radialGradient id={`p-${uid}`}>
          <stop offset="0" stopColor="#fff" stopOpacity="0.12" />
          <stop offset="1" stopColor="#fff" stopOpacity="0.03" />
        </radialGradient>
        <linearGradient id={`d-${uid}`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor={look === 'fpv' || look === 'inspire' ? '#3b3f46' : '#b4b9bf'} />
          <stop offset="1" stopColor={color} />
        </linearGradient>
      </defs>
      <ellipse cx="160" cy="236" rx="110" ry="6" fill="#000" opacity="0.3" />
      <g transform={`translate(160 122) scale(${scale})`}>
        {armEnds.map(([x, y], i) => (
          <g key={i}>
            <line x1="0" y1="0" x2={x} y2={y} stroke={color} strokeWidth={look === 'inspire' ? 12 : 9} strokeLinecap="round" />
            <circle cx={x} cy={y} r={propR} fill={`url(#p-${uid})`} stroke="#fff" strokeOpacity="0.12" />
            {(look === 'fpv' || look === 'flip') && <circle cx={x} cy={y} r={propR + 4} fill="none" stroke={look === 'flip' ? '#9aa0a8' : '#33363c'} strokeWidth="5" />}
            <line x1={x - propR + 4} y1={y + 6} x2={x + propR - 4} y2={y - 6} stroke="#d5d9de" strokeOpacity="0.35" strokeWidth="5" strokeLinecap="round" />
            <circle cx={x} cy={y} r="7" fill="#1d1f23" stroke="#555" />
          </g>
        ))}
        {look === 'inspire' && <path d="M-60 40 L-80 95 M60 40 L80 95 M-95 95 L-65 95 M65 95 L95 95" stroke="#202226" strokeWidth="6" strokeLinecap="round" />}
        <rect x="-34" y="-58" width="68" height="116" rx="26" fill={`url(#d-${uid})`} stroke="#000" strokeOpacity="0.35" />
        <rect x="-20" y="-36" width="40" height="56" rx="12" fill="#000" opacity="0.12" />
        {/* camera / gimbal */}
        <g transform="translate(0 -66)">
          <rect x={-10 - d.cameras.length * 6} y="-14" width={20 + d.cameras.length * 12} height="26" rx="8" fill="#1a1c20" />
          {d.cameras.map((c, i) => {
            const n = d.cameras.length;
            const cx = (i - (n - 1) / 2) * 15;
            const r = i === 0 ? 8 : 5;
            return (
              <g key={i}>
                <circle cx={cx} cy="-1" r={r} fill="#06070a" stroke="#666" />
                <circle cx={cx - r * 0.3} cy={-1 - r * 0.3} r={r * 0.3} fill="#7b86ff" opacity="0.7" />
              </g>
            );
          })}
        </g>
        <circle cx="-14" cy="40" r="3" fill="#2fd27a" />
        <circle cx="14" cy="40" r="3" fill="#e5484d" />
      </g>
      <text x="300" y="232" textAnchor="end" fontSize="11" fontFamily="system-ui, sans-serif" fontWeight="700" fill="#9aa0a8">
        {d.short}
      </text>
    </svg>
  );
}

function GimbalArt({ phone, label, brand }: { phone: boolean; label: string; brand: string }) {
  const accent = brand === 'Zhiyun' ? '#e60012' : '#9aa5b1';
  return (
    <svg viewBox="0 0 320 250" role="img" aria-label={`${label} illustration`}>
      <ellipse cx="160" cy="238" rx="70" ry="6" fill="#000" opacity="0.3" />
      {/* handle */}
      <rect x="146" y="150" width="28" height="84" rx="12" fill="#1d1f23" />
      <rect x="150" y="160" width="20" height="10" rx="3" fill={accent} opacity="0.85" />
      <circle cx="160" cy="185" r="6" fill="#2d3036" stroke="#555" />
      {/* pan + roll arms */}
      <rect x="150" y="122" width="20" height="32" rx="6" fill="#2a2d33" />
      <path d="M160 126 L222 126 L222 70" stroke="#2a2d33" strokeWidth="16" fill="none" strokeLinecap="round" strokeLinejoin="round" />
      <circle cx="222" cy="70" r="13" fill="#33363c" />
      <path d="M222 70 L222 46 L120 46" stroke="#2a2d33" strokeWidth="12" fill="none" strokeLinecap="round" strokeLinejoin="round" />
      {phone ? (
        <g>
          <rect x="88" y="54" width="120" height="58" rx="10" fill="#0b0c10" stroke="#3b3f46" strokeWidth="3" />
          <circle cx="106" cy="83" r="7" fill="#1d2240" stroke="#555" />
        </g>
      ) : (
        <g>
          <rect x="90" y="52" width="104" height="62" rx="10" fill="#1c1e22" stroke="#000" />
          <rect x="114" y="42" width="34" height="14" rx="4" fill="#1c1e22" />
          <circle cx="132" cy="84" r="25" fill="#0f1012" />
          <circle cx="132" cy="84" r="16" fill="#1d2240" stroke="#000" />
          <circle cx="127" cy="79" r="4" fill="#fff" opacity="0.5" />
        </g>
      )}
      <text x="300" y="232" textAnchor="end" fontSize="11" fontFamily="system-ui, sans-serif" fontWeight="700" fill="#6b7280">
        {label}
      </text>
    </svg>
  );
}
