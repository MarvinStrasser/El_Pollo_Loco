let canvas;
let world;
let keyboard = new Keyboard();
let audioEnabled = true;

function init() {
    const loadingScreen = document.getElementById('loadingScreen');
    const mainMenu = document.getElementById('mainMenu');

    setTimeout(() => {
        loadingScreen.style.display = 'none';
        mainMenu.classList.remove('hidden');
    }, 2500);
}

function startGame() {
    document.getElementById('mainMenu').classList.add('hidden');

    canvas = document.getElementById("gameCanvas");
    world = new World(canvas, keyboard);
}

function openControls() {
    document.getElementById('mainMenu').classList.add('hidden');
    document.getElementById('controlsMenu').classList.remove('hidden');
}
function backToMenu() {
    document.getElementById('controlsMenu').classList.add('hidden');
    document.getElementById('mainMenu').classList.remove('hidden');
}

function toggleAudio() {
    audioEnabled = !audioEnabled;
    console.log('Audio:', audioEnabled ? 'AN' : 'AUS');
}

window.addEventListener('keydown', (e) => {
    if (e.keyCode == 39) keyboard.RIGHT = true;
    if (e.keyCode == 37) keyboard.LEFT = true;
    if (e.keyCode == 38) keyboard.UP = true;
    if (e.keyCode == 40) keyboard.DOWN = true;
    if (e.keyCode == 32) keyboard.SPACE = true;
    if (e.keyCode == 78) keyboard.N = true;
});

window.addEventListener('keyup', (e) => {
    if (e.keyCode == 39) keyboard.RIGHT = false;
    if (e.keyCode == 37) keyboard.LEFT = false;
    if (e.keyCode == 38) keyboard.UP = false;
    if (e.keyCode == 40) keyboard.DOWN = false;
    if (e.keyCode == 32) keyboard.SPACE = false;
    if (e.keyCode == 78) keyboard.N = false;
});