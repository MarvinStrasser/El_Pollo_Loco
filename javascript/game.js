let canvas;
let world;
let keyboard = new Keyboard();
let menuVisible = false;
let gameOver = false;
let allowWinScreen = false;
let allowLoseScreen = false;
const BASE_WIDTH = 720;
const BASE_HEIGHT = 480;

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
    enforceLandscapeMode();
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
    initMobileControls();
    updateMobileControlsVisibility();
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
    currentScreen = "controls";
    updateMobileControlsVisibility();

    document.getElementById('mainMenu').classList.add('hidden');
    document.getElementById('controlsMenu').classList.remove('hidden');
}

function openAudioMenu() {
    currentScreen = "audio";
    updateMobileControlsVisibility();

    document.getElementById('mainMenu').classList.add('hidden');
    document.getElementById('audioMenu').classList.remove('hidden');

    const checkbox = document.getElementById('audioCheckbox');
    if (checkbox) checkbox.checked = audioEnabled;
}

function backFromAudio() {
    document.getElementById('audioMenu').classList.add('hidden');
    document.getElementById('mainMenu').classList.remove('hidden');
}

function backFromAudio() {
    currentScreen = "menu";
    updateMobileControlsVisibility();

    document.getElementById('audioMenu').classList.add('hidden');
    document.getElementById('mainMenu').classList.remove('hidden');
}

function openImpressum() {
    currentScreen = "impressum";
    updateMobileControlsVisibility();

    document.getElementById('mainMenu').classList.add('hidden');
    document.getElementById('impressumOverlay').classList.remove('hidden');
}

function closeImpressum() {
    currentScreen = "menu";
    updateMobileControlsVisibility();

    document.getElementById('impressumOverlay').classList.add('hidden');
    document.getElementById('mainMenu').classList.remove('hidden');
}

window.addEventListener('click', unlockAudio);

window.addEventListener('load', () => {
    initMenuSounds();
    init();
    updateMobileControlsVisibility(); // 👈 Initial ausblenden
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

function initMobileControls() {
    if (window.innerWidth > 768) return; // nur Mobile

    bindTouch('btnLeft', 'LEFT');
    bindTouch('btnRight', 'RIGHT');
    bindTouch('btnJump', 'UP');
    bindTouch('btnThrow', 'N'); // N = werfen (wie bei dir)
}

function bindTouch(id, key) {
    const btn = document.getElementById(id);
    if (!btn) return;

    btn.addEventListener('touchstart', e => {
        e.preventDefault();
        keyboard[key] = true;
    });

    btn.addEventListener('touchend', e => {
        e.preventDefault();
        keyboard[key] = false;
    });

    btn.addEventListener('touchcancel', () => {
        keyboard[key] = false;
    });
}

function updateMobileControlsVisibility() {
    const controls = document.getElementById('mobileControls');
    if (!controls) return;

    const isMobile = window.innerWidth <= 768;
    const isGame = currentScreen === 'game';

    controls.style.display = (isMobile && isGame) ? 'block' : 'none';
}

function resizeCanvas() {
    const canvas = document.getElementById('gameCanvas');
    if (!canvas) return;

    if (window.innerWidth <= 768) {
        const scale = Math.min(
            window.innerWidth / BASE_WIDTH,
            window.innerHeight / BASE_HEIGHT
        );

        canvas.width = BASE_WIDTH * scale;
        canvas.height = BASE_HEIGHT * scale;

        canvas.style.width = '100vw';
        canvas.style.height = '100vh';
    } else {
        canvas.width = BASE_WIDTH;
        canvas.height = BASE_HEIGHT;

        canvas.style.width = '720px';
        canvas.style.height = '480px';
    }
}

window.addEventListener('resize', resizeCanvas);
window.addEventListener('orientationchange', resizeCanvas);

function enforceLandscapeMode() {
    const overlay = document.getElementById('rotateOverlay');
    const canvas = document.getElementById('gameWrapper');

    const isMobile = window.innerWidth < 1024;
    const isPortrait = window.innerHeight > window.innerWidth;

    if (isMobile && isPortrait) {
        overlay.style.display = 'flex';
        if (canvas) canvas.style.display = 'none';
    } else {
        overlay.style.display = 'none';
        if (canvas) canvas.style.display = 'flex';
    }
}

window.addEventListener('resize', enforceLandscapeMode);
window.addEventListener('orientationchange', enforceLandscapeMode);

