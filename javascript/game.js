let canvas;
let world;
let keyboard = new Keyboard();
let menuVisible = false;
let gameOver = false;
let allowWinScreen = false;
let allowLoseScreen = false;

function init() {
    const loadingScreen = document.getElementById('loadingScreen');
    const mainMenu = document.getElementById('mainMenu');

    setTimeout(() => {
        loadingScreen.style.display = 'none';
        mainMenu.classList.remove('hidden');
        menuVisible = true;
        currentScreen = "menu";
    }, 2500);
}

function startGame() {
    document.getElementById('mainMenu').classList.add('hidden');
    stopMenuMusic();
    playGameMusic();
    canvas = document.getElementById('gameCanvas');
    world = new World(canvas, keyboard);
}

function openControls() {
    document.getElementById('mainMenu').classList.add('hidden');
    document.getElementById('controlsMenu').classList.remove('hidden');
}

function openAudioMenu() {
    document.getElementById('mainMenu').classList.add('hidden');
    document.getElementById('audioMenu').classList.remove('hidden');
    const checkbox = document.getElementById('audioCheckbox');
    if (checkbox) {
        checkbox.checked = audioEnabled;
    }
}

function backFromAudio() {
    document.getElementById('audioMenu').classList.add('hidden');
    document.getElementById('mainMenu').classList.remove('hidden');
}

function backToMenu() {
    document.getElementById('controlsMenu').classList.add('hidden');
    document.getElementById('mainMenu').classList.remove('hidden');
    stopGameMusic();
    playMenuMusic();
}

window.addEventListener('click', unlockAudio);

window.addEventListener('load', () => {
    initMenuSounds();
    init();
});

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