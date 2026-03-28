const fs = require('fs');
const path = require('path');

const rootDir = path.resolve(__dirname, '..');
const sourceDir = path.join(rootDir, 'node_modules', '@ffmpeg', 'core', 'dist', 'esm');
const targetDir = path.join(rootDir, 'public', 'ffmpeg');
const requiredFiles = ['ffmpeg-core.js', 'ffmpeg-core.wasm'];

if (!fs.existsSync(sourceDir)) {
  throw new Error(
    'Missing @ffmpeg/core assets. Run "npm install" before building GlideBlend.',
  );
}

fs.rmSync(targetDir, { recursive: true, force: true });
fs.mkdirSync(targetDir, { recursive: true });

for (const fileName of requiredFiles) {
  const sourcePath = path.join(sourceDir, fileName);
  const targetPath = path.join(targetDir, fileName);

  if (!fs.existsSync(sourcePath)) {
    throw new Error(`Expected FFmpeg asset not found: ${sourcePath}`);
  }

  fs.copyFileSync(sourcePath, targetPath);
}

console.log(`Bundled FFmpeg core into ${path.relative(rootDir, targetDir)}`);

