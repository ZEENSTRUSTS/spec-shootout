import { useMemo, useRef, useState } from 'react';
import { findGear, tierFor, type Answers, type Goal } from '../lib/finder';
import { tierIcon, tierLabel } from '../data/kits';
import { money } from '../lib/specRows';
import { EASE, gsap, reducedMotion, useGSAP } from '../lib/motion';
import { go } from './Bits';
import { ProductImage } from './ProductImage';

type Opt<V> = { v: V; icon: string; label: string; sub?: string };
type Q = { key: keyof Answers; title: string; hint?: string; opts: Opt<unknown>[] };

const GOALS: Opt<Goal>[] = [
  { v: 'photo', icon: '📷', label: 'Photos', sub: 'Stills first, video is a bonus' },
  { v: 'video', icon: '🎬', label: 'Video', sub: 'Films, YouTube, client videos' },
  { v: 'hybrid', icon: '🔀', label: 'Hybrid shooter', sub: 'Photos and video — weddings, events, content' },
  { v: 'action', icon: '🎒', label: 'Action & POV', sub: 'GoPro-style, BTS, sport, travel' },
  { v: 'drone', icon: '🛸', label: 'From the sky', sub: 'Aerial photo and video' },
];

function budgets(goal: Goal): Opt<number>[] {
  const steps = goal === 'action' ? [250, 400, 600] : goal === 'drone' ? [500, 900, 1500, 3000] : [500, 1000, 2000, 4000];
  const o: Opt<number>[] = steps.map((b, i) => ({ v: b, icon: '💵'.repeat(Math.min(3, i + 1)), label: `Up to ${money(b)}`, sub: i === 0 ? 'Tight — used gear shines here' : undefined }));
  o.push({ v: Infinity, icon: '👑', label: 'No limit', sub: 'Show me the best' });
  return o;
}

function uses(goal: Goal): Opt<string>[] {
  if (goal === 'drone')
    return [
      { v: 'travel', icon: '🧳', label: 'Travel & holidays' },
      { v: 'landscape', icon: '🏔️', label: 'Landscapes & real estate' },
      { v: 'film', icon: '🎞️', label: 'Cinematic / paid work' },
      { v: 'sport', icon: '⚡', label: 'Fast chase shots' },
      { v: 'all', icon: '🌍', label: 'A bit of everything' },
    ];
  if (goal === 'action')
    return [
      { v: 'sport', icon: '🏄', label: 'Sport & extreme' },
      { v: 'vlog', icon: '🤳', label: 'Vlogging & BTS' },
      { v: 'travel', icon: '🧳', label: 'Travel memories' },
      { v: 'film', icon: '🎞️', label: 'Pro / broadcast' },
      { v: 'all', icon: '🌍', label: 'A bit of everything' },
    ];
  return [
    { v: 'people', icon: '🙂', label: 'People & portraits', sub: 'Weddings, family, fashion' },
    { v: 'sport', icon: '⚡', label: 'Sport & wildlife', sub: 'Fast subjects, long lenses' },
    { v: 'travel', icon: '🧳', label: 'Travel & street', sub: 'Light, always with you' },
    { v: 'vlog', icon: '🤳', label: 'Vlogging & content', sub: 'You’re in front of the lens' },
    { v: 'landscape', icon: '🏔️', label: 'Landscape & studio', sub: 'Detail, big prints' },
    { v: 'film', icon: '🎞️', label: 'Short films & music videos', sub: 'Log, RAW, grading' },
    { v: 'all', icon: '🌍', label: 'A bit of everything', sub: 'All-rounder: vlogs, people, landscapes, the odd bit of sport' },
  ];
}

