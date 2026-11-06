// Render final: HyperFrames -> master de audio (-14 LUFS, pico -1.5 dBTP) -> renders/cyber-monday.mp4
// Uso: node render.mjs [draft|high]   (por defecto high)
import { spawnSync } from 'node:child_process';
import { mkdirSync } from 'node:fs';
import { fileURLToPath } from 'node:url';

const dir = fileURLToPath(new URL('.', import.meta.url));
const quality = process.argv[2] === 'draft' ? 'draft' : 'high';
const HF = 'hyperframes@0.7.109';

const run = (cmd, args) => {
  console.log('>', cmd, args.join(' '));
  const r = spawnSync(cmd, args, { cwd: dir, stdio: 'inherit', shell: process.platform === 'win32' });
  if (r.error || r.status !== 0) { console.error(r.error?.message ?? `falló: ${cmd}`); process.exit(1); }
};

if (spawnSync('ffmpeg', ['-version'], { shell: process.platform === 'win32' }).status !== 0) {
  console.error('Falta ffmpeg. En Windows: winget install Gyan.FFmpeg (y reabrí la terminal).');
  process.exit(1);
}

mkdirSync(new URL('./renders', import.meta.url), { recursive: true });
run('node', ['build-v2.mjs']);
run('npx', ['--yes', HF, 'lint']);
run('npx', ['--yes', HF, 'render', '-q', quality, '-o', 'renders/raw.mp4', '--quiet']);
run('ffmpeg', ['-v', 'error', '-y', '-i', 'renders/raw.mp4', '-c:v', 'copy',
  '-af', 'loudnorm=I=-14:TP=-1.5:LRA=11,aresample=48000', '-c:a', 'aac', '-b:a', '256k', 'renders/cyber-monday.mp4']);
console.log('Listo: reels/cyber-monday/renders/cyber-monday.mp4');
