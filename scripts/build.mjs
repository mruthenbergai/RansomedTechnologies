import { access, cp, lstat, mkdir, readdir, realpath, rm } from 'node:fs/promises';
import { basename, dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = await realpath(fileURLToPath(new URL('../', import.meta.url)));
const source = join(root, 'site');
const output = resolve(root, 'dist');

// Validate the complete source before replacing a previous build.
if ((await lstat(source)).isSymbolicLink()) throw new Error(`Site source cannot be a link: ${source}`);
await access(join(source, 'index.html'));
async function inspect(directory) {
  for (const entry of await readdir(directory, { withFileTypes: true })) {
    const path = join(directory, entry.name);
    if (entry.isSymbolicLink()) throw new Error(`Site source cannot contain links: ${path}`);
    if (entry.isDirectory()) await inspect(path);
    else if (!entry.isFile()) throw new Error(`Unsupported site source entry: ${path}`);
  }
}
await inspect(source);

// Deletion is restricted to this repository's direct dist child.
if (output !== resolve(root, 'dist') || dirname(output) !== root || basename(output) !== 'dist') {
  throw new Error(`Refusing to replace an unsafe output path: ${output}`);
}
const existing = await lstat(output).catch((error) => {
  if (error.code === 'ENOENT') return null;
  throw error;
});
if (existing?.isSymbolicLink()) throw new Error(`Build output cannot be a link: ${output}`);
if (existing) await rm(output, { recursive: true });
await mkdir(output, { recursive: true });
await cp(source, output, { recursive: true });
console.log('Built site/ into dist/.');
