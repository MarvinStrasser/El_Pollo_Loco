class CharacterPepe extends MovableObject {
    height = 250;
    width = 150;
    x = 100;
    speed = 5;
    LP = 100;
    coins = 0;
    bottles = 0;
    MAX_BOTTLES = 10;
    lastActionTime = Date.now();
    longIdleTimeout = 15000;
    throwOnCooldown = false;
    throwCooldown = 600;
    isHurt = false;
    hurtTimeout = 100;
    isDeadFalling = false;
    deathImageIndex = 0;
    deathInterval = null;
    deathFallSpeed = 30;
    isSnoring = false;
    hasMoved = false;
    world;
    localGameId;

    /* =========================
       IMAGES
    ========================= */
    IMAGES_WALKING = [
        './img/2_character_pepe/2_walk/W-21.png',
        './img/2_character_pepe/2_walk/W-22.png',
        './img/2_character_pepe/2_walk/W-23.png',
        './img/2_character_pepe/2_walk/W-24.png',
        './img/2_character_pepe/2_walk/W-25.png',
        './img/2_character_pepe/2_walk/W-26.png'
    ];

    IMAGES_IDLE = [
        './img/2_character_pepe/1_idle/idle/I-1.png',
        './img/2_character_pepe/1_idle/idle/I-2.png',
        './img/2_character_pepe/1_idle/idle/I-3.png',
        './img/2_character_pepe/1_idle/idle/I-4.png',
        './img/2_character_pepe/1_idle/idle/I-5.png',
        './img/2_character_pepe/1_idle/idle/I-6.png',
        './img/2_character_pepe/1_idle/idle/I-7.png',
        './img/2_character_pepe/1_idle/idle/I-8.png',
        './img/2_character_pepe/1_idle/idle/I-9.png',
        './img/2_character_pepe/1_idle/idle/I-10.png'
    ];

    IMAGES_LONG_IDLE = [
        './img/2_character_pepe/1_idle/long_idle/I-11.png',
        './img/2_character_pepe/1_idle/long_idle/I-12.png',
        './img/2_character_pepe/1_idle/long_idle/I-13.png',
        './img/2_character_pepe/1_idle/long_idle/I-14.png',
        './img/2_character_pepe/1_idle/long_idle/I-15.png',
        './img/2_character_pepe/1_idle/long_idle/I-16.png',
        './img/2_character_pepe/1_idle/long_idle/I-17.png',
        './img/2_character_pepe/1_idle/long_idle/I-18.png',
        './img/2_character_pepe/1_idle/long_idle/I-19.png',
        './img/2_character_pepe/1_idle/long_idle/I-20.png'
    ];

    IMAGES_JUMP = [
        './img/2_character_pepe/3_jump/J-31.png',
        './img/2_character_pepe/3_jump/J-32.png',
        './img/2_character_pepe/3_jump/J-33.png',
        './img/2_character_pepe/3_jump/J-34.png',
        './img/2_character_pepe/3_jump/J-35.png',
        './img/2_character_pepe/3_jump/J-36.png',
        './img/2_character_pepe/3_jump/J-37.png',
        './img/2_character_pepe/3_jump/J-38.png',
        './img/2_character_pepe/3_jump/J-39.png'
    ];

    IMAGES_PEPE_HURT = [
        './img/2_character_pepe/4_hurt/H-41.png',
        './img/2_character_pepe/4_hurt/H-42.png',
        './img/2_character_pepe/4_hurt/H-43.png'
    ];

    IMAGES_PEPE_DIES = [
        './img/2_character_pepe/5_dead/D-51.png',
        './img/2_character_pepe/5_dead/D-52.png',
        './img/2_character_pepe/5_dead/D-53.png',
        './img/2_character_pepe/5_dead/D-54.png',
        './img/2_character_pepe/5_dead/D-55.png',
        './img/2_character_pepe/5_dead/D-56.png',
        './img/2_character_pepe/5_dead/D-57.png'
    ];

constructor() {
        super().loadImage('./img/2_character_pepe/2_walk/W-21.png');
        this.localGameId = gameId;
        this.loadAllImages();
        this.applyGravity();
        this.startAnimations();
    }

    loadAllImages() {
        this.loadImages(this.IMAGES_WALKING);
        this.loadImages(this.IMAGES_IDLE);
        this.loadImages(this.IMAGES_LONG_IDLE);
        this.loadImages(this.IMAGES_JUMP);
        this.loadImages(this.IMAGES_PEPE_HURT);
        this.loadImages(this.IMAGES_PEPE_DIES);
    }

    startAnimations() {
        this.startMovementLoop();
        this.startAnimationLoop();
    }

    startMovementLoop() {
        const id = this.localGameId;
        allIntervals.push(setInterval(() => {
            if (id !== gameId) return;
            this.handleMovement();
        }, 1000 / 60));
    }

    handleMovement() {
        if (gameOver || this.isDead()) return;
        this.activateEnemiesOnFirstMove();
        this.handleHorizontalMovement();
        this.handleJump();
        this.handleBottleThrow();
        this.updateCamera();
        this.handleFootsteps();
    }

    handleFootsteps() {
        if ((this.world.keyboard.RIGHT || this.world.keyboard.LEFT) && !this.aboveGround()) {
            playFootsteps();
        } else {
            stopFootsteps();
        }
    }

    activateEnemiesOnFirstMove() {
        if (this.hasMoved) return;
        if (!this.world.keyboard.RIGHT && !this.world.keyboard.LEFT) return;
        this.hasMoved = true;
        this.world.activateEnemies();
    }

    handleHorizontalMovement() {
        if (this.world.keyboard.RIGHT) this.moveRight();
        if (this.world.keyboard.LEFT) this.moveLeft();
    }

    handleJump() {
        if (this.world.keyboard.UP && !this.aboveGround()) this.jump();
    }

    handleBottleThrow() {
        if (this.world.keyboard.N && this.canThrow()) this.throwBottle();
    }

    updateCamera() {
        this.world.camera_x = -this.x + 100;
    }

    startAnimationLoop() {
        const id = this.localGameId;
        allIntervals.push(setInterval(() => {
            if (id !== gameId) return;
            this.playCurrentAnimation();
        }, 120));
    }

    playCurrentAnimation() {
        if (gameOver || allowWinScreen || allowLoseScreen) {
            this.stopSnoring();
            return;
        }
        if (this.isDead()) return;
        if (this.isHurt) return this.playAnimation(this.IMAGES_PEPE_HURT);
        if (this.speedY > 0) return this.playJumpUp();
        if (this.aboveGround()) return this.playJumpDown();
        if (this.isMoving()) return this.playAnimation(this.IMAGES_WALKING);
        if (this.isLongIdle()) return this.playLongIdle();
        this.playAnimation(this.IMAGES_IDLE);
    }

    playLongIdle() {
        if (!this.isSnoring) {
            this.isSnoring = true;
            playSnoringSound();
        }
        this.playAnimation(this.IMAGES_LONG_IDLE);
    }

    stopSnoring() {
        if (!this.isSnoring) return;
        this.isSnoring = false;
        stopSnoringSound();
    }

    moveRight() {
        if (this.x >= this.world.level.level_end_x) return;
        this.stopSnoring();
        this.x += this.speed;
        this.otherDirection = false;
        this.lastActionTime = Date.now();
    }

    moveLeft() {
        if (this.x <= 0) return;
        this.stopSnoring();
        this.x -= this.speed;
        this.otherDirection = true;
        this.lastActionTime = Date.now();
    }

    jump() {
        this.speedY = 20;
        this.lastActionTime = Date.now();
        playJumpSound();
    }

    canThrow() {
        return !this.throwOnCooldown && this.bottles > 0;
    }

    throwBottle() {
        const id = this.localGameId;
        this.throwOnCooldown = true;
        this.bottles--;
        this.updateBottleBar();

        const bottle = new ThrowableObject(
            this.x + (this.otherDirection ? -20 : 50),
            this.y + 100
        );
        bottle.throw(this.otherDirection);
        this.world.throwableObjects.push(bottle);

        allTimeouts.push(setTimeout(() => {
            if (id !== gameId) return;
            this.throwOnCooldown = false;
        }, this.throwCooldown));
    }

    updateBottleBar() {
        this.world.bottleBar.setPercentage(
            (this.bottles / this.MAX_BOTTLES) * 100
        );
    }

    isMoving() {
        return this.world.keyboard.RIGHT || this.world.keyboard.LEFT;
    }

    isLongIdle() {
        return Date.now() - this.lastActionTime > this.longIdleTimeout;
    }

    playJumpUp() {
        this.playAnimation(this.IMAGES_JUMP.slice(3, 4));
    }

    playJumpDown() {
        this.playAnimation(this.IMAGES_JUMP.slice(4));
    }

    hit(damage = 40) {
        if (this.isHurt || this.isDead()) return;
        this.LP = Math.max(0, this.LP - damage);
        this.startHurt();
    }

    startHurt() {
        const id = this.localGameId;
        this.stopSnoring();
        this.isHurt = true;
        playHurtSound();

        allTimeouts.push(setTimeout(() => {
            if (id !== gameId) return;
            this.isHurt = false;
            if (this.isDead()) this.die();
        }, this.hurtTimeout));
    }

    die() {
        if (this.isDeadFalling || gameOver) return;
        gameOver = true;
        stopAllMusic();
        playLoseMusic();
        stopBossSound();
        stopFootsteps();
        this.startDeathAnimation();
        this.showLoseScreen();
    }

    startDeathAnimation() {
        const id = this.localGameId;
        this.isDeadFalling = true;
        this.deathImageIndex = 0;

        allIntervals.push(setInterval(() => {
            if (id !== gameId) return;
            this.y += this.deathFallSpeed;
            if (this.deathImageIndex >= this.IMAGES_PEPE_DIES.length) return;
            const path = this.IMAGES_PEPE_DIES[this.deathImageIndex];
            this.img = this.imageCache[path];
            this.deathImageIndex++;
        }, 100));
    }

    showLoseScreen() {
        const id = this.localGameId;
        allTimeouts.push(setTimeout(() => {
            if (id !== gameId) return;
            showElement('loseScreen');
            allTimeouts.push(setTimeout(() => {
                if (id !== gameId) return;
                hideElement('loseScreen');
                showElement('endOptionsScreen');
            }, 5000));
        }, 1200));
    }
}