function questions(a: Answers): Q[] {
  const goal = a.goal ?? 'photo';
  const flyer = goal === 'drone';
  const lean: Q[] =
    goal === 'hybrid'
      ? [
          {
            key: 'lean',
            title: 'Which way do you lean?',
            hint: 'Most hybrid shooters favour one side. This shifts which strengths count most.',
            opts: [
              { v: 'photo', icon: '📷', label: 'More photo', sub: 'Mostly stills, video on the side' },
              { v: 'equal', icon: '⚖️', label: 'Right down the middle', sub: 'Equal photo and video' },
              { v: 'video', icon: '🎬', label: 'More video', sub: 'Mostly video, photos on the side' },
            ],
          },
        ]
      : [];
  return [
    { key: 'goal', title: 'What do you want to make?', opts: GOALS },
    ...lean,
    { key: 'budget', title: 'What can you spend?', hint: flyer ? 'For the drone itself.' : 'For the camera itself — lenses and extras come on top.', opts: budgets(goal) },
    {
      key: 'cond',
      title: 'New, or is used okay?',
      hint: 'Used gear from a good seller is often the smartest money in photography.',
      opts: [
        { v: 'used', icon: '♻️', label: 'Used is fine', sub: 'More camera for the money' },
        { v: 'new', icon: '📦', label: 'New only', sub: 'Warranty, current models' },
      ],
    },
    { key: 'use', title: flyer ? 'What will you fly for?' : 'What will you shoot most?', opts: uses(goal) },
    {
      key: 'size',
      title: flyer ? 'How much drone?' : 'How big can it be?',
      opts: flyer
        ? [
            { v: 'small', icon: '🪶', label: 'Under 250 g', sub: 'Fewest rules, fits a pocket' },
            { v: 'any', icon: '⚖️', label: 'Doesn’t matter' },
            { v: 'pro', icon: '🎥', label: 'Pro, multi-camera' },
          ]
        : [
            { v: 'small', icon: '🪶', label: 'As small as possible', sub: 'Jacket-pocket or small bag' },
            { v: 'any', icon: '⚖️', label: 'Doesn’t matter' },
            { v: 'pro', icon: '🛠️', label: 'Pro handling', sub: 'Grip, dials, dual card slots' },
          ],
    },
  ];
}

export function Finder() {
  const [a, setA] = useState<Answers>({});
  const [step, setStep] = useState(0);
  const root = useRef<HTMLElement>(null);
  const qs = questions(a);
  const done = step >= qs.length;
  const picks = useMemo(() => (done ? findGear(a as Required<Answers>) : []), [done, a]);

  const { contextSafe } = useGSAP({ scope: root });

  // animate each question / result in
  useGSAP(
    () => {
      if (reducedMotion()) return;
      gsap.from('.fq-anim > :not(.fq-opts):not(.fq-rest), .fq-opt, .fq-rest > *', { autoAlpha: 0, y: 22, duration: 0.7, stagger: 0.045, ease: EASE.expo });
    },
    { scope: root, dependencies: [step], revertOnUpdate: true },
  );

  const move = contextSafe((to: number, patch?: Partial<Answers>) => {
    const apply = () => {
      if (patch) setA((cur) => ({ ...cur, ...patch }));
      setStep(to);
    };
    if (reducedMotion()) return apply();
    // the fade is decoration: the step always changes on a timer, even if frames are throttled
    gsap.to('.fq-anim > *', { autoAlpha: 0, y: -14, duration: 0.22, stagger: 0.015, ease: EASE.in });
    window.setTimeout(apply, 260);
  });

  const choose = (q: Q, v: unknown) => move(step + 1, q.key === 'goal' && v !== a.goal ? { goal: v as Goal, use: undefined, lean: undefined } : { [q.key]: v });

  return (
    <section className="finder-quiz" ref={root}>
      <div className="hero">
        <div className="hero-glow" />
        <div className="hero-text">
          <span className="eyebrow">Gear finder</span>
          <h1>
            A few questions. <span className="grad">Your camera.</span>
          </h1>
        </div>
      </div>

      <div className="fq-progress" aria-label={`Step ${Math.min(step + 1, qs.length)} of ${qs.length}`}>
        {qs.map((q, i) => (
          <button key={q.key} className={i < step ? 'done' : i === step ? 'on' : ''} disabled={i > step} onClick={() => move(i)}>
            <i />
            <span>{i < step ? labelOf(qs[i], a[q.key]) : `0${i + 1}`}</span>
          </button>
        ))}
        <button className={done ? 'on' : ''} disabled={!done}>
          <i />
          <span>Result</span>
        </button>
      </div>

      {!done ? (
        <div className="fq-anim fq-step" key={step}>
          <h2 className="fq-title">{qs[step].title}</h2>
          {qs[step].hint && <p className="muted">{qs[step].hint}</p>}
          <div className="fq-opts">
            {qs[step].opts.map((o) => (
              <button key={String(o.v)} className={`fq-opt ${a[qs[step].key] === o.v ? 'on' : ''}`} onClick={() => choose(qs[step], o.v)}>
                <span className="fq-icon" aria-hidden>
                  {o.icon}
                </span>
                <b>{o.label}</b>
                {o.sub && <span className="muted small">{o.sub}</span>}
              </button>
            ))}
          </div>
          {step > 0 && (
            <button className="link fq-back" onClick={() => move(step - 1)}>
              ← Back
            </button>
          )}
        </div>
      ) : (
        <Result a={a as Required<Answers>} picks={picks} restart={() => move(0)} />
      )}
    </section>
  );
}

