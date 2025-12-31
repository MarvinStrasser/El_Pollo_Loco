let canvas;
let world;
let keyboard = new Keyboard();
let gameOver = false;
let allowWinScreen = false;
let allowLoseScreen = false;
let initTimeout;
let allIntervals = [];
let allTimeouts = [];
let gameId = 0;
const BASE_WIDTH = 720;
const BASE_HEIGHT = 480;


function init() {
    hideImpressum();
    startLoadingSequence();
    enforceLandscapeMode();
}

function startLoadingSequence() {
    const loadingScreen = getElement('loadingScreen');
    const mainMenu = getElement('mainMenu');
    initTimeout = setTimeout(() => {
        loadingScreen.style.display = 'none';
        handleAutoStart(mainMenu);
    }, 2500);
}

function handleAutoStart(mainMenu) {
    if (sessionStorage.getItem('autoStartGame') === 'true') {
        sessionStorage.removeItem('autoStartGame');
        startGame();
    } else {
        mainMenu.classList.remove('hidden');
        currentScreen = 'menu';
        updateMobileControlsVisibility();
    }
}

function hideImpressum() {
    getElement('impressumOverlay').classList.add('hidden');
}

function startGame() {
    clearInitTimeout();
    prepareGameView();
    startGameAudio();
    initWorldWithLoading();
}

function clearInitTimeout() {
    if (!initTimeout) return;
    clearTimeout(initTimeout);
    initTimeout = null;
}

function prepareGameView() {
    getElement('mainMenu').classList.add('hidden');
    getElement('loadingScreen').style.display = 'none';
    getElement('gameCanvas').style.display = 'block';
    getElement('gameLoading').classList.remove('hidden');
}

function startGameAudio() {
    stopMenuMusic();
    playGameMusic();
}

function initWorldWithLoading() {
    const startTime = Date.now();
    const MIN_LOADING_TIME = 700;
    requestAnimationFrame(() => {
        requestAnimationFrame(() => {
            createWorld();
            finalizeLoading(startTime, MIN_LOADING_TIME);
        });
    });
}

function createWorld() {
    gameId++;
    canvas = getElement('gameCanvas');
    world = new World(canvas, keyboard);
    currentScreen = 'game';
    initMobileControls();
    updateMobileControlsVisibility();
}

function finalizeLoading(startTime, minTime) {
    const elapsed = Date.now() - startTime;
    const remaining = Math.max(0, minTime - elapsed);
    allTimeouts.push(setTimeout(() => {
        getElement('gameLoading').classList.add('hidden');
    }, remaining));
}


function showEndOptionsAfterDelay() {
    allTimeouts.push(setTimeout(showEndOptions, 5000));
}

function showEndOptions() {
    hideElement('winScreen');
    hideElement('loseScreen');
    showElement('endOptionsScreen');
}

function restartGame() {
    resetEndScreens();
    resetGameState();

    world = null;
    canvas = null;
    createWorld();
    restartGameAudio();
}

function resetEndScreens() {
    hideElement('winScreen');
    hideElement('loseScreen');
    hideElement('endOptionsScreen');
}

function resetGameState() {
    gameOver = false;
    allowWinScreen = false;
    allowLoseScreen = false;
    currentScreen = 'game';
    stopFootsteps();
    stopSnoringSound();
    clearAllIntervals();
    clearAllTimeouts();
}

function clearAllIntervals() {
    allIntervals.forEach(id => clearInterval(id));
    allIntervals = [];
}

function clearAllTimeouts() {
    allTimeouts.forEach(id => clearTimeout(id));
    allTimeouts = [];
}

function restartGameAudio() {
    stopAllMusic();
    playGameMusic();
}

function goToMenu() {
    location.reload();
}

function openControls() {
    switchMenu('controlsMenu');
}

function openAudioMenu() {
    switchMenu('audioMenu');
    syncAudioCheckbox();
}

function backFromAudio() {
    switchMenu('mainMenu');
}

function backToMenu() {
    switchMenu('mainMenu');
    stopGameMusic();
    playMenuMusic();
}

function openImpressum() {
    switchMenu('impressumOverlay');
}

function closeImpressum() {
    switchMenu('mainMenu');
}

function switchMenu(targetId) {
    hideAllMenus();
    showElement(targetId);
}

function hideAllMenus() {
    ['mainMenu', 'controlsMenu', 'audioMenu', 'impressumOverlay']
        .forEach(hideElement);
}

function syncAudioCheckbox() {
    const checkbox = getElement('audioCheckbox');
    if (checkbox) checkbox.checked = audioEnabled;
}

function handleKeyDown(event) {
    setKeyState(event.keyCode, true);
}

function handleKeyUp(event) {
    setKeyState(event.keyCode, false);
}

function setKeyState(keyCode, state) {
    const keyMap = {
        37: 'LEFT',
        38: 'UP',
        39: 'RIGHT',
        40: 'DOWN',
        32: 'SPACE',
        78: 'N'
    };
    if (keyMap[keyCode]) keyboard[keyMap[keyCode]] = state;
}

function initMobileControls() {
    if (window.innerWidth > 768) return;
    bindTouch('btnLeft', 'LEFT');
    bindTouch('btnRight', 'RIGHT');
    bindTouch('btnJump', 'UP');
    bindTouch('btnThrow', 'N');
}

function bindTouch(id, key) {
    const btn = getElement(id);
    if (!btn) return;
    btn.addEventListener('touchstart', e => setTouchKey(e, key, true));
    btn.addEventListener('touchend', e => setTouchKey(e, key, false));
    btn.addEventListener('touchcancel', () => keyboard[key] = false);
}

function setTouchKey(event, key, state) {
    event.preventDefault();
    keyboard[key] = state;
}

function updateMobileControlsVisibility() {
    const controls = getElement('mobileControls');
    if (!controls) return;
    const isMobile = window.innerWidth <= 768;
    controls.style.display = (isMobile && currentScreen === 'game') ? 'block' : 'none';
}

function resizeCanvas() {
    canvas = getElement('gameCanvas');
    if (!canvas) return;
    window.innerWidth <= 768 ? scaleCanvas() : resetCanvasSize();
}

function scaleCanvas() {
    const scale = Math.min(
        window.innerWidth / BASE_WIDTH,
        window.innerHeight / BASE_HEIGHT
    );
    canvas.width = BASE_WIDTH * scale;
    canvas.height = BASE_HEIGHT * scale;
    canvas.style.width = '100vw';
    canvas.style.height = '100vh';
}

function resetCanvasSize() {
    canvas.width = BASE_WIDTH;
    canvas.height = BASE_HEIGHT;
    canvas.style.width = '720px';
    canvas.style.height = '480px';
}

function enforceLandscapeMode() {
    const overlay = getElement('rotateOverlay');
    const isPortrait = window.innerHeight > window.innerWidth;
    overlay.style.display = (window.innerWidth < 1024 && isPortrait) ? 'flex' : 'none';
}

function getElement(id) {
    return document.getElementById(id);
}

function hideElement(id) {
    getElement(id)?.classList.add('hidden');
}

function showElement(id) {
    getElement(id)?.classList.remove('hidden');
}

window.addEventListener('load', () => {
    initMenuSounds();
    init();
});

window.addEventListener('click', unlockAudio);
window.addEventListener('keydown', handleKeyDown);
window.addEventListener('keyup', handleKeyUp);
window.addEventListener('resize', resizeCanvas);
window.addEventListener('orientationchange', resizeCanvas);
window.addEventListener('resize', enforceLandscapeMode);
window.addEventListener('orientationchange', enforceLandscapeMode);