const startStopBtn = document.getElementById('startStopBtn');
const keybindInput = document.getElementById('keybind');
const themeToggle = document.getElementById('theme-toggle');
const resetKeybindBtn = document.getElementById('resetKeybindBtn');
const Interval = document.getElementById('interval')
const imageButtons = document.querySelectorAll('.image-button img');

let isRunning = false;

//-----------------------------------------------------//

//██╗░░██╗███████╗██╗░░░██╗██████╗░██╗███╗░░██╗██████╗░
//██║░██╔╝██╔════╝╚██╗░██╔╝██╔══██╗██║████╗░██║██╔══██╗
//█████═╝░█████╗░░░╚████╔╝░██████╦╝██║██╔██╗██║██║░░██║
//██╔═██╗░██╔══╝░░░░╚██╔╝░░██╔══██╗██║██║╚████║██║░░██║
//██║░╚██╗███████╗░░░██║░░░██████╦╝██║██║░╚███║██████╔╝
//╚═╝░░╚═╝╚══════╝░░░╚═╝░░░╚═════╝░╚═╝╚═╝░░╚══╝╚═════╝░

//-----------------------------------------------------//

let savedKeybind = localStorage.getItem('keybind');
if (savedKeybind) {
  keybindInput.value = savedKeybind;
} else {
  keybindInput.value = 'Press a key';
}

keybindInput.addEventListener('click', () => {
  keybindInput.value = '';
  keybindInput.placeholder = 'Press a key...';
});

document.addEventListener('keydown', (event) => {
  if (keybindInput === document.activeElement && keybindInput.value === '') {
    const key = event.key;
    keybindInput.value = key;
    localStorage.setItem('keybind', key);
    savedKeybind = key;
    keybindInput.placeholder = 'Keybind set';
    
    window.electron.setKeybind(key);
  }
});

resetKeybindBtn.addEventListener('click', () => {
  localStorage.removeItem('keybind');
  keybindInput.value = 'Press a key';
  keybindInput.placeholder = 'Keybind reset';

  window.electron.setKeybind(null);
});

//-------------------------------------------//

//░█████╗░████████╗██╗░░██╗███████╗██████╗░
//██╔══██╗╚══██╔══╝██║░░██║██╔════╝██╔══██╗
//██║░░██║░░░██║░░░███████║█████╗░░██████╔╝
//██║░░██║░░░██║░░░██╔══██║██╔══╝░░██╔══██╗
//╚█████╔╝░░░██║░░░██║░░██║███████╗██║░░██║
//░╚════╝░░░░╚═╝░░░╚═╝░░╚═╝╚══════╝╚═╝░░╚═╝

//-------------------------------------------//

window.electron.onAutoclickerStatus((status) => {
  isRunning = status;
  startStopBtn.textContent = isRunning ? 'Stop Clicking' : 'Start Clicking';
});

function updateCPSDisplay(interval) {
  const cpsDisplay = document.getElementById('cps');
  if (interval && interval >= 1) {
    const cps = (1000 / interval).toFixed(2);
    cpsDisplay.textContent = `Predicted CPS per second: ${cps}`;
  } else if (interval && interval < 1 ) {
    cpsDisplay.textContent = 'Predicted CPS per second: 1000';
  } else {
    cpsDisplay.textContent = 'Predicted CPS per second: Invalid interval';
  }

}

Interval.addEventListener('input', () => {
  const interval = parseFloat(Interval.value);
  updateCPSDisplay(interval);
});

const interval = parseFloat(Interval.value);
updateCPSDisplay(interval);

//-------------------------------------------//

//████████╗██╗░░██╗███████╗███╗░░░███╗███████╗
//╚══██╔══╝██║░░██║██╔════╝████╗░████║██╔════╝
//░░░██║░░░███████║█████╗░░██╔████╔██║█████╗░░
//░░░██║░░░██╔══██║██╔══╝░░██║╚██╔╝██║██╔══╝░░
//░░░██║░░░██║░░██║███████╗██║░╚═╝░██║███████╗
//░░░╚═╝░░░╚═╝░░╚═╝╚══════╝╚═╝░░░░░╚═╝╚══════╝

//-------------------------------------------//

let savedTheme = localStorage.getItem('theme') || 'dark';
document.body.setAttribute('data-theme', savedTheme);
themeToggle.checked = savedTheme === 'light'; 

themeToggle.addEventListener('change', () => {
  const newTheme = themeToggle.checked ? 'light' : 'dark';
  document.body.setAttribute('data-theme', newTheme);
  localStorage.setItem('theme', newTheme);

  updateThemeImages(newTheme);
});

function updateThemeImages(theme) {
  imageButtons.forEach(img => {
    img.src = img.getAttribute(`data-${theme}`);
  });
}

updateThemeImages(savedTheme);


//-------------------------------------------------------------------------------------//


//░█████╗░██╗░░░██╗████████╗░█████╗░░█████╗░██╗░░░░░██╗░█████╗░██╗░░██╗███████╗██████╗░
//██╔══██╗██║░░░██║╚══██╔══╝██╔══██╗██╔══██╗██║░░░░░██║██╔══██╗██║░██╔╝██╔════╝██╔══██╗
//███████║██║░░░██║░░░██║░░░██║░░██║██║░░╚═╝██║░░░░░██║██║░░╚═╝█████═╝░█████╗░░██████╔╝
//██╔══██║██║░░░██║░░░██║░░░██║░░██║██║░░██╗██║░░░░░██║██║░░██╗██╔═██╗░██╔══╝░░██╔══██╗
//██║░░██║╚██████╔╝░░░██║░░░╚█████╔╝╚█████╔╝███████╗██║╚█████╔╝██║░╚██╗███████╗██║░░██║
//╚═╝░░╚═╝░╚═════╝░░░░╚═╝░░░░╚════╝░░╚════╝░╚══════╝╚═╝░╚════╝░╚═╝░░╚═╝╚══════╝╚═╝░░╚═╝

//-------------------------------------------------------------------------------------//

startStopBtn.addEventListener('click', () => {
  console.log("Start/Stop button clicked");
  toggleAutoclicker();
});

function toggleAutoclicker() {
  if (isRunning) {
    startStopBtn.textContent = 'Start Clicking';
  } else {
    startStopBtn.textContent = 'Stop Clicking';
  }

  const intervalV = parseInt(document.getElementById('interval').value, 10) || 1;

  console.log(intervalV)

  window.electron.toggleAutoclicker(intervalV);
  isRunning = !isRunning;
}