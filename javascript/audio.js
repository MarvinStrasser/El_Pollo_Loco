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


function initMenuSounds() {
    const stored = localStorage.getItem('audioEnabled');
    if (stored !== null) audioEnabled = stored === 'true';

    menuMusic = new Audio('./audio/background_music.mp3');
    menuMusic.loop = true;
    menuMusic.volume = 0.3;

    gameMusic = new Audio('./audio/main_menu_music.mp3');
    gameMusic.loop = true;
    gameMusic.volume = 0.2;

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

    snoringSound = new Audio('./audio/snoring.mp3');
    snoringSound.loop = true;
    snoringSound.volume = 0.5;

    footsteps = new Audio('./audio/footsteps.mp3');
    footsteps.loop = true;
    footsteps.volume = 0.8;

    jumpSound = new Audio('./audio/jump.mp3');
    jumpSound.volume = 0.6;

    bossMusic = new Audio('./audio/boss_background_music.mp3');
    bossMusic.loop = true;
    bossMusic.volume = 0.2;

    bossSound = new Audio('./audio/boss.mp3');
    bossSound.loop = false;
    bossSound.volume = 0.7;

    bossDeathSound = new Audio('./audio/chicken_died.mp3');
    bossDeathSound.volume = 0.5;

    winMusic = new Audio('./audio/winning.mp3');
    winMusic.loop = false;
    winMusic.volume = 0.4;

    loseMusic = new Audio('./audio/lose.mp3');
    loseMusic.loop = false;
    loseMusic.volume = 0.4;

    if (!audioEnabled) {
        menuMusic.volume = 0;
        gameMusic.volume = 0;
    }
}

function unlockAudio() {
    if (audioUnlocked) return;
    if (currentScreen !== "menu" && currentScreen !== "game") return;
    audioUnlocked = true;
    menuMusic.muted = true;
    menuMusic.play().then(() => {
        menuMusic.pause();
        menuMusic.currentTime = 0;
        menuMusic.muted = false;
        if (audioEnabled && currentScreen === "menu") {
            playMenuMusic();
        }
    }).catch(() => { });
}

function playMenuMusic() {
    if (!audioEnabled || !audioUnlocked || !menuMusic) return;
    currentScreen = "menu";
    if (menuMusic.paused) menuMusic.play().catch(() => { });
}

function playGameMusic() {
    if (!audioEnabled || !audioUnlocked || !gameMusic) return;
    currentScreen = "game";
    if (gameMusic.paused) gameMusic.play().catch(() => { });
}

function stopMenuMusic() {
    if (!menuMusic) return;
    menuMusic.pause();
    menuMusic.currentTime = 0;
}

function stopGameMusic() {
    if (!gameMusic) return;
    gameMusic.pause();
    gameMusic.currentTime = 0;
}

function playSound(sound) {
    if (!audioEnabled || !audioUnlocked || !sound) return;
    sound.currentTime = 0;
    sound.play().catch(() => { });
}

function playButtonSound() {
    playSound(buttonSound);
}

function playCoinSound() {
    playSound(coinSound);
}

function playBottleSound() {
    playSound(bottleSound);
}

function playBottleThrowSound() {
    playSound(bottleThrowSound);
}

function playBottleSplashSound() {
    playSound(bottleSplashSound);
}

function playChickenSplatSound() {
    playSound(chickenSplatSound);
}

function playSnoringSound() {
    playSound(snoringSound);
}

function stopSnoringSound() {
    if (!snoringSound) return;
    snoringSound.pause();
    snoringSound.currentTime = 0;
}

function playJumpSound() {
    playSound(jumpSound);
}

function playBossMusic() {
    if (!audioEnabled || !audioUnlocked || !bossMusic) return;
    stopGameMusic();
    stopMenuMusic();
    if (bossMusic.paused) {
        bossMusic.currentTime = 0;
        bossMusic.play().catch(() => { });
    }
}

function stopBossMusic() {
    if (!bossMusic) return;
    bossMusic.pause();
    bossMusic.currentTime = 0;
}

function playBossSound() {
    playSound(bossSound);
}

function stopBossSound() {
    if (!bossSound) return;
    bossSound.pause();
    bossSound.currentTime = 0;
}

function playBossDeathSound() {
    playSound(bossDeathSound);
}

function playFootsteps() {
    if (!audioEnabled || !audioUnlocked || !footsteps) return;
    if (footsteps.paused) {
        footsteps.play().catch(() => { });
    }
}

function stopFootsteps() {
    if (!footsteps) return;
    footsteps.pause();
    footsteps.currentTime = 0;
}

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

function playWinMusic() {
    if (!audioEnabled || !audioUnlocked) return;
    stopAllMusic();
    winMusic.play().catch(() => {});
}

function playLoseMusic() {
    if (!audioEnabled || !audioUnlocked) return;
    stopAllMusic();
    loseMusic.play().catch(() => {});
}

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