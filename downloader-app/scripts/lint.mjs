import { spawnSync } from 'node:child_process';

const rawArgs = process.argv.slice(2);

const normalizeArg = (arg) => {
  if (typeof arg !== 'string') return arg;
  if (arg.startsWith('downloader-app/')) return arg.slice('downloader-app/'.length);
  return arg;
};

const args = rawArgs.length ? rawArgs.map(normalizeArg) : ['src'];

const result = spawnSync('eslint', args, {
  stdio: 'inherit',
  shell: true,
});

process.exit(result.status ?? 1);
