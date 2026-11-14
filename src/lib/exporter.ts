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
    const r = await fetch(url, { mode: 'cors', referrerPolicy: 'no-referrer' });
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
  return toCanvas(node, { pixelRatio: 2, backgroundColor: BG, cacheBust: false, skipFonts: false });
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

/** A4 PDF. Each [data-block] is captured on its own so page breaks never cut through a section. */
export async function exportPdf(node: HTMLElement, name: string) {
  const { jsPDF } = await import('jspdf');
  const pdf = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4', compress: true });
  const W = pdf.internal.pageSize.getWidth();
  const H = pdf.internal.pageSize.getHeight();
  const M = 8; // margin
  const paint = () => {
    pdf.setFillColor(BG);
    pdf.rect(0, 0, W, H, 'F');
  };
  paint();
  let y = M;
  const blocks = [...node.querySelectorAll<HTMLElement>('[data-block]')];
  for (const b of blocks) {
    const c = await snap(b);
    const w = W - 2 * M;
    let h = (c.height / c.width) * w;
    const img = c.toDataURL('image/jpeg', 0.9);
    if (h > H - 2 * M) {
      // taller than a page (long spec tables): slice it across pages
      const pagePx = ((H - 2 * M) / w) * c.width;
      for (let top = 0; top < c.height; top += pagePx) {
        const slice = document.createElement('canvas');
        slice.width = c.width;
        slice.height = Math.min(pagePx, c.height - top);
        slice.getContext('2d')!.drawImage(c, 0, -top);
        if (y > M) {
          pdf.addPage();
          paint();
          y = M;
        }
        const sh = (slice.height / c.width) * w;
        pdf.addImage(slice.toDataURL('image/jpeg', 0.9), 'JPEG', M, y, w, sh);
        y += sh + 4;
      }
      continue;
    }
    if (y + h > H - M) {
      pdf.addPage();
      paint();
      y = M;
    }
    pdf.addImage(img, 'JPEG', M, y, w, h);
    y += h + 4;
    h = 0;
  }
  const url = URL.createObjectURL(pdf.output('blob'));
  download(url, `${name}.pdf`);
  window.setTimeout(() => URL.revokeObjectURL(url), 60_000);
}
