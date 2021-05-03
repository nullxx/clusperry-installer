const path = require('path');

const { app, BrowserWindow, ipcMain } = require('electron');
const isDev = require('electron-is-dev');
const { mountImage, unmountImage, ejectImage } = require('../src/lib/utils');

let installExtension, REACT_DEVELOPER_TOOLS;

if (isDev) {
  const devTools = require('electron-devtools-installer');
  installExtension = devTools.default;
  REACT_DEVELOPER_TOOLS = devTools.REACT_DEVELOPER_TOOLS;
}

if (require('electron-squirrel-startup')) {
  app.quit();
}

function createWindow() {
  // Create the browser window.
  const win = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      nodeIntegration: true,
    },
  });

  win.loadURL(
    isDev
      ? 'http://localhost:3000'
      : `file://${path.join(__dirname, '../build/index.html')}`
  );

  // Open the DevTools.
  if (isDev) {
    win.webContents.openDevTools({ mode: 'detach' });
  }
}

app.whenReady().then(() => {
  createWindow();

  if (isDev) {
    installExtension(REACT_DEVELOPER_TOOLS)
      .then((name) => console.log(`Added Extension:  ${name}`))
      .catch((error) => console.log(`An error occurred: , ${error}`));
  }
}); // UPDATED!

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', () => {
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  }
});

ipcMain.handle('openImage', async (event, ...args) => {
  console.log('openImage', args);
  const result = await mountImage(args);
  return result;
});

ipcMain.handle('closeImage', async (event, ...args) => {
  console.log('closeImage', args);
  const result = await unmountImage(args);
  return result;
});

ipcMain.handle('ejectImage', async (event, ...args) => {
  console.log('ejectImage', args);
  const result = await ejectImage(args);
  return result;
});

ipcMain.on('quit', () => {
  app.quit();
});