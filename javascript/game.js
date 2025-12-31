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

/**
 * Initializes the game on page load.
 */
function init() {
    hideImpressum();
    startLoadingSequence();
    enforceLandscapeMode();
}

/*** Starts the loading screen sequence.*/
function startLoadingSequence() {
    const loadingScreen = getElement('loadingScreen');
    const mainMenu = getElement('mainMenu');
    initTimeout = setTimeout(() => {
        loadingScreen.style.display = 'none';
        handleAutoStart(mainMenu);
    }, 2500);
}

/*** Handles auto-start logic or shows the main menu.
 * @param {HTMLElement} mainMenu*/
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

/*** Hides the impressum overlay.*/
function hideImpressum() {
    getElement('impressumOverlay').classList.add('hidden');
}

/*** Starts a new game.*/
function startGame() {
    clearInitTimeout();
    prepareGameView();
    startGameAudio();
    initWorldWithLoading();
}

/*** Clears the loading timeout.*/
function clearInitTimeout() {
    if (!initTimeout) return;
    clearTimeout(initTimeout);
    initTimeout = null;
}

/*** Prepares the UI for the game view.*/
function prepareGameView() {
    getElement('mainMenu').classList.add('hidden');
    getElement('loadingScreen').style.display = 'none';
    getElement('gameCanvas').style.display = 'block';
    getElement('gameLoading').classList.remove('hidden');
}

/*** Starts the game audio.*/
function startGameAudio() {
    stopMenuMusic();
    playGameMusic();
}

/*** Initializes the world with a minimum loading duration.*/
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

/*** Creates a new game world instance.*/
function createWorld() {
    gameId++;
    canvas = getElement('gameCanvas');
    world = new World(canvas, keyboard);
    currentScreen = 'game';
    initMobileControls();
    updateMobileControlsVisibility();
}

/*** Finalizes the loading screen.
 * @param {number} startTime
 * @param {number} minTime*/
function finalizeLoading(startTime, minTime) {
    const elapsed = Date.now() - startTime;
    const remaining = Math.max(0, minTime - elapsed);
    allTimeouts.push(setTimeout(() => {
        getElement('gameLoading').classList.add('hidden');
    }, remaining));
}

/*** Shows end options after a delay.*/
function showEndOptionsAfterDelay() {
    allTimeouts.push(setTimeout(showEndOptions, 5000));
}

/*** Displays the end options screen.*/
function showEndOptions() {
    hideElement('winScreen');
    hideElement('loseScreen');
    showElement('endOptionsScreen');
}

/*** Restarts the game.*/
function restartGame() {
    resetEndScreens();
    resetGameState();
    world = null;
    canvas = null;
    createWorld();
    restartGameAudio();
}

/*** Resets all end screens.*/
function resetEndScreens() {
    hideElement('winScreen');
    hideElement('loseScreen');
    hideElement('endOptionsScreen');
}

/*** Resets the game state.*/
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

/*** Clears all registered intervals.*/
function clearAllIntervals() {
    allIntervals.forEach(id => clearInterval(id));
    allIntervals = [];
}

/*** Clears all registered timeouts.*/
function clearAllTimeouts() {
    allTimeouts.forEach(id => clearTimeout(id));
    allTimeouts = [];
}

/*** Restarts game audio.*/
function restartGameAudio() {
    stopAllMusic();
    playGameMusic();
}

/*** Reloads the page and returns to menu.*/
function goToMenu() {
    location.reload();
}

/*** Opens the controls menu.*/
function openControls() {
    switchMenu('controlsMenu');
}

/*** Opens the audio menu.*/
function openAudioMenu() {
    switchMenu('audioMenu');
    syncAudioCheckbox();
}

/*** Returns from audio menu.*/
function backFromAudio() {
    switchMenu('mainMenu');
}

/*** Returns to main menu.*/
function backToMenu() {
    switchMenu('mainMenu');
    stopGameMusic();
    playMenuMusic();
}

/*** Opens the impressum.*/
function openImpressum() {
    switchMenu('impressumOverlay');
}

/*** Closes the impressum.*/
function closeImpressum() {
    switchMenu('mainMenu');
}

/*** Switches visible menu.
 * @param {string} targetId*/
function switchMenu(targetId) {
    hideAllMenus();
    showElement(targetId);
}

/*** Hides all menus.*/
function hideAllMenus() {
    ['mainMenu', 'controlsMenu', 'audioMenu', 'impressumOverlay']
        .forEach(hideElement);
}

/*** Syncs the audio checkbox state.*/
function syncAudioCheckbox() {
    const checkbox = getElement('audioCheckbox');
    if (checkbox) checkbox.checked = audioEnabled;
}

/*** Handles key down events.
 * @param {KeyboardEvent} event*/
function handleKeyDown(event) {
    setKeyState(event.keyCode, true);
}

/*** Handles key up events.
 * @param {KeyboardEvent} event*/
function handleKeyUp(event) {
    setKeyState(event.keyCode, false);
}

/*** Sets keyboard state.
 * @param {number} keyCode
 * @param {boolean} state*/
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

/*** Initializes mobile controls.*/
function initMobileControls() {
    if (window.innerWidth > 768) return;
    bindTouch('btnLeft', 'LEFT');
    bindTouch('btnRight', 'RIGHT');
    bindTouch('btnJump', 'UP');
    bindTouch('btnThrow', 'N');
}

/*** Binds touch controls.
 * @param {string} id
 * @param {string} key*/
function bindTouch(id, key) {
    const btn = getElement(id);
    if (!btn) return;
    btn.addEventListener('touchstart', e => setTouchKey(e, key, true));
    btn.addEventListener('touchend', e => setTouchKey(e, key, false));
    btn.addEventListener('touchcancel', () => keyboard[key] = false);
}

/*** Sets touch key state.
 * @param {Event} event
 * @param {string} key
 * @param {boolean} state*/
function setTouchKey(event, key, state) {
    event.preventDefault();
    keyboard[key] = state;
}

/*** Updates mobile controls visibility.*/
function updateMobileControlsVisibility() {
    const controls = getElement('mobileControls');
    if (!controls) return;
    const isMobile = window.innerWidth <= 768;
    controls.style.display = (isMobile && currentScreen === 'game') ? 'block' : 'none';
}

/*** Resizes the canvas.*/
function resizeCanvas() {
    canvas = getElement('gameCanvas');
    if (!canvas) return;
    window.innerWidth <= 768 ? scaleCanvas() : resetCanvasSize();
}

/*** Scales canvas for mobile view.*/
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

/*** Resets canvas to default size.*/
function resetCanvasSize() {
    canvas.width = BASE_WIDTH;
    canvas.height = BASE_HEIGHT;
    canvas.style.width = '720px';
    canvas.style.height = '480px';
}

/**
 * Enforces landscape mode on mobile devices.
 */
function enforceLandscapeMode() {
    const overlay = getElement('rotateOverlay');
    const isPortrait = window.innerHeight > window.innerWidth;
    overlay.style.display = (window.innerWidth < 1024 && isPortrait) ? 'flex' : 'none';
}

/**
 * Returns a DOM element by id.
 * @param {string} id
 * @returns {HTMLElement|null}
 */
function getElement(id) {
    return document.getElementById(id);
}

/*** Hides an element.
 * @param {string} id*/
function hideElement(id) {
    getElement(id)?.classList.add('hidden');
}

/**Shows an element.
 * @param {string} id*/
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