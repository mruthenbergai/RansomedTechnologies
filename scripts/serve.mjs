import { createReadStream } from 'node:fs';
import { realpath, stat } from 'node:fs/promises';
import { createServer } from 'node:http';
import { extname, join, resolve, sep } from 'node:path';
import { pipeline } from 'node:stream/promises';
import { fileURLToPath } from 'node:url';

const directory = fileURLToPath(new URL('../dist/', import.meta.url));
const root = await realpath(directory).catch(() => {
  throw new Error('No build found. Run npm run build before npm run dev.');
});
const port = Number(process.env.PORT ?? 4173);
if (!Number.isInteger(port) || port < 1 || port > 65535) throw new Error('PORT must be an integer from 1 to 65535.');
const mime = {
  '.html': 'text/html; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.mjs': 'text/javascript; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.webp': 'image/webp',
  '.avif': 'image/avif',
  '.svg': 'image/svg+xml',
  '.ico': 'image/x-icon',
  '.woff': 'font/woff',
  '.woff2': 'font/woff2',
  '.txt': 'text/plain; charset=utf-8',
  '.pdf': 'application/pdf'
};
const withinRoot = (path) => path === root || path.startsWith(root + sep);

function reply(response, status, message) {
  response.writeHead(status, { 'Content-Type': 'text/plain; charset=utf-8', 'X-Content-Type-Options': 'nosniff' });
  response.end(message + '\n');
}

const server = createServer(async (request, response) => {
  if (request.method !== 'GET' && request.method !== 'HEAD') {
    response.setHeader('Allow', 'GET, HEAD');
    reply(response, 405, 'Method not allowed');
    return;
  }
  let pathname;
  try {
    pathname = decodeURIComponent((request.url ?? '/').split(/[?#]/, 1)[0]);
  } catch {
    reply(response, 400, 'Invalid request path');
    return;
  }
  if (!pathname.startsWith('/') || pathname.includes('\\') || pathname.includes(':') || pathname.includes('\0') || pathname.split('/').some((part) => part === '..' || part === '.')) {
    reply(response, 404, 'Not found');
    return;
  }
  let target = resolve(root, '.' + pathname);
  if (!withinRoot(target)) {
    reply(response, 404, 'Not found');
    return;
  }
  try {
    let info = await stat(target);
    if (info.isDirectory()) {
      target = join(target, 'index.html');
      info = await stat(target);
    }
    const actual = await realpath(target);
    if (!info.isFile() || !withinRoot(actual)) {
      reply(response, 404, 'Not found');
      return;
    }
    response.writeHead(200, {
      'Content-Type': mime[extname(target).toLowerCase()] ?? 'application/octet-stream',
      'Content-Length': info.size,
      'Cache-Control': 'no-store',
      'X-Content-Type-Options': 'nosniff'
    });
    if (request.method === 'HEAD') response.end();
    else await pipeline(createReadStream(actual), response);
  } catch (error) {
    if (response.headersSent) response.destroy(error);
    else if (error.code === 'ENOENT' || error.code === 'ENOTDIR') reply(response, 404, 'Not found');
    else {
      console.error(error.message);
      reply(response, 500, 'Server error');
    }
  }
});
server.on('error', (error) => {
  console.error(error.message);
  process.exitCode = 1;
});
server.listen(port, '127.0.0.1', () => console.log(`Serving dist/ at http://127.0.0.1:${port}`));
