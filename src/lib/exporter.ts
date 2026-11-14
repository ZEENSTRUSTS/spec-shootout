import { toCanvas } from 'html-to-image';

/**
 * Product photos are hot-linked from shops that mostly refuse cross-origin reads, which would leave
 * holes in an exported image. Each photo is turned into a data URL first, trying in order:
 * the original host → images.weserv.nl (public image relay with CORS) → the dev-server relay.
 */
const cache = new Map<string, Promise<string | null>>();

async function blobToDataUrl(b: Blob): Promise<string> {
  return new Promise((ok, no) => {
    const r = new FileReader();
    r.onload = () => ok(String(r.result));
    r.onerror = no;
    r.readAsDataURL(b);
  });
}

async function tryFetch(url: string): Promise<string | null> {
  try {
    const r = await fetch(url, { mode: 'cors', referrerPolicy: 'no-referrer', signal: AbortSignal.timeout(10_000) });
    if (!r.ok) return null;
    const b = await r.blob();
    return b.type.startsWith('image/') ? blobToDataUrl(b) : null;
  } catch {
    return null;
  }
}

export function inlineImage(src: string): Promise<string | null> {
  if (src.startsWith('data:') || src.startsWith('/') || src.startsWith(location.origin)) return Promise.resolve(src);
  if (!cache.has(src)) {
    cache.set(
      src,
      (async () =>
        (await tryFetch(src)) ??
        (await tryFetch(`https://images.weserv.nl/?w=900&output=png&url=${encodeURIComponent(src)}`)) ??
        (import.meta.env.DEV ? await tryFetch(`/api/img?u=${encodeURIComponent(src)}`) : null))(),
    );
  }
  return cache.get(src)!;
}

const BG = '#0b0c0f';

async function snap(node: HTMLElement) {
  return toCanvas(node, { pixelRatio: 2, backgroundColor: BG, cacheBust: false });
}

function download(href: string, name: string) {
  const a = document.createElement('a');
  a.href = href;
  a.download = name;
  document.body.appendChild(a);
  a.click();
  a.remove();
}

export async function exportJpeg(node: HTMLElement, name: string) {
  const c = await snap(node);
  download(c.toDataURL('image/jpeg', 0.92), `${name}.jpg`);
}

/**
 * A4 PDF. The report is captured once (fonts embedded once — fast), then cut into pages at
 * section ([data-block]) boundaries so no section is split unless it is taller than a page.
 */
export async function exportPdf(node: HTMLElement, name: string) {
  const { jsPDF } = await import('jspdf');
  const top0 = node.getBoundingClientRect().top;
  const edges = [...node.querySelectorAll<HTMLElement>('[data-block]')].map((b) => {
    const r = b.getBoundingClientRect();
    return [r.top - top0, r.bottom - top0] as const;
  });
  const cssH = node.getBoundingClientRect().height;
  const c = await snap(node);
  const k = c.height / cssH; // canvas px per CSS px

  const pdf = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4', compress: true });
  const W = pdf.internal.pageSize.getWidth();
  const H = pdf.internal.pageSize.getHeight();
  const M = 6;
  const w = W - 2 * M;
  const pagePx = ((H - 2 * M) / w) * c.width; // canvas px that fit on one page

  // choose cut points (canvas px) at block boundaries
  const cuts: number[] = [0];
  let start = 0;
  for (const [t, b] of edges) {
    const top = t * k;
    const bottom = b * k;
    if (bottom - start <= pagePx) continue;
    if (top > start + 1) cuts.push((start = top)); // move the whole section to the next page
    while (bottom - start > pagePx) cuts.push((start += pagePx)); // taller than a page: slice it
  }
  cuts.push(c.height);

  for (let i = 0; i < cuts.length - 1; i++) {
    const from = Math.round(cuts[i]);
    const to = Math.round(cuts[i + 1]);
    if (to - from < 4) continue;
    if (i > 0) pdf.addPage();
    pdf.setFillColor(BG);
    pdf.rect(0, 0, W, H, 'F');
    const slice = document.createElement('canvas');
    slice.width = c.width;
    slice.height = to - from;
    const g = slice.getContext('2d')!;
    g.fillStyle = BG;
    g.fillRect(0, 0, slice.width, slice.height);
    g.drawImage(c, 0, -from);
    pdf.addImage(slice.toDataURL('image/jpeg', 0.9), 'JPEG', M, M, w, (slice.height / c.width) * w);
  }
  const url = URL.createObjectURL(pdf.output('blob'));
  download(url, `${name}.pdf`);
  window.setTimeout(() => URL.revokeObjectURL(url), 60_000);
}
