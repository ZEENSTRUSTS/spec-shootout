import { useEffect, useMemo, useRef, useState } from 'react';
import { products, sectionOf, SECTION_INFO, type Section } from '../data';
import type { Product } from '../data/types';
import { BOOKMARKLET } from '../lib/bookmarklet';
import { bhSearch, matchTitle, parseGrabbed, savePhotos, usePhotoSets, type Grabbed } from '../lib/photoStore';
import { go } from './Bits';
import { ProductImage } from './ProductImage';

type Filter = 'missing' | 'done' | 'all';

/** Reads the clipboard; falls back to a manual paste box when the browser refuses. */
async function readClipboard(): Promise<string | null> {
  try {
    return await navigator.clipboard.readText();
  } catch {
    return null;
  }
}

export function PhotoManager({ focusId }: { focusId?: string }) {
  const sets = usePhotoSets();
  const [filter, setFilter] = useState<Filter>('missing');
  const [section, setSection] = useState<Section | 'all'>('all');
  const [q, setQ] = useState('');
  const [grab, setGrab] = useState<Grabbed | null>(null);
  const [target, setTarget] = useState<string>('');
  const [manual, setManual] = useState(false);
  const [toast, setToast] = useState('');
  const [skip, setSkip] = useState<Record<string, boolean>>({});
  const bm = useRef<HTMLAnchorElement>(null);

  useEffect(() => {
    bm.current?.setAttribute('href', BOOKMARKLET); // set directly so React doesn't sanitise the javascript: URL
  }, []);

  const have = products.filter((p) => sets[p.id]?.files?.length).length;
  const list = useMemo(() => {
    const n = q.trim().toLowerCase();
    return products.filter((p) => {
      const has = !!sets[p.id]?.files?.length;
      if (filter === 'missing' && has) return false;
      if (filter === 'done' && !has) return false;
      if (section !== 'all' && sectionOf(p) !== section) return false;
      return !n || `${p.brand} ${p.model}`.toLowerCase().includes(n);
    });
  }, [sets, filter, section, q]);
  const nextMissing = products.find((p) => !sets[p.id]?.files?.length);

  const accept = (text: string, forId?: string) => {
    const g = parseGrabbed(text);
    if (!g) {
      flash('That isn’t a photo set — click the “Grab photos” bookmark on a product page first.');
      return;
    }
    setManual(false);
    setSkip({});
    setGrab(g);
    setTarget(forId ?? focusId ?? matchTitle(g.title)[0]?.id ?? '');
  };

  const paste = async (forId?: string) => {
    const text = await readClipboard();
    if (text == null) {
      setManual(true);
      if (forId) setTarget(forId);
      return;
    }
    accept(text, forId);
  };

  // Ctrl+V anywhere on this page also works
  useEffect(() => {
    const onPaste = (e: ClipboardEvent) => {
      const t = e.clipboardData?.getData('text');
      if (t && parseGrabbed(t)) {
        e.preventDefault();
        accept(t);
      }
    };
    window.addEventListener('paste', onPaste);
    return () => window.removeEventListener('paste', onPaste);
  });

  const flash = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(''), 3500);
  };

  const save = async () => {
    if (!grab || !target) return;
    const p = products.find((x) => x.id === target)!;
    const files = grab.files.filter((f) => !skip[f]);
    if (!files.length) return flash('Keep at least one photo.');
    const where = await savePhotos(target, { files, source: grab.source, page: grab.page, title: grab.title });
    setGrab(null);
    flash(`Saved ${files.length} photos to ${p.brand} ${p.model}${where === 'browser' ? ' (this browser only)' : ''}.`);
  };

  const matches = grab ? matchTitle(grab.title).slice(0, 6) : [];

  return (
    <section className="photo-mgr">
      <div className="hero">
        <div className="hero-glow" />
        <div className="hero-text">
          <span className="eyebrow">Photo manager</span>
          <h1>
            {have} of {products.length} <span className="grad">have real photos.</span>
          </h1>
          <div className="progress">
            <div style={{ width: `${(have / products.length) * 100}%` }} />
          </div>
        </div>
      </div>

      <div className="panel how">
        <ol>
          <li>
            <b>Install once:</b> drag this button to your favorites bar (Edge: <kbd>Ctrl</kbd>+<kbd>Shift</kbd>+<kbd>B</kbd> shows the bar) →{' '}
            <a ref={bm} className="bookmarklet" onClick={(e) => e.preventDefault()} title="Drag me to your favorites bar">
              📸 Grab photos
            </a>
          </li>
          <li>
            Open a product on B&amp;H with <b>Find on B&amp;H ↗</b> below (or on the brand’s own site) and click into the product page.
          </li>
          <li>
            Click <b>📸 Grab photos</b> in your favorites bar. It copies the front, side and back shots.
          </li>
          <li>
            Come back here and press <b>Paste</b> (or <kbd>Ctrl</kbd>+<kbd>V</kbd>). The product is matched automatically — check it and save.
          </li>
        </ol>
        <div className="how-actions">
          <button className="btn" onClick={() => paste()}>
            Paste photos
          </button>
          {nextMissing && (
            <a className="btn ghost" href={bhSearch(nextMissing)} target="_blank" rel="noreferrer">
              Next missing: {nextMissing.brand} {nextMissing.model} ↗
            </a>
          )}
        </div>
      </div>

      {manual && (
        <div className="panel paste-box">
          <p className="small muted">Your browser blocked reading the clipboard. Click in the box and press Ctrl+V:</p>
          <textarea autoFocus placeholder="Paste here…" onPaste={(e) => accept(e.clipboardData.getData('text'), target || undefined)} />
        </div>
      )}

      {grab && (
        <div className="panel grab-preview">
          <div className="grab-head">
            <div>
              <h3>{grab.title}</h3>
              <p className="small muted">
                {grab.files.length} photos from{' '}
                <a href={grab.page} target="_blank" rel="noreferrer">
                  {grab.source}
                </a>
              </p>
            </div>
            <button className="link" onClick={() => setGrab(null)}>
              Cancel
            </button>
          </div>
          <p className="small muted">Click a photo to leave it out. The first one is the front shot on cards.</p>
          <div className="grab-thumbs">
            {grab.files.map((f, i) => (
              <button key={f} className={`grab-thumb ${skip[f] ? 'off' : ''}`} onClick={() => setSkip((s) => ({ ...s, [f]: !s[f] }))} title={skip[f] ? 'Excluded — click to include' : 'Click to exclude'}>
                <img referrerPolicy="no-referrer" src={f} alt={`View ${i + 1}`} onError={() => setSkip((s) => ({ ...s, [f]: true }))} />
              </button>
            ))}
          </div>
          <div className="grab-save">
            <label>
              Save to
              <select value={target} onChange={(e) => setTarget(e.target.value)}>
                <option value="">Choose product…</option>
                {matches.length > 0 && (
                  <optgroup label="Best matches">
                    {matches.map((p) => (
                      <option key={p.id} value={p.id}>
                        {p.brand} {p.model}
                      </option>
                    ))}
                  </optgroup>
                )}
                <optgroup label="All products">
                  {products.map((p) => (
                    <option key={p.id} value={p.id}>
                      {p.brand} {p.model}
                    </option>
                  ))}
                </optgroup>
              </select>
            </label>
            <button className="btn" disabled={!target} onClick={save}>
              Save photos
            </button>
          </div>
          {!matches.length && <p className="small warn">No automatic match — pick the product yourself.</p>}
        </div>
      )}

      <div className="filterbar glass">
        <input className="search" placeholder="Search products…" value={q} onChange={(e) => setQ(e.target.value)} />
        <div className="seg">
          {(['missing', 'done', 'all'] as Filter[]).map((f) => (
            <button key={f} className={filter === f ? 'on' : ''} onClick={() => setFilter(f)}>
              {f === 'missing' ? `Missing (${products.length - have})` : f === 'done' ? `Has photos (${have})` : 'All'}
            </button>
          ))}
        </div>
        <div className="seg">
          {(['all', 'cameras', 'action', 'drones', 'gimbals'] as const).map((s) => (
            <button key={s} className={section === s ? 'on' : ''} onClick={() => setSection(s)}>
              {s === 'all' ? 'Everything' : SECTION_INFO[s].title}
            </button>
          ))}
        </div>
      </div>

      <div className="pm-list">
        {list.map((p) => (
          <Row key={p.id} p={p} n={sets[p.id]?.files?.length ?? 0} source={sets[p.id]?.source} focus={p.id === focusId} onPaste={() => paste(p.id)} />
        ))}
        {!list.length && <p className="muted">Nothing here.</p>}
      </div>

      {toast && <div className="toast">{toast}</div>}
    </section>
  );
}

function Row({ p, n, source, focus, onPaste }: { p: Product; n: number; source?: string; focus: boolean; onPaste: () => void }) {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (focus) ref.current?.scrollIntoView({ block: 'center' });
  }, [focus]);
  return (
    <div ref={ref} className={`pm-row ${focus ? 'focus' : ''}`}>
      <ProductImage product={p} size="sm" />
      <button className="pm-name" onClick={() => go(`/p/${p.id}`)}>
        <span className="brand">{p.brand}</span>
        <b>{p.model}</b>
      </button>
      <span className={`pm-status ${n ? 'ok' : ''}`}>{n ? `${n} photos · ${source}` : 'No photos'}</span>
      <a className="btn ghost sm" href={bhSearch(p)} target="_blank" rel="noreferrer">
        Find on B&amp;H ↗
      </a>
      <button className="btn sm" onClick={onPaste}>
        Paste here
      </button>
      {n > 0 && (
        <button className="link small" onClick={() => savePhotos(p.id, null)}>
          Remove
        </button>
      )}
    </div>
  );
}
