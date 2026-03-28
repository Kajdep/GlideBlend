const fs = require('fs');
const path = require('path');
const { spawnSync } = require('child_process');

const rootDir = path.resolve(__dirname, '..');
const releaseDir = path.join(rootDir, 'release');
const sourceDir = path.join(releaseDir, 'win-unpacked');
const targetDir = path.join(releaseDir, 'itch-win64');
const packageJson = JSON.parse(fs.readFileSync(path.join(rootDir, 'package.json'), 'utf8'));
const zipPath = path.join(releaseDir, `GlideBlend-${packageJson.version}-itch-win64.zip`);

if (!fs.existsSync(sourceDir)) {
  throw new Error('Missing release/win-unpacked. Run npm run dist:win first.');
}

fs.rmSync(targetDir, { recursive: true, force: true });
fs.cpSync(sourceDir, targetDir, { recursive: true });

if (process.platform === 'win32') {
  if (fs.existsSync(zipPath)) {
    fs.rmSync(zipPath, { force: true });
  }

  const archiveCommand = `Compress-Archive -Path '${targetDir}\\*' -DestinationPath '${zipPath}' -Force`;
  const result = spawnSync('powershell.exe', ['-NoProfile', '-Command', archiveCommand], {
    stdio: 'inherit',
  });

  if (result.status !== 0) {
    throw new Error('Failed to create the itch zip archive.');
  }
}

console.log(`Staged itch.io bundle in ${path.relative(rootDir, targetDir)}`);
console.log(`Created archive ${path.relative(rootDir, zipPath)}`);