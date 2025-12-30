class characterPepe extends MovableObject {
    height = 250;
    width = 150;
    x = 100;
    speed = 5;
    lastActionTime = Date.now();
    longIdleTimeout = 15000;
    coins = 0;
    bottles = 0;
    LP = 100;
    hasMoved = false;
    isHurt = false;
    hurtTimeout = 100;
    isDeadFalling = false;
    deathImageIndex = 0;
    deathInterval = null;
    deathFallSpeed = 30;
    isSnoring = false;
    world;

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
        this.loadImages(this.IMAGES_WALKING);
        this.loadImages(this.IMAGES_IDLE);
        this.loadImages(this.IMAGES_LONG_IDLE);
        this.loadImages(this.IMAGES_JUMP);
        this.loadImages(this.IMAGES_PEPE_HURT);
        this.loadImages(this.IMAGES_PEPE_DIES);
        this.applyGravity();
        this.animate();
    }

    animate() {
        this.handleMovement();
        this.handleAnimation();
    }

handleMovement() {
    setInterval(() => {
        if (gameOver) {
            stopFootsteps();
            return;
        }
        if (!this.hasMoved && (this.world.keyboard.RIGHT || this.world.keyboard.LEFT)) {
            this.hasMoved = true;
            this.world.activateEnemies();
        }
        if (this.isDead()) {
            stopFootsteps();
            return;
        }
        if (this.world.keyboard.RIGHT) this.moveRight();
        if (this.world.keyboard.LEFT) this.moveLeft();
        if (this.world.keyboard.UP && !this.aboveGround()) this.jump();
        this.handleFootsteps();
        this.world.camera_x = -this.x + 100;
    }, 1000 / 60);
}

    handleFootsteps() {
        if ((this.world.keyboard.RIGHT || this.world.keyboard.LEFT) && !this.aboveGround()) {
            playFootsteps();
        } else {
            stopFootsteps();
        }
    }

    handleAnimation() {
        setInterval(() => this.playCurrentAnimation(), 120);
    }

    playCurrentAnimation() {
        if (gameOver || allowWinScreen || allowLoseScreen) {
            this.stopSnoringIfNeeded();
            return;
        }
        if (this.isDead()) return;
        if (this.isHurt) return this.playAnimation(this.IMAGES_PEPE_HURT);
        if (this.speedY > 0) return this.playJumpUp();
        if (this.aboveGround()) return this.playJumpDown();
        if (this.isMoving()) return this.playAnimation(this.IMAGES_WALKING);
        if (this.isLongIdle()) {
            if (!this.isSnoring) {
                this.isSnoring = true;
                playSnoringSound();
            }
            return this.playAnimation(this.IMAGES_LONG_IDLE);
        }
        this.playAnimation(this.IMAGES_IDLE);
    }

    stopSnoringIfNeeded() {
        if (this.isSnoring) {
            this.isSnoring = false;
            stopSnoringSound();
        }
    }

    moveRight() {
        if (this.x < this.world.level.level_end_x) {
            this.stopSnoringIfNeeded();
            this.x += this.speed;
            this.otherDirection = false;
            this.lastActionTime = Date.now();
        }
    }

    moveLeft() {
        if (this.x > 0) {
            this.stopSnoringIfNeeded();
            this.x -= this.speed;
            this.otherDirection = true;
            this.lastActionTime = Date.now();
        }
    }

    jump() {
        if (!this.aboveGround()) {
            this.speedY = 20;
            this.lastActionTime = Date.now();
            playJumpSound();
        }
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

    playFootsteps() {
        if (!audioEnabled || !audioUnlocked) return;
        if (!isWalkingSound) {
            footsteps.currentTime = 0;
            footsteps.loop = true;
            footsteps.volume = 0.4;
            footsteps.play();
            isWalkingSound = true;
        }
    }

    stopFootsteps() {
        footsteps.pause();
        footsteps.currentTime = 0;
        isWalkingSound = false;
    }

    hit(damage = 40) {
        if (this.isHurt || this.isDead()) return;
        this.LP -= damage;
        if (this.LP < 0) this.LP = 0;
        this.hurt();
    }

    hurt() {
        if (this.isHurt) return;
        this.stopSnoringIfNeeded();
        this.isHurt = true;
        playHurtSound();
        setTimeout(() => {
            this.isHurt = false;
            if (this.isDead()) this.die();
        }, this.hurtTimeout);
    }
    die() {
        if (this.isDeadFalling || gameOver) return;
        stopBossSound();
        gameOver = true;
        this.stopSnoringIfNeeded();
        stopAllMusic();
        this.isDeadFalling = true;
        clearInterval(this.deathInterval);
        this.deathImageIndex = 0;
        this.deathInterval = setInterval(() => {
            this.y += this.deathFallSpeed;
            if (this.deathImageIndex < this.IMAGES_PEPE_DIES.length) {
                this.img = this.imageCache[this.IMAGES_PEPE_DIES[this.deathImageIndex]];
                this.deathImageIndex++;
            }
        }, 100);
        playLoseMusic();
        setTimeout(() => {
            document.getElementById('loseScreen').classList.remove('hidden');
            setTimeout(() => {
                document.getElementById('loseScreen').classList.add('hidden');
                document.getElementById('endOptionsScreen').classList.remove('hidden');
            }, 5000);

        }, 1200);
    }
}