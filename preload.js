const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('electron', {
  toggleAutoclicker: (interval) => ipcRenderer.send('toggle-autoclicker', interval),
  setKeybind: (keybind) => ipcRenderer.send('set-keybind', keybind),
  onAutoclickerStatus: (callback) => ipcRenderer.on('autoclicker-status', (event, status) => callback(status)),
});

ipcRenderer.on('request-interval', () => {
  const input = document.getElementById('interval');
  let interval = parseFloat(input.value);

  if (isNaN(interval) || interval < 1) {
    interval = 1;
  }

  ipcRenderer.send('send-interval', interval);
});
