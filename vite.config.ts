import { defineConfig, type Plugin } from 'vite';
import react from '@vitejs/plugin-react';
import { resolve } from 'node:path';

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
  plugins: [react(), imageRelay()],
  // jsPDF lazily imports canvg for SVG drawing; we only add JPEGs, so point it at a stub
  resolve: { alias: { canvg: resolve(__dirname, 'src/lib/empty.ts') } },
  server: { port: 5173 },
});
