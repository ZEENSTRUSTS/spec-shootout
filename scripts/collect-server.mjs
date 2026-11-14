// Tiny local collector: the B&H tab POSTs photo sets here; they are merged into src/data/photos.json.
import { createServer } from 'node:http';
import { readFileSync, writeFileSync, existsSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
const FILE = join(ROOT, 'src', 'data', 'photos.json');
const LOG = join(ROOT, 'bh-results.json');

const cors = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'POST, GET, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type',
  'Access-Control-Allow-Private-Network': 'true',
};

createServer((req, res) => {
  if (req.method === 'OPTIONS') {
    res.writeHead(204, cors);
    return res.end();
  }
  if (req.method === 'POST' && req.url === '/photos') {
    let body = '';
    req.on('data', (c) => (body += c));
    req.on('end', () => {
      try {
        const { sets = {}, log = [] } = JSON.parse(body);
        const cur = existsSync(FILE) ? JSON.parse(readFileSync(FILE, 'utf8')) : {};
        Object.assign(cur, sets);
        writeFileSync(FILE, JSON.stringify(cur, null, 1));
        const prev = existsSync(LOG) ? JSON.parse(readFileSync(LOG, 'utf8')) : [];
        writeFileSync(LOG, JSON.stringify([...prev, ...log], null, 1));
        console.log(`+${Object.keys(sets).length} sets (total ${Object.keys(cur).length})`);
        res.writeHead(200, { ...cors, 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ ok: true, total: Object.keys(cur).length }));
      } catch (e) {
        res.writeHead(400, cors);
        res.end(String(e));
      }
    });
    return;
  }
  res.writeHead(404, cors);
  res.end();
}).listen(5199, () => console.log('collector on http://localhost:5199'));
