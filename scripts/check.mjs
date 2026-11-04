import { readFile, readdir, stat } from 'node:fs/promises';
import { extname, join, relative, resolve, sep } from 'node:path';
import { spawnSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';

const root = fileURLToPath(new URL('../site/', import.meta.url));
const errors = [];
const files = [];
async function collect(directory) {
  for (const entry of await readdir(directory, { withFileTypes: true })) {
    const path = join(directory, entry.name);
    if (entry.isDirectory()) await collect(path);
    else if (entry.isFile()) files.push(path);
    else errors.push(`Unsupported site entry: ${relative(root, path)}`);
  }
}
await collect(root);
const html = new Map();
const attributes = (markup, name) => [...markup.matchAll(new RegExp(`(?:^|\\s)${name}\\s*=\\s*(?:"([^"]*)"|'([^']*)'|([^\\s>]+))`, 'gi'))].map((match) => match[1] ?? match[2] ?? match[3]);
for (const path of files.filter((file) => extname(file) === '.html')) {
  const text = await readFile(path, 'utf8');
  const ids = attributes(text, 'id');
  const seen = new Set();
  for (const id of ids) {
    if (seen.has(id)) errors.push(`${relative(root, path)}: duplicate id "${id}"`);
    seen.add(id);
  }
  html.set(path, { text, ids: seen });
}
if (!html.has(join(root, 'index.html'))) errors.push('Missing site/index.html');

async function checkReference(source, value) {
  const reference = value.replaceAll('&amp;', '&').trim();
  if (!reference || reference === '#') {
    errors.push(`${relative(root, source)}: empty link or asset reference`);
    return;
  }
  if (/^(?:[a-z][a-z\d+.-]*:|\/\/)/i.test(reference)) return;
  let url;
  let target;
  try {
    const sourceUrl = relative(root, source).split(sep).join('/');
    url = new URL(reference, `https://local.invalid/${sourceUrl}`);
    target = resolve(root, '.' + decodeURIComponent(url.pathname));
  } catch {
    errors.push(`${relative(root, source)}: invalid reference "${value}"`);
    return;
  }
  if (target !== resolve(root) && !target.startsWith(resolve(root) + sep)) {
    errors.push(`${relative(root, source)}: reference leaves site/ "${value}"`);
    return;
  }
  try {
    let info = await stat(target);
    if (info.isDirectory()) {
      target = join(target, 'index.html');
      info = await stat(target);
    }
    if (!info.isFile()) throw new Error('Not a file');
  } catch {
    errors.push(`${relative(root, source)}: missing local target "${value}"`);
    return;
  }
  if (url.hash && html.has(target)) {
    let id;
    try { id = decodeURIComponent(url.hash.slice(1)); }
    catch { errors.push(`${relative(root, source)}: invalid anchor "${value}"`); return; }
    if (!html.get(target).ids.has(id)) errors.push(`${relative(root, source)}: missing anchor "${value}"`);
  }
}

for (const [path, page] of html) {
  for (const reference of attributes(page.text, '(?:href|src|poster)')) await checkReference(path, reference);
  for (const names of attributes(page.text, 'aria-(?:labelledby|describedby|controls)')) {
    for (const id of names.split(/\s+/).filter(Boolean)) {
      if (!page.ids.has(id)) errors.push(`${relative(root, path)}: ARIA references missing id "${id}"`);
    }
  }
  let inlineIndex = 0;
  for (const match of page.text.matchAll(/<script\b([^>]*)>([\s\S]*?)<\/script\s*>/gi)) {
    if (attributes(match[1], 'src').length) continue;
    const type = attributes(match[1], 'type')[0] ?? 'text/javascript';
    if (!['module', 'text/javascript', 'application/javascript'].includes(type)) continue;
    inlineIndex += 1;
    const result = spawnSync(process.execPath, ['--check', `--input-type=${type === 'module' ? 'module' : 'commonjs'}`], { input: match[2], encoding: 'utf8' });
    if (result.status !== 0) errors.push(`${relative(root, path)}: inline script ${inlineIndex} syntax check failed\n${result.stderr || result.error?.message || ''}`);
  }
}
for (const path of files.filter((file) => extname(file) === '.css')) {
  const css = await readFile(path, 'utf8');
  for (const match of css.matchAll(/url\(\s*(?:"([^"]*)"|'([^']*)'|([^)]*?))\s*\)/gi)) {
    await checkReference(path, match[1] ?? match[2] ?? match[3]);
  }
}
for (const path of files.filter((file) => /\.(?:m?js)$/.test(file))) {
  const result = spawnSync(process.execPath, ['--check', path], { encoding: 'utf8' });
  if (result.status !== 0) errors.push(`${relative(root, path)}: JavaScript syntax check failed\n${result.stderr || result.error?.message || ''}`);
}
if (errors.length) {
  for (const error of errors) console.error(error);
  process.exitCode = 1;
} else {
  console.log(`Checked ${html.size} HTML page(s), local links/assets, anchor and ARIA targets, CSS assets, and JavaScript syntax.`);
}
