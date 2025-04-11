const { app, BrowserWindow, ipcMain, globalShortcut, shell } = require('electron');
const Renderer = require('electron/renderer');
const path = require('path');
const Store = require('electron-store').default;
const robot = require('robotjs');

const store = new Store();
let mainWindow;
let isRunning = false;
let intervalId = null;
let keybind = store.get('keybind');

function createWindow() {
  mainWindow = new BrowserWindow({
    minWidth: 465,
    minHeight: 627,
    width: 465,
    height: 627,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      nodeIntegration: true,
    },
  });

  mainWindow.webContents.setWindowOpenHandler(({ url }) => {
    shell.openExternal(url);
    return { action: 'deny' };
  });

  mainWindow.setMenu(null);
  mainWindow.loadFile('index.html');
}

app.whenReady().then(() => {
  createWindow();

  if (keybind) {
    globalShortcut.register(keybind, () => {
      if (mainWindow) {
        mainWindow.webContents.send('request-interval');
      }
    });
  }

  ipcMain.on('send-interval', (event, interval) => {
    toggleAutoclicker(interval);
  });
  
  ipcMain.on('toggle-autoclicker', (event, interval) => {
    toggleAutoclicker(interval);
  });  

  ipcMain.on('set-keybind', (event, newKeybind) => {
    if (keybind) {
      globalShortcut.unregister(keybind);
    }

    keybind = newKeybind;

    if (newKeybind) {
      globalShortcut.register(newKeybind, () => {
        toggleAutoclicker();
      });
    }

    store.set('keybind', newKeybind);
  });

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow();
    }
  });
});

app.on('will-quit', () => {
  globalShortcut.unregisterAll();
});

function toggleAutoclicker(interval) {
  isRunning = !isRunning;

  if (mainWindow) {
    mainWindow.webContents.send('autoclicker-status', isRunning);
  }

  if (isRunning) {
    console.log("Autoclicker started. Interval = ",interval);
    startClicking(interval);
  } else {
    console.log("Autoclicker stopped");
    stopClicking();
  }
}

function startClicking(interval) {
  const delay = Number(interval) || 1;
  intervalId = setInterval(() => {
    robot.mouseClick();
  }, delay);
}

function stopClicking() {
  if (intervalId) {
    clearInterval(intervalId);
    intervalId = null;
  }
}
