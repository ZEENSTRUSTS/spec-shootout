import { useState } from 'react';
import logos from '../data/logoCredits.json';

const LOGOS = logos as Record<string, { file: string }>;

export const BRAND_COLOR: Record<string, string> = {
  Canon: '#e0201b',
  Sony: '#f2f2f2',
  Nikon: '#ffd400',
  Fujifilm: '#2fb36c',
  Panasonic: '#3b82f6',
  DJI: '#9fb3c8',
  GoPro: '#00a8e1',
  Insta360: '#ffcc33',
  Zhiyun: '#ff3b3b',
  Moza: '#e8e8e8',
  FeiyuTech: '#ff7a1a',
  Hohem: '#22c3e6',
};

export const BRAND_TAGLINE: Record<string, string> = {
  Canon: 'From the 60D that started DSLR filmmaking to the Cinema EOS line.',
  Sony: 'The brand that made full-frame mirrorless mainstream — Alpha, FX and RX.',
  Nikon: 'Legendary F-mount DSLRs through to the Z-mount and RED-powered cinema.',
  Fujifilm: 'Film simulations, real dials and medium format GFX.',
  Panasonic: 'Lumix: the video-first GH line and full-frame L-mount.',
  DJI: 'Drones, pocket gimbal cameras, action cams and Ronin gimbals.',
  GoPro: 'The action camera that defined the category.',
  Insta360: '360° and action cameras built for reframing, plus Flow phone gimbals.',
  Zhiyun: 'Crane, Weebill and Smooth gimbals for cameras and phones.',
  Moza: 'Air and AirCross camera gimbals plus Mini phone gimbals.',
  FeiyuTech: 'Budget-friendly AK and SCORP camera gimbals and Vimble phone gimbals.',
  Hohem: 'iSteady phone and camera gimbals with built-in AI tracking.',
};

/** Brand logo (white on dark) with a styled wordmark fallback if the SVG is missing. */
export function BrandLogo({ brand, size = 'md' }: { brand: string; size?: 'sm' | 'md' | 'xl' }) {
  const [failed, setFailed] = useState(false);
  const src = LOGOS[brand]?.file;
  if (!src || failed)
    return (
      <span className={`wordmark wordmark-${size}`} style={{ ['--brand' as string]: BRAND_COLOR[brand] }}>
        {brand}
      </span>
    );
  return <img className={`logo-img logo-${size}`} src={src} alt={`${brand} logo`} onError={() => setFailed(true)} />;
}
