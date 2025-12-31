let audioEnabled = true;
let audioUnlocked = false;
let currentScreen = "loading";

let menuMusic;
let gameMusic;
let buttonSound;
let coinSound;
let bottleSound;
let bottleThrowSound;
let bottleSplashSound;
let chickenSplatSound;
let snoringSound;
let bossMusic;
let bossSound;
let bossDeathSound;
let footsteps;
let jumpSound;
let winMusic;
let loseMusic;
let hurtSound;
let bossHitSound;

/**
 * Initializes all menu and game sounds.
 */
function initMenuSounds() {
    loadAudioSetting();
    initBackgroundMusic();
    initEffectSounds();
    initBossSounds();
    initResultSounds();
    muteIfDisabled();
}

/**
 * Loads the audio enabled setting from localStorage.
 */
function loadAudioSetting() {
    const stored = localStorage.getItem('audioEnabled');
    if (stored !== null) audioEnabled = stored === 'true';
}

/**
 * Initializes menu and game background music.
 */
function initBackgroundMusic() {
    menuMusic = new Audio('./audio/background_music.mp3');
    menuMusic.loop = true;
    menuMusic.volume = 0.3;

    gameMusic = new Audio('./audio/main_menu_music.mp3');
    gameMusic.loop = true;
    gameMusic.volume = 0.2;
}

/**
 * Initializes common effect sounds.
 */
function initEffectSounds() {
    buttonSound = new Audio('./audio/button.mp3');
    buttonSound.volume = 0.8;
    coinSound = new Audio('./audio/coin_collect.mp3');
    coinSound.volume = 0.2;
    bottleSound = new Audio('./audio/bottle_collect.mp3');
    bottleSound.volume = 0.9;
    bottleThrowSound = new Audio('./audio/throwing.mp3');
    bottleThrowSound.volume = 0.8;
    bottleSplashSound = new Audio('./audio/bottle_splash.mp3');
    bottleSplashSound.volume = 0.3;
    chickenSplatSound = new Audio('./audio/splat.mp3');
    chickenSplatSound.volume = 0.8;
    footsteps = new Audio('./audio/footsteps.mp3');
    footsteps.loop = true;
    footsteps.volume = 0.8;
    jumpSound = new Audio('./audio/Jump.mp3');
    jumpSound.volume = 0.6;
    hurtSound = new Audio('./audio/hurt.mp3');
    hurtSound.volume = 0.6;
}

/**
 * Initializes boss related sounds.
 */
function initBossSounds() {
    bossMusic = new Audio('./audio/boss_background_music.mp3');
    bossMusic.loop = true;
    bossMusic.volume = 0.2;
    bossSound = new Audio('./audio/boss.mp3');
    bossSound.volume = 0.7;
    bossHitSound = new Audio('./audio/boss_hit.mp3');
    bossHitSound.volume = 0.4;
    bossDeathSound = new Audio('./audio/chicken_died.mp3');
    bossDeathSound.volume = 0.5;
    snoringSound = new Audio('./audio/snoring.mp3');
    snoringSound.loop = true;
    snoringSound.volume = 0.5;
}

/**
 * Initializes win and lose sounds.
 */
function initResultSounds() {
    winMusic = new Audio('./audio/winning.mp3');
    winMusic.volume = 0.4;
    loseMusic = new Audio('./audio/lose.mp3');
    loseMusic.volume = 0.4;
}

/**
 * Mutes menu and game music if audio is disabled.
 */
function muteIfDisabled() {
    if (!audioEnabled) {
        menuMusic.volume = 0;
        gameMusic.volume = 0;
    }
}

/**
 * Unlocks audio playback after user interaction.
 */
function unlockAudio() {
    if (audioUnlocked) return;
    audioUnlocked = true;
    sessionStorage.setItem('audioUnlocked', 'true');
    menuMusic.muted = true;
    menuMusic.play().then(() => {
        menuMusic.pause();
        menuMusic.currentTime = 0;
        menuMusic.muted = false;
        if (!audioEnabled) return;
        if (currentScreen === "menu") playMenuMusic();
        if (currentScreen === "game") playGameMusic();
    }).catch(() => { });
}

/**
 * Plays menu background music.
 */
function playMenuMusic() {
    if (!audioEnabled || !audioUnlocked || !menuMusic) return;
    currentScreen = "menu";
    if (menuMusic.paused) menuMusic.play().catch(() => { });
}

/**
 * Plays game background music.
 */
function playGameMusic() {
    if (!audioEnabled || !audioUnlocked || !gameMusic)
        return;
    currentScreen = "game";
    if (gameMusic.paused) gameMusic.play().catch(() => { });
}