function labelOf(q: Q, v: unknown) {
  return (q.opts.find((o) => o.v === v)?.label ?? '—').replace(/^Up to /, '≤ ');
}

function Result({ a, picks, restart }: { a: Required<Answers>; picks: ReturnType<typeof findGear>; restart: () => void }) {
  const path = tierFor(a.goal, a.budget);
  if (!picks.length)
    return (
      <div className="fq-anim fq-step">
        <h2 className="fq-title">Nothing fits that budget yet.</h2>
        <p className="muted">Try allowing used gear or raising the budget a step.</p>
        <button className="btn" onClick={restart}>
          Start again
        </button>
      </div>
    );
  const [best, ...rest] = picks;
  return (
    <div className="fq-anim fq-result">
      <span className="eyebrow">Your best match</span>
      <PickCard pick={best} hero />
      {rest.length > 0 && (
        <>
          <span className="eyebrow fq-also">Also worth a look</span>
          <div className="fq-rest">
            {rest.map((x) => (
              <PickCard key={x.p.id} pick={x} />
            ))}
          </div>
        </>
      )}
      <div className="fq-actions">
        {picks.length > 1 && (
          <button className="btn" onClick={() => go(`/vs/${picks.map((x) => x.p.id).join('/')}`)}>
            Compare all {picks.length} in Versus →
          </button>
        )}
        <button className="btn ghost" onClick={() => go(`/kits/${path.track}/${path.tier}`)}>
          {tierIcon(path.tier)} See the full {tierLabel(path.tier, path.track)} kit
        </button>
        <button className="link" onClick={restart}>
          Start again
        </button>
      </div>
    </div>
  );
}

function PickCard({ pick, hero }: { pick: ReturnType<typeof findGear>[number]; hero?: boolean }) {
  const { p } = pick;
  return (
    <button className={`panel fq-pick ${hero ? 'hero-pick' : ''}`} onClick={() => go(`/p/${p.id}`)}>
      <ProductImage product={p} size={hero ? 'lg' : 'md'} />
      <div className="fq-pmain">
        <span className="muted small">
          {p.brand} · {p.year}
        </span>
        <b className="fq-name">{p.model}</b>
        <ul>
          {pick.reasons.map((r) => (
            <li key={r}>{r}</li>
          ))}
        </ul>
      </div>
      <div className="fq-side">
        <span className="fq-match">{pick.fit}%</span>
        <span className="muted small">match</span>
        <span className="ks-price">
          {pick.used ? (
            <>
              <span className="ks-used">used</span> ≈ {money(pick.cost)}
              {pick.estimate && <small className="muted">estimate · new was {money(p.price)}</small>}
            </>
          ) : (
            money(pick.cost)
          )}
        </span>
      </div>
    </button>
  );
}
