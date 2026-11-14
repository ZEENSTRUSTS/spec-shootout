import { defineConfig, type Plugin } from 'vite';
import react from '@vitejs/plugin-react';
import { readFileSync, writeFileSync, existsSync } from 'node:fs';
import { resolve } from 'node:path';

/** Dev-only endpoint: POST /api/photos {id, set|null} merges into src/data/photos.json. */
function photoSaver(): Plugin {
  const file = resolve(__dirname, 'src/data/photos.json');
  return {
    name: 'photo-saver',
    configureServer(server) {
      server.middlewares.use('/api/photos', (req, res) => {
        if (req.method !== 'POST') {
          res.statusCode = 405;
          return res.end();
        }
        let body = '';
        req.on('data', (c) => (body += c));
        req.on('end', () => {
          try {
            const { id, set } = JSON.parse(body);
            if (typeof id !== 'string' || !/^[a-z0-9-]+$/.test(id)) throw new Error('bad id');
            const cur = existsSync(file) ? JSON.parse(readFileSync(file, 'utf8')) : {};
            if (set) {
              const files = (set.files as unknown[]).filter((f): f is string => typeof f === 'string' && /^https:\/\//.test(f)).slice(0, 8);
              cur[id] = { files, source: String(set.source ?? ''), page: String(set.page ?? ''), title: String(set.title ?? '') };
            } else delete cur[id];
            writeFileSync(file, JSON.stringify(cur, null, 1));
            res.setHeader('Content-Type', 'application/json');
            res.end(JSON.stringify({ ok: true, total: Object.keys(cur).length }));
          } catch (e) {
            res.statusCode = 400;
            res.end(String(e));
          }
        });
      });
    },
  };
}

/** Dev-only image relay for exports: GET /api/img?u=<https url> returns the image with same-origin headers. */
function imageRelay(): Plugin {
  return {
    name: 'image-relay',
    configureServer(server) {
      server.middlewares.use('/api/img', async (req, res) => {
        try {
          const u = new URL(req.url ?? '', 'http://x').searchParams.get('u') ?? '';
          if (!/^https:\/\//.test(u)) throw new Error('bad url');
          const r = await fetch(u, { headers: { 'User-Agent': 'Mozilla/5.0', Accept: 'image/*' } });
          const type = r.headers.get('content-type') ?? '';
          if (!r.ok || !type.startsWith('image/')) throw new Error(`upstream ${r.status}`);
          res.setHeader('Content-Type', type);
          res.end(Buffer.from(await r.arrayBuffer()));
        } catch (e) {
          res.statusCode = 502;
          res.end(String(e));
        }
      });
    },
  };
}

export default defineConfig({
  // relative asset paths so the build works from any folder (e.g. GitHub Pages /repo-name/)
  base: './',
  plugins: [react(), photoSaver(), imageRelay()],
  // jsPDF lazily imports canvg for SVG drawing; we only add JPEGs, so point it at a stub
  resolve: { alias: { canvg: resolve(__dirname, 'src/lib/empty.ts') } },
  server: { port: 5173 },
});
