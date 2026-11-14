import { useRef, type ReactNode } from 'react';
import { direct } from '../lib/director';
import { DUR, EASE, gsap, reducedMotion, useGSAP } from '../lib/motion';

/**
 * Route container. Remounted per route (keyed in App): the page settles in, then the motion
 * director choreographs its content. Everything is reverted when the route changes.
 */
export function Page({ children }: { children: ReactNode }) {
  const ref = useRef<HTMLElement>(null);
  useGSAP(
    () => {
      if (reducedMotion() || !ref.current) return;
      gsap.fromTo(ref.current, { autoAlpha: 0 }, { autoAlpha: 1, duration: DUR.sm, ease: EASE.out, clearProps: 'opacity,visibility' });
      return direct(ref.current);
    },
    { scope: ref },
  );
  return (
    <main ref={ref} className="page">
      {children}
    </main>
  );
}