/**
 * Stops menu music playback.
 */
function stopMenuMusic() {
    if (!menuMusic) return;
    menuMusic.pause();
    menuMusic.currentTime = 0;
}

/**
 * Stops game music playback.
 */
function stopGameMusic() {
    if (!gameMusic) return;
    gameMusic.pause();
    gameMusic.currentTime = 0;
}

/**
 * Plays a sound effect.
 * @param {HTMLAudioElement} sound
 */
function playSound(sound) {
    if (!audioEnabled || !audioUnlocked || !sound)
        return;
    sound.currentTime = 0;
    sound.play().catch(() => { });
}

/** Plays button click sound */
function playButtonSound() {
    playSound(buttonSound);
}

/** Plays coin collect sound */
function playCoinSound() {
    playSound(coinSound);
}

/** Plays bottle collect sound */
function playBottleSound() {
    playSound(bottleSound);
}

/** Plays bottle throw sound */
function playBottleThrowSound() { playSound(bottleThrowSound); }

/** Plays bottle splash sound */
function playBottleSplashSound() { playSound(bottleSplashSound); }

/** Plays chicken splat sound */
function playChickenSplatSound() { playSound(chickenSplatSound); }

/** Plays snoring sound */
function playSnoringSound() {
    playSound(snoringSound);
}

/**
 * Stops snoring sound.
 */
function stopSnoringSound() {
    if (!snoringSound) return;
    snoringSound.pause();
    snoringSound.currentTime = 0;
}

/** Plays jump sound */
function playJumpSound() {
    playSound(jumpSound);
}

/**
 * Plays boss background music.
 */
function playBossMusic() {
    if (!audioEnabled || !audioUnlocked || !bossMusic) return;
    stopGameMusic();
    stopMenuMusic();
    if (bossMusic.paused) {
        bossMusic.currentTime = 0;
        bossMusic.play().catch(() => { });
    }
}

/**
 * Stops boss background music.
 */
function stopBossMusic() {
    if (!bossMusic) return;
    bossMusic.pause();
    bossMusic.currentTime = 0;
}

/** Plays boss sound effect */
function playBossSound() {
    playSound(bossSound);
}

/**
 * Stops boss sound effect.
 */
function stopBossSound() {
    if (!bossSound) return;
    bossSound.pause();
    bossSound.currentTime = 0;
}

/** Plays boss death sound */
function playBossDeathSound() {
    playSound(bossDeathSound);
}

/**
 * Plays boss hit sound.
 */
function playBossHitSound() {
    if (!audioEnabled) return;
    bossHitSound.currentTime = 0;
    bossHitSound.play();
}

/**
 * Plays looping footsteps sound.
 */
function playFootsteps() {
    if (!audioEnabled || !audioUnlocked || !footsteps) return;
    if (footsteps.paused) {
        footsteps.play().catch(() => { });
    }
}

/**
 * Stops footsteps sound.
 */
function stopFootsteps() {
    if (!footsteps) return;
    footsteps.pause();
    footsteps.currentTime = 0;
}

/**
 * Plays hurt sound.
 */
function playHurtSound() {
    if (!audioEnabled) return;
    hurtSound.currentTime = 0;
    hurtSound.play();
}

/**
 * Stops all currently playing music.
 */
function stopAllMusic() {
    stopMenuMusic();
    stopGameMusic();
    stopBossMusic();
    if (winMusic) {
        winMusic.pause();
        winMusic.currentTime = 0;
    }
    if (loseMusic) {
        loseMusic.pause();
        loseMusic.currentTime = 0;
    }
}

/**
 * Plays win music.
 */
function playWinMusic() {
    if (!audioEnabled || !audioUnlocked) return;
    stopAllMusic();
    winMusic.play().catch(() => { });
}

/**
 * Plays lose music.
 */
function playLoseMusic() {
    if (!audioEnabled || !audioUnlocked) return;
    stopAllMusic();
    loseMusic.play().catch(() => { });
}

/**
 * Toggles audio on or off.
 */
function toggleAudio() {
    audioEnabled = !audioEnabled;
    localStorage.setItem('audioEnabled', audioEnabled);
    if (!audioEnabled) {
        menuMusic.pause();
        gameMusic.pause();
        return;
    }
    menuMusic.volume = 0.3;
    gameMusic.volume = 0.3;
    if (!audioUnlocked) unlockAudio();
    if (currentScreen === "menu") playMenuMusic();
    if (currentScreen === "game") playGameMusic();
}