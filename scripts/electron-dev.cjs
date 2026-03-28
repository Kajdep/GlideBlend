const http = require('http');
const { spawn } = require('child_process');
const electronBinary = require('electron');

const npmCommand = process.platform === 'win32' ? 'npm.cmd' : 'npm';
const serverUrl = 'http://127.0.0.1:3000/api/health';

let devServer = null;
let electronProcess = null;
let shuttingDown = false;

function waitForServer(maxAttempts = 120) {
  return new Promise((resolve, reject) => {
    let attempts = 0;

    const check = () => {
      attempts += 1;
      const request = http.get(serverUrl, (response) => {
        response.resume();
        if (response.statusCode === 200) {
          resolve();
          return;
        }

        if (attempts >= maxAttempts) {
          reject(new Error(`Dev server responded with ${response.statusCode}.`));
          return;
        }

        setTimeout(check, 500);
      });

      request.on('error', () => {
        if (attempts >= maxAttempts) {
          reject(new Error('Timed out waiting for the GlideBlend dev server.'));
          return;
        }

        setTimeout(check, 500);
      });
    };

    check();
  });
}

function shutdown(exitCode = 0) {
  if (shuttingDown) {
    return;
  }

  shuttingDown = true;

  if (electronProcess && !electronProcess.killed) {
    electronProcess.kill();
  }

  if (devServer && !devServer.killed) {
    devServer.kill();
  }

  process.exit(exitCode);
}

async function start() {
  devServer = spawn(npmCommand, ['run', 'dev'], {
    stdio: 'inherit',
    env: process.env,
  });

  devServer.on('exit', (code) => {
    if (!shuttingDown) {
      shutdown(code ?? 1);
    }
  });

  await waitForServer();

  electronProcess = spawn(electronBinary, ['.'], {
    stdio: 'inherit',
    env: {
      ...process.env,
      ELECTRON_START_URL: 'http://127.0.0.1:3000',
    },
  });

  electronProcess.on('exit', (code) => {
    shutdown(code ?? 0);
  });
}

process.on('SIGINT', () => shutdown(0));
process.on('SIGTERM', () => shutdown(0));

start().catch((error) => {
  console.error(error);
  shutdown(1);
});
