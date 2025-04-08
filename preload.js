const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('electron', {
  setKeybind: (keybind) => ipcRenderer.send('set-keybind', keybind),
  startClicker: (interval) => ipcRenderer.send('start-clicker', interval),
  stopClicker: () => ipcRenderer.send('stop-clicker'),
});
