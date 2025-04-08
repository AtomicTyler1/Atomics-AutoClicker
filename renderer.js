const startStopBtn = document.getElementById('startStopBtn');
const intervalInput = document.getElementById('interval');
const keybindInput = document.getElementById('keybind');
const themeToggle = document.getElementById('theme-toggle');
const resetKeybindBtn = document.getElementById('resetKeybindBtn');

let isRunning = false;

// Load saved keybind from localStorage
let savedKeybind = localStorage.getItem('keybind');
if (savedKeybind) {
  keybindInput.value = savedKeybind;
} else {
  keybindInput.value = 'Press a key';
}

// Keybind functionality
keybindInput.addEventListener('click', () => {
  keybindInput.value = ''; // Clear the input to listen for keypress
  keybindInput.placeholder = 'Press a key...';
});

document.addEventListener('keydown', (event) => {
  // If we're in the keybind input box and it's empty, set the keybind
  if (keybindInput === document.activeElement && keybindInput.value === '') {
    const key = event.key;
    keybindInput.value = key;
    localStorage.setItem('keybind', key); // Save keybind to localStorage
    savedKeybind = key; // Update the saved keybind
    keybindInput.placeholder = 'Keybind set';
    
    // Send the keybind to the main process to register the global shortcut
    window.electron.setKeybind(key);
  }
});

// Theme toggle functionality
themeToggle.addEventListener('change', () => {
  if (themeToggle.checked) {
    document.body.setAttribute('data-theme', 'light');
  } else {
    document.body.setAttribute('data-theme', 'dark');
  }
});

// Start/Stop functionality for autoclicker
startStopBtn.addEventListener('click', () => {
  console.log("Start/Stop button clicked");
  toggleAutoclicker();
});

function toggleAutoclicker() {
  if (isRunning) {
    startStopBtn.textContent = 'Start';
    window.electron.stopClicker();
  } else {
    startStopBtn.textContent = 'Stop';
    const interval = parseInt(intervalInput.value) || 100;
    window.electron.startClicker(interval);
  }
  isRunning = !isRunning;
}

// Reset keybind functionality
resetKeybindBtn.addEventListener('click', () => {
  localStorage.removeItem('keybind');
  keybindInput.value = 'Press a key';
  keybindInput.placeholder = 'Keybind reset';

  // Send the reset event to the main process to remove the keybind
  window.electron.setKeybind(null);
});
