import { forwardRef, useEffect, useState } from 'react';
import type { Filmable, Product } from '../data/types';
import { scoresFor } from '../lib/scoring';
import { money, specFor } from '../lib/specRows';
import { verdict, type Priority } from '../lib/verdict';
import { inlineImage } from '../lib/exporter';
import { DuelMatrix, scoreRows, SIDES } from './Bits';
import { photosFor, ProductImage } from './ProductImage';

const PRIORITY_LABEL: Record<Priority, string> = { hybrid: 'All-round / hybrid', photo: 'Mostly photo', video: 'Mostly video', flight: 'Flying' };
const ROLE = ['You own', 'Considering', 'Also considering', 'Also considering'];

/** Print-ready comparison sheet, rendered off-screen and captured for PDF / JPEG export. */
export const VsReport = forwardRef<HTMLDivElement, { items: Product[]; priority: Priority; onReady: () => void }>(function VsReport({ items, priority, onReady }, ref) {
  const [imgs, setImgs] = useState<Record<string, string | null> | null>(null);

  useEffect(() => {
    let live = true;
    Promise.all(items.map(async (p) => [p.id, photosFor(p.id)[0] ? await inlineImage(photosFor(p.id)[0]) : null] as const)).then((e) => live && setImgs(Object.fromEntries(e)));
    return () => void (live = false);
  }, [items]);

  useEffect(() => {
    if (!imgs) return;
    // let the browser lay out and decode the inlined photos first
    const t = window.setTimeout(onReady, 350);
    return () => window.clearTimeout(t);
  }, [imgs, onReady]);

  const duo = items.length === 2;
  const v = duo ? verdict(items[0], items[1], priority) : null;
  const score = (p: Product) => {
    const s = scoresFor(p);
    return priority === 'photo' ? s.photo : priority === 'video' ? s.video : priority === 'flight' ? s.flight ?? s.overall : s.overall;
  };
  const ranked = [...items].sort((x, y) => score(y) - score(x));
  const filmable = items.every((p) => p.kind !== 'gimbal');
  const date = new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' });

  return (
    <div className="rp" ref={ref}>
      <header className="rp-head" data-block>
        <div className="rp-brand">
          <span className="logo-mark" aria-hidden>
            <span className="aperture" />
          </span>
          <b>
            Spec<span className="grad">Shootout</span>
          </b>
          <span className="rp-date">{date}</span>
        </div>
        <h1>{items.map((p) => p.model).join('  vs  ')}</h1>
        <p className="rp-sub">Comparison report · Priority: {PRIORITY_LABEL[priority]}</p>

        <div className={`rp-products n${items.length}`}>
          {items.map((p, i) => (
            <div key={p.id} className={`rp-prod side-${SIDES[i]}`}>
              <span className={`rp-role ${SIDES[i]}-text`}>{ROLE[i]}</span>
              <div className="rp-img">{imgs?.[p.id] ? <img src={imgs[p.id]!} alt="" /> : <ProductImage product={p} size="md" cycle={false} />}</div>
              <span className="rp-mute">{p.brand}</span>
              <b className="rp-model">{p.model}</b>
              <span className="rp-mute">
                {money(p.price)} at launch · {p.year}
              </span>
              <span className={`rp-overall ${SIDES[i]}-text`}>{score(p)}</span>
            </div>
          ))}
        </div>
      </header>

      {v ? (
        <section className={`rp-card rp-verdict v-${v.level}`} data-block>
          <div className="rp-vhead">
            <span className="rp-delta">
              {v.delta > 0 ? '+' : v.delta < 0 ? '−' : ''}
              {Math.abs(v.delta)}
            </span>
            <div>
              <h2>{v.title}</h2>
              <p>{v.summary}</p>
            </div>
          </div>
          <div className="rp-gl">
            <div>
              <h4>What you gain</h4>
              <ul className="gains">{v.gains.length ? v.gains.map((g) => <li key={g.text}>{g.text}</li>) : <li>Nothing significant.</li>}</ul>
            </div>
            <div>
              <h4>What you give up</h4>
              <ul className="losses">{v.losses.length ? v.losses.map((g) => <li key={g.text}>{g.text}</li>) : <li>Nothing — better or equal everywhere we measure.</li>}</ul>
            </div>
          </div>
          {v.notes.length > 0 && (
            <ul className="rp-notes">
              {v.notes.map((n) => (
                <li key={n}>{n}</li>
              ))}
            </ul>
          )}
        </section>
      ) : (
        <section className="rp-card" data-block>
          <h2>Ranking</h2>
          <ol className="rp-rank">
            {ranked.map((p, i) => {
              const s = SIDES[items.indexOf(p)];
              const rv = p !== items[0] ? verdict(items[0], p, priority) : null;
              return (
                <li key={p.id}>
                  <span className="rp-n">{i + 1}</span>
                  <div>
                    <b className={`${s}-text`}>{p.model}</b>
                    <div className="rp-mute">{rv ? `${rv.title}${rv.gains.length ? ' — ' + rv.gains.slice(0, 2).map((g) => g.text).join(' · ') : ''}` : 'What you own'}</div>
                  </div>
                  <span className="rp-score">{score(p)}</span>
                </li>
              );
            })}
          </ol>
        </section>
      )}

      <section className="rp-card" data-block>
        <h2>Scores</h2>
        <div className="rp-scores">
          {scoreRows(items[0]).map(([label], r) => {
            const vals = items.map((p) => scoreRows(p)[r]?.[1] ?? 0);
            const top = Math.max(...vals);
            return (
              <div key={label} className="rp-sgroup">
                <span className="rp-slabel">{label}</span>
                {items.map((p, i) => (
                  <div key={p.id} className="rp-srow">
                    <span className={`rp-sname ${SIDES[i]}-text`}>{p.model}</span>
                    <div className="rp-track">
                      <div className={`rp-fill ${SIDES[i]}`} style={{ width: `${vals[i]}%` }} />
                    </div>
                    <span className={`rp-sval ${vals[i] === top && vals.filter((x) => x === top).length === 1 ? 'win' : ''}`}>{vals[i]}</span>
                  </div>
                ))}
              </div>
            );
          })}
        </div>
      </section>

      {specFor(items[0]).map((g) => (
        <section key={g.group} className="rp-card rp-specs" data-block>
          <h2>{g.group}</h2>
          <table className={`rp-table n${items.length}`}>
            <thead>
              <tr>
                <th />
                {items.map((p, i) => (
                  <th key={p.id} className={`${SIDES[i]}-text`}>
                    {p.model}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {g.rows.map((r) => {
                const nums = items.map((p) => (r.num && r.better ? r.num(p) : null));
                const valid = nums.filter((n): n is number => n != null);
                let best: number | null = null;
                if (valid.length === items.length && new Set(valid).size > 1) {
                  const t = r.better === 'high' ? Math.max(...valid) : Math.min(...valid);
                  if (valid.filter((n) => n === t).length === 1) best = t;
                }
                return (
                  <tr key={r.label}>
                    <td className="rp-mute">{r.label}</td>
                    {items.map((p, i) => (
                      <td key={p.id} className={best != null && nums[i] === best ? 'win' : ''}>
                        {r.value(p)}
                      </td>
                    ))}
                  </tr>
                );
              })}
            </tbody>
          </table>
        </section>
      ))}

      {filmable && (
        <section className="rp-card" data-block>
          <h2>Frame-rate face-off</h2>
          <p className="rp-mute">Each cell, top to bottom: {items.map((p) => p.model).join(', ')} — can it record that resolution at that frame rate internally, and the crop if any.</p>
          <DuelMatrix items={items as Filmable[]} />
        </section>
      )}

      <footer className="rp-foot" data-block>
        Specs compiled from manufacturer data at launch; firmware updates can add features. Scores use Spec Shootout’s own formula. Always confirm with the manufacturer before
        buying.
      </footer>
    </div>
  );
});
