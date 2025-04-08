const { app, BrowserWindow, ipcMain, globalShortcut } = require('electron');
const path = require('path');
const Store = require('electron-store').default;
const robot = require('robotjs'); // Make sure you have robotjs installed

const store = new Store();
let mainWindow;
let isRunning = false;
let intervalId = null;
let keybind = store.get('keybind');

// Function to create the window
function createWindow() {
  mainWindow = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      nodeIntegration: true,
    },
  });

  mainWindow.loadFile('index.html');
}

app.whenReady().then(() => {
  createWindow();

  // Register global shortcut keybind if it exists
  if (keybind) {
    globalShortcut.register(keybind, () => {
      toggleAutoclicker(); // Toggle the autoclicker on keypress
    });
  }

  // Handle the button click to toggle autoclicker
  ipcMain.on('toggle-autoclicker', () => {
    toggleAutoclicker();
  });

  // Handle setting a new keybind from renderer process
  ipcMain.on('set-keybind', (event, newKeybind) => {
    if (keybind) {
      globalShortcut.unregister(keybind); // Unregister the old keybind
    }

    keybind = newKeybind;

    if (newKeybind) {
      globalShortcut.register(newKeybind, () => {
        toggleAutoclicker();
      });
    }

    store.set('keybind', newKeybind); // Save new keybind to storage
  });

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow();
    }
  });
});

app.on('will-quit', () => {
  globalShortcut.unregisterAll(); // Clean up global shortcuts
});

// Function to toggle autoclicker
function toggleAutoclicker() {
  isRunning = !isRunning;

  // Update UI in renderer
  if (mainWindow) {
    mainWindow.webContents.send('autoclicker-status', isRunning);
  }

  if (isRunning) {
    console.log("Autoclicker started");
    // Start clicking at the specified interval
    startClicking();
  } else {
    console.log("Autoclicker stopped");
    // Stop the clicking process
    stopClicking();
  }
}

function startClicking() {
  const interval = 100; // Default interval if none provided
  intervalId = setInterval(() => {
    // Simulate a left mouse click
    robot.mouseClick();
  }, interval);
}

function stopClicking() {
  // Clear the interval to stop clicking
  if (intervalId) {
    clearInterval(intervalId);
    intervalId = null;
  }
}
