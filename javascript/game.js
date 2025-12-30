let canvas;
let world;
let keyboard = new Keyboard();
let gameOver = false;
let allowWinScreen = false;
let allowLoseScreen = false;
let initTimeout;
const BASE_WIDTH = 720;
const BASE_HEIGHT = 480;

/* =========================
   INITIALIZATION
========================= */

/**
 * Initializes the game on page load.
 */
function init() {
    hideImpressum();
    startLoadingSequence();
    enforceLandscapeMode();
}

/**
 * Starts the loading screen logic.
 */
function startLoadingSequence() {
    const loadingScreen = getElement('loadingScreen');
    const mainMenu = getElement('mainMenu');
    initTimeout = setTimeout(() => {
        loadingScreen.style.display = 'none';
        handleAutoStart(mainMenu);
    }, 2500);
}

/**
 * Handles auto start or menu display.
 * @param {HTMLElement} mainMenu
 */
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

/**
 * Hides the impressum overlay.
 */
function hideImpressum() {
    getElement('impressumOverlay').classList.add('hidden');
}

/* =========================
   GAME START
========================= */
/**
 * Starts a new game.
 */
function startGame() {
    clearInitTimeout();
    prepareGameView();
    startGameAudio();
    initWorldWithLoading();
}

/**
 * Clears loading timeout.
 */
function clearInitTimeout() {
    if (!initTimeout) return;
    clearTimeout(initTimeout);
    initTimeout = null;
}

/**
 * Prepares UI for game view.
 */
function prepareGameView() {
    getElement('mainMenu').classList.add('hidden');
    getElement('loadingScreen').style.display = 'none';
    getElement('gameCanvas').style.display = 'block';
    getElement('gameLoading').classList.remove('hidden');
}

/**
 * Starts game music.
 */
function startGameAudio() {
    stopMenuMusic();
    playGameMusic();
}

/**
 * Initializes the world with a minimum loading time.
 */
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

/**
 * Creates the game world.
 */
function createWorld() {
    canvas = getElement('gameCanvas');
    world = new World(canvas, keyboard);
    currentScreen = 'game';
    initMobileControls();
    updateMobileControlsVisibility();
}

/**
 * Finalizes loading screen.
 * @param {number} startTime
 * @param {number} minTime
 */
function finalizeLoading(startTime, minTime) {
    const elapsed = Date.now() - startTime;
    const remaining = Math.max(0, minTime - elapsed);
    setTimeout(() => {
        getElement('gameLoading').classList.add('hidden');
    }, remaining);
}

/* =========================
   GAME END & RESTART
========================= */
/**
 * Shows end options after delay.
 */
function showEndOptionsAfterDelay() {
    setTimeout(showEndOptions, 5000);
}

/**
 * Displays end option screen.
 */
function showEndOptions() {
    hideElement('winScreen');
    hideElement('loseScreen');
    showElement('endOptionsScreen');
}

/**
 * Restarts the game.
 */
function restartGame() {
    resetEndScreens();
    resetGameState();
    createWorld();
    restartGameAudio();
}

/**
 * Resets end screens.
 */
function resetEndScreens() {
    hideElement('winScreen');
    hideElement('loseScreen');
    hideElement('endOptionsScreen');
}

/**
 * Resets game state.
 */
function resetGameState() {
    gameOver = false;
    allowWinScreen = false;
    allowLoseScreen = false;
    currentScreen = 'game';
}

/**
 * Restarts audio for game.
 */
function restartGameAudio() {
    stopAllMusic();
    playGameMusic();
}

/**
 * Reloads the page.
 */
function goToMenu() {
    location.reload();
}

/* =========================
   MENUS
========================= */

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

/**
 * Switches visible menu.
 * @param {string} targetId
 */
function switchMenu(targetId) {
    hideAllMenus();
    showElement(targetId);
}

/**
 * Hides all menus.
 */
function hideAllMenus() {
    ['mainMenu', 'controlsMenu', 'audioMenu', 'impressumOverlay']
        .forEach(hideElement);
}

/**
 * Syncs audio checkbox state.
 */
function syncAudioCheckbox() {
    const checkbox = getElement('audioCheckbox');
    if (checkbox) checkbox.checked = audioEnabled;
}

/* =========================
   INPUT HANDLING
========================= */

/**
 * Handles key down.
 * @param {KeyboardEvent} event
 */
function handleKeyDown(event) {
    setKeyState(event.keyCode, true);
}

/**
 * Handles key up.
 * @param {KeyboardEvent} event
 */
function handleKeyUp(event) {
    setKeyState(event.keyCode, false);
}

/**
 * Sets keyboard state.
 * @param {number} keyCode
 * @param {boolean} state
 */
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

/* =========================
   MOBILE CONTROLS
========================= */

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

/* =========================
   CANVAS & ORIENTATION
========================= */

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

/* =========================
   HELPERS
========================= */

function getElement(id) {
    return document.getElementById(id);
}

function hideElement(id) {
    getElement(id)?.classList.add('hidden');
}

function showElement(id) {
    getElement(id)?.classList.remove('hidden');
}

/* =========================
   EVENT LISTENERS
========================= */

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