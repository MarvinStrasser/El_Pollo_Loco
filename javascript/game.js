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
    document.getElementById('impressumOverlay').classList.add('hidden')

    initTimeout = setTimeout(() => {
        loadingScreen.style.display = 'none';

        if (sessionStorage.getItem('autoStartGame') === 'true') {
            sessionStorage.removeItem('autoStartGame');
            startGame();
        } else {
            mainMenu.classList.remove('hidden');
            currentScreen = "menu";
        }
    }, 2500);
}

function startGame() {
    if (initTimeout) {
        clearTimeout(initTimeout);
        initTimeout = null;
    }
    const mainMenu = document.getElementById('mainMenu');
    const loadingScreen = document.getElementById('loadingScreen');
    const canvas = document.getElementById('gameCanvas');
    mainMenu.classList.add('hidden');
    loadingScreen.style.display = 'none';
    canvas.style.display = 'block';
    currentScreen = "game";
    stopMenuMusic();
    playGameMusic();
    world = new World(canvas, keyboard);
}

function showEndOptionsAfterDelay() {
    setTimeout(() => {
        document.getElementById('winScreen').classList.add('hidden');
        document.getElementById('loseScreen').classList.add('hidden');
        document.getElementById('endOptionsScreen').classList.remove('hidden');
    }, 5000);
}

function restartGame() {
    document.getElementById('winScreen')?.classList.add('hidden');
    document.getElementById('loseScreen')?.classList.add('hidden');
    document.getElementById('endOptionsScreen')?.classList.add('hidden');
    gameOver = false;
    allowWinScreen = false;
    allowLoseScreen = false;

    // 🎮 Neues Spiel starten (ohne Reload)
    const canvas = document.getElementById('gameCanvas');
    world = new World(canvas, keyboard);

    currentScreen = "game";

    // 🎵 Musik
    stopAllMusic();
    playGameMusic();
}

function goToMenu() {
    location.reload();
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

function openImpressum() {
    document.getElementById('mainMenu').classList.add('hidden');
    document.getElementById('impressumOverlay').classList.remove('hidden');
}

function closeImpressum() {
    document.getElementById('impressumOverlay').classList.add('hidden');
    document.getElementById('mainMenu').classList.remove('hidden');
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