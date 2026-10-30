import http from 'node:http';
import { readFile } from 'node:fs/promises';
import { dirname, extname, resolve, sep } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = dirname(fileURLToPath(import.meta.url));
const types = { '.html': 'text/html; charset=utf-8', '.js': 'text/javascript; charset=utf-8', '.css': 'text/css; charset=utf-8', '.svg': 'image/svg+xml', '.json': 'application/json; charset=utf-8' };
http.createServer(async (req, res) => {
  const url = new URL(req.url, 'http://localhost');
  if (url.pathname.startsWith('/api/')) {
    try {
      const response = await fetch(`${process.env.API_URL || 'http://localhost:5000'}${url.pathname}${url.search}`, { signal: AbortSignal.timeout(5000) });
      res.writeHead(response.status, { 'Content-Type': 'application/json; charset=utf-8' });
      res.end(await response.text());
    } catch { res.writeHead(503, { 'Content-Type': 'application/json' }); res.end(JSON.stringify({ error: 'Không thể kết nối máy chủ dữ liệu.' })); }
    return;
  }
  try {
    const pathname = decodeURIComponent(url.pathname);
    const file = resolve(root, '.' + (pathname === '/' ? '/index.html' : pathname));
    if (!file.startsWith(root + sep) || !types[extname(file)]) { res.writeHead(404); res.end('Not found'); return; }
    const data = await readFile(file);
    res.writeHead(200, { 'Content-Type': types[extname(file)], 'X-Content-Type-Options': 'nosniff' }); res.end(data);
  } catch { res.writeHead(404); res.end('Not found'); }
}).listen(Number(process.env.PORT) || 5173, '127.0.0.1', () => console.log('Dòng Sử Việt: http://localhost:5173'));
