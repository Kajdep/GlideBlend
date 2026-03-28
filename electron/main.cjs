const { app, BrowserWindow, dialog, ipcMain, shell } = require('electron');
const fs = require('fs/promises');
const fsSync = require('fs');
const path = require('path');
const { startPackagedServer } = require('./packaged-server.cjs');

let mainWindow = null;
let packagedServer = null;
let appUrl = process.env.ELECTRON_START_URL || null;

// Keep long-running FFmpeg/canvas work alive even when the window is unfocused.
app.commandLine.appendSwitch('disable-renderer-backgrounding');
app.commandLine.appendSwitch('disable-background-timer-throttling');
app.commandLine.appendSwitch('disable-backgrounding-occluded-windows');
app.commandLine.appendSwitch('disable-features', 'CalculateNativeWinOcclusion');

function getIconPath() {
  return path.join(__dirname, '..', 'public', 'favicon.ico');
}

function logDesktopError(scope, error) {
  try {
    const logDir = app.getPath('userData');
    const logPath = path.join(logDir, 'desktop-errors.log');
    const message = [
      `[${new Date().toISOString()}] ${scope}`,
      error instanceof Error ? `${error.stack || error.message}` : String(error),
      '',
    ].join('\n');

    fsSync.mkdirSync(logDir, { recursive: true });
    fsSync.appendFileSync(logPath, message);
  } catch (logError) {
    console.error('Failed to write desktop log:', logError);
  }
}

function registerIpcHandlers() {
  ipcMain.handle('desktop:get-app-info', () => ({
    isDesktop: true,
    version: app.getVersion(),
    platform: process.platform,
  }));

  ipcMain.handle('desktop:save-video', async (_event, payload) => {
    const { defaultPath, bytes } = payload ?? {};
    const { canceled, filePath } = await dialog.showSaveDialog({
      defaultPath: defaultPath || 'glideblend.mp4',
      filters: [{ name: 'MP4 Video', extensions: ['mp4'] }],
    });

    if (canceled || !filePath) {
      return { canceled: true };
    }

    await fs.writeFile(filePath, Buffer.from(bytes));
    return { canceled: false, filePath };
  });
}

function wireExternalNavigation(window) {
  if (!appUrl) {
    return;
  }

  const allowedOrigin = new URL(appUrl).origin;

  window.webContents.setWindowOpenHandler(({ url }) => {
    shell.openExternal(url);
    return { action: 'deny' };
  });

  window.webContents.on('will-navigate', (event, url) => {
    try {
      if (new URL(url).origin !== allowedOrigin) {
        event.preventDefault();
        shell.openExternal(url);
      }
    } catch {
      event.preventDefault();
    }
  });
}

function createMainWindow() {
  mainWindow = new BrowserWindow({
    width: 1440,
    height: 960,
    minWidth: 1200,
    minHeight: 760,
    backgroundColor: '#0a0a0a',
    title: 'GlideBlend',
    icon: getIconPath(),
    webPreferences: {
      preload: path.join(__dirname, 'preload.cjs'),
      contextIsolation: true,
      nodeIntegration: false,
      sandbox: false,
      backgroundThrottling: false,
    },
  });

  wireExternalNavigation(mainWindow);
  mainWindow.removeMenu();
  mainWindow.loadURL(appUrl);
  mainWindow.webContents.on('render-process-gone', (_event, details) => {
    logDesktopError('render-process-gone', JSON.stringify(details, null, 2));
    dialog.showErrorBox(
      'GlideBlend renderer crashed',
      'The app window stopped unexpectedly. A log was written to the GlideBlend user-data folder.',
    );
  });
  mainWindow.webContents.on('unresponsive', () => {
    logDesktopError('renderer-unresponsive', 'Renderer became unresponsive.');
  });
  mainWindow.on('closed', () => {
    mainWindow = null;
  });
}

async function boot() {
  registerIpcHandlers();

  if (!appUrl) {
    packagedServer = await startPackagedServer();
    appUrl = packagedServer.url;
  }

  createMainWindow();

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createMainWindow();
    }
  });
}

app.whenReady().then(boot);

process.on('uncaughtException', (error) => {
  logDesktopError('uncaughtException', error);
});

process.on('unhandledRejection', (error) => {
  logDesktopError('unhandledRejection', error);
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('will-quit', () => {
  if (packagedServer?.server) {
    packagedServer.server.close();
  }
});