import { useEffect, useMemo, useRef, useState, type KeyboardEvent } from 'react';
import { byId, products, sectionOf, type Section } from '../data';
import type { Product } from '../data/types';
import { searchProducts } from '../lib/search';
import { money } from '../lib/specRows';
import { ProductImage } from './ProductImage';

/**
 * Two-step product picker: an optional brand dropdown on the left, and a box on the right where you
 * either open the list and choose, or type — using the same forgiving search as the browse pages
 * ("60", "canon 60", "a7 4", "mavik 3"…). Arrow keys + Enter work too.
 */
const TYPE_LABEL: Record<Section, string> = { cameras: 'Cameras', action: 'Action & 360', drones: 'Drones', gimbals: 'Gimbals' };
const TYPE_NOUN: Record<Section, string> = { cameras: 'camera', action: 'action camera', drones: 'drone', gimbals: 'gimbal' };
const TYPE_ORDER: Section[] = ['cameras', 'action', 'drones', 'gimbals'];

export function Picker({ value, kind, onChange, exclude }: { value?: string; kind?: Product['kind']; onChange: (id: string) => void; exclude: string[] }) {
  const pool = useMemo(() => products.filter((p) => !kind || p.kind === kind), [kind]);
  const brands = useMemo(() => [...new Set(pool.map((p) => p.brand))], [pool]);
  const current = value ? byId(value) : undefined;
  const [brand, setBrand] = useState<string>(current?.brand ?? 'All');
  const [type, setType] = useState<Section | 'All'>('All');
  // second step, only when the chosen brand makes more than one kind of product (e.g. DJI: drones, gimbals, action)
  const types = useMemo(() => {
    const has = new Set(pool.filter((p) => brand === 'All' || p.brand === brand).map(sectionOf));
    return TYPE_ORDER.filter((t) => has.has(t));
  }, [pool, brand]);
  const typeOn = type !== 'All' && types.includes(type) ? type : 'All';
  const [q, setQ] = useState('');
  const [open, setOpen] = useState(false);
  const [hi, setHi] = useState(0);
  const box = useRef<HTMLDivElement>(null);
  const input = useRef<HTMLInputElement>(null);
  const listRef = useRef<HTMLUListElement>(null);

  const options = useMemo(() => {
    const base = pool.filter(
      (p) => (brand === 'All' || p.brand === brand) && (typeOn === 'All' || sectionOf(p) === typeOn) && (p.id === value || !exclude.includes(p.id)),
    );
    return q.trim() ? searchProducts(base, q) : [...base].sort((a, b) => b.year - a.year || a.model.localeCompare(b.model));
  }, [pool, brand, typeOn, q, value, exclude]);

  // close when tapping anywhere else
  useEffect(() => {
    if (!open) return;
    const off = (e: PointerEvent) => {
      if (!box.current?.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener('pointerdown', off);
    return () => document.removeEventListener('pointerdown', off);
  }, [open]);

  useEffect(() => setHi(0), [q, brand, typeOn]);
  useEffect(() => {
    listRef.current?.querySelector<HTMLElement>(`[data-i="${hi}"]`)?.scrollIntoView({ block: 'nearest' });
  }, [hi]);

  const choose = (id: string) => {
    setOpen(false);
    setQ('');
    input.current?.blur();
    onChange(id);
  };

  const onKey = (e: KeyboardEvent) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setOpen(true);
      setHi((h) => Math.min(options.length - 1, h + 1));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setHi((h) => Math.max(0, h - 1));
    } else if (e.key === 'Enter' && open && options[hi]) {
      e.preventDefault();
      choose(options[hi].id);
    } else if (e.key === 'Escape') {
      setOpen(false);
      setQ('');
      input.current?.blur();
    }
  };

  const label = current ? `${current.brand} ${current.model}` : '';

  return (
    <div className={`picker2 ${open ? 'open' : ''}`} ref={box}>
      <select
        className="p2-brand"
        value={brand}
        aria-label="Brand"
        onChange={(e) => {
          setBrand(e.target.value);
          setType('All');
          setQ('');
          setOpen(true);
          input.current?.focus();
        }}
      >
        <option value="All">All brands</option>
        {brands.map((b) => (
          <option key={b} value={b}>
            {b}
          </option>
        ))}
      </select>
      {types.length > 1 && (
        <select
          className="p2-type"
          value={typeOn}
          aria-label="Type"
          onChange={(e) => {
            setType(e.target.value as Section | 'All');
            setQ('');
            setOpen(true);
            input.current?.focus();
          }}
        >
          <option value="All">All types</option>
          {types.map((t) => (
            <option key={t} value={t}>
              {TYPE_LABEL[t]}
            </option>
          ))}
        </select>
      )}
      <div className="p2-field">
        <input
          ref={input}
          className="p2-input"
          value={open ? q : label}
          placeholder={open && label ? label : `Choose or type${brand === 'All' ? '' : ` a ${brand}`}${typeOn === 'All' ? '' : ` ${TYPE_NOUN[typeOn]}`}…`}
          onFocus={() => {
            setOpen(true);
            setQ('');
          }}
          onChange={(e) => {
            setQ(e.target.value);
            setOpen(true);
          }}
          onKeyDown={onKey}
          role="combobox"
          aria-expanded={open}
          aria-autocomplete="list"
        />
        {current && !open ? (
          <button className="p2-clear" onClick={() => onChange('')} aria-label="Remove" title="Remove">
            ×
          </button>
        ) : (
          <button
            className="p2-caret"
            tabIndex={-1}
            aria-label="Show list"
            onPointerDown={(e) => {
              e.preventDefault();
              if (open) setOpen(false);
              else input.current?.focus();
            }}
          >
            ⌄
          </button>
        )}
        {open && (
          <ul className="p2-list" role="listbox" ref={listRef}>
            {options.length ? (
              options.slice(0, 150).map((p, i) => (
                <li
                  key={p.id}
                  data-i={i}
                  role="option"
                  aria-selected={p.id === value}
                  className={`${i === hi ? 'hi' : ''} ${p.id === value ? 'sel' : ''}`}
                  onPointerEnter={() => setHi(i)}
                  onPointerDown={(e) => {
                    e.preventDefault();
                    choose(p.id);
                  }}
                >
                  <ProductImage product={p} size="sm" cycle={false} />
                  <span className="p2-name">
                    {brand === 'All' && <small>{p.brand}</small>}
                    {p.model}
                  </span>
                  <span className="p2-meta">
                    {p.year} · {money(p.price)}
                  </span>
                </li>
              ))
            ) : (
              <li className="p2-none">
                Nothing matches “{q}”{brand !== 'All' ? ` in ${brand}` : ''}
                {typeOn !== 'All' ? ` ${TYPE_LABEL[typeOn].toLowerCase()}` : ''}.
              </li>
            )}
          </ul>
        )}
      </div>
    </div>
  );
}
