import { useLayoutEffect, useRef, useState } from 'react';
import { byId, sectionOf, type Section } from './data';
import { go, useRoute } from './components/Bits';
import { Browse } from './components/Browse';
import { Detail } from './components/Detail';
import { Versus } from './components/Versus';
import { Kits } from './components/Kits';
import { Finder } from './components/Finder';
import { Home } from './components/Home';
import { Page } from './components/Page';
import { Chrome } from './components/Chrome';
import { ProductImage } from './components/ProductImage';

const NAV: [string, string][] = [
  ['cameras', 'Cameras'],
  ['action', 'Action & 360'],
  ['drones', 'Drones'],
  ['gimbals', 'Gimbals'],
  ['kits', 'Gear paths'],
  ['finder', 'Finder'],
  ['vs', 'Versus'],
];

function Nav({ active }: { active: string }) {
  const wrap = useRef<HTMLElement>(null);
  const [pill, setPill] = useState({ x: 0, w: 0 });
  useLayoutEffect(() => {
    const el = wrap.current?.querySelector<HTMLButtonElement>(`[data-k="${active}"]`);
    setPill(el ? { x: el.offsetLeft, w: el.offsetWidth } : { x: 0, w: 0 });
    // on phones the menu scrolls sideways: bring the current page's button into view
    const nav = wrap.current;
    if (el && nav && nav.scrollWidth > nav.clientWidth) nav.scrollTo({ left: el.offsetLeft - (nav.clientWidth - el.offsetWidth) / 2, behavior: 'smooth' });
  }, [active]);
  return (
    <nav ref={wrap}>
      <span className="nav-pill" style={{ transform: `translateX(${pill.x}px)`, width: pill.w }} />
      {NAV.map(([k, l]) => (
        <button key={k} data-k={k} className={active === k ? 'on' : ''} onClick={() => go(`/${k}`)}>
          {l}
        </button>
      ))}
    </nav>
  );
}

export default function App() {
  const route = useRoute();
  const [compare, setCompare] = useState<string[]>([]);

  const toggleCompare = (id: string) =>
    setCompare((cur) => {
      if (cur.includes(id)) return cur.filter((x) => x !== id);
      const p = byId(id)!;
      const same = cur.filter((x) => byId(x)?.kind === p.kind);
      return [...same, id].slice(-4);
    });

  const [page, x, y] = route;
  const sections: Section[] = ['cameras', 'action', 'drones', 'gimbals'];
  let content;
  let active = 'cameras';
  if (page === 'p' && byId(x)) {
    content = <Detail product={byId(x)!} compare={compare} toggleCompare={toggleCompare} />;
    active = sectionOf(byId(x)!);
  } else if (page === 'vs') {
    content = <Versus slots={route.slice(1, 5).map((id) => byId(id))} />;
    active = 'vs';
  } else if (page === 'home' || page === '') {
    content = <Home />;
    active = 'home';
  } else if (page === 'kits') {
    content = <Kits track={x} tier={y} />;
    active = 'kits';
  } else if (page === 'finder') {
    content = <Finder />;
    active = 'finder';
  } else {
    const s = (sections.includes(page as Section) ? page : 'cameras') as Section;
    content = <Browse key={s} section={s} compare={compare} toggleCompare={toggleCompare} />;
    active = s;
  }
  const picked = compare.map((id) => byId(id)!).filter(Boolean);

  return (
    <>
      <div className="aurora" aria-hidden>
        <span className="a1" />
        <span className="a2" />
        <span className="a3" />
        <span className="a4" />
      </div>
      <div className="app">
        <header className="top">
          <button className="logo" onClick={() => go('/home')}>
            <span className="logo-mark" aria-hidden>
              <span className="aperture" />
            </span>
            Spec<span className="grad">Shootout</span>
          </button>
          <div className="top-right">
            <Nav active={active} />
          </div>
        </header>

        <Page key={route.join('/')}>{content}</Page>
        <Chrome routeKey={route.join('/')} />

        {picked.length > 0 && page !== 'vs' && (
          <div className="tray">
            {picked.map((p) => (
              <div key={p.id} className="tray-item">
                <ProductImage product={p} size="sm" />
                <span>{p.model}</span>
                <button aria-label="Remove" onClick={() => toggleCompare(p.id)}>
                  ×
                </button>
              </div>
            ))}
            {picked.length < 2 && <span className="muted small">Pick one more {picked[0].kind}</span>}
            <button
              className="btn"
              disabled={picked.length < 2}
              onClick={() => {
                // the picks travel to Versus in the URL; clear the ticks so the list starts fresh next time
                go(`/vs/${picked.map((p) => p.id).join('/')}`);
                setCompare([]);
              }}
            >
              Compare →
            </button>
          </div>
        )}

        <footer>
          Specs compiled from manufacturer data at launch; firmware updates can add features. Scores use this app’s own formula — open any product to see the weights. Photos
          are credited on each product page. Always confirm with the manufacturer before buying.
        </footer>
      </div>
    </>
  );
}
