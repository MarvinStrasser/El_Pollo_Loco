class characterPepe extends MovableObject {
    height = 250;
    width = 150;
    x = 100;
    speed = 5;
    lastActionTime = Date.now();
    longIdleTimeout = 15000;
    IMAGES_WALKING = [
        './img/2_character_pepe/2_walk/W-21.png',
        './img/2_character_pepe/2_walk/W-22.png',
        './img/2_character_pepe/2_walk/W-23.png',
        './img/2_character_pepe/2_walk/W-24.png',
        './img/2_character_pepe/2_walk/W-25.png',
        './img/2_character_pepe/2_walk/W-26.png',
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
        './img/2_character_pepe/1_idle/idle/I-10.png',
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
        './img/2_character_pepe/1_idle/long_idle/I-20.png',
    ];
    currentImage = 0;
    world;

    constructor() {
        super().loadImage('./img/2_character_pepe/2_walk/W-21.png');
        this.loadImages(this.IMAGES_WALKING);
        this.loadImages(this.IMAGES_IDLE);
        this.loadImages(this.IMAGES_LONG_IDLE);

        this.animate();
    }

    animate() {
        this.handleMovement();
        this.handleAnimation();
    }

    handleMovement() {
        setInterval(() => {
            if (this.world.keyboard.RIGHT) {
                this.moveRight();
            }

            if (this.world.keyboard.LEFT) {
                this.moveLeft();
            }

            this.world.camera_x = -this.x + 100;
        }, 1000 / 60);
    }

    moveRight() {
        if (this.x < this.world.level.level_end_x) {
            this.x += this.speed;
            this.otherDirection = false;
            this.lastActionTime = Date.now();
        }
    }

    moveLeft() {
        if (this.x > 0) {
            this.x -= this.speed;
            this.otherDirection = true;
            this.lastActionTime = Date.now();
        }
    }

    jump() {

    }

    handleAnimation() {
        setInterval(() => {
            if (this.isMoving()) {
                this.playAnimation(this.IMAGES_WALKING);
                return;
            }

            if (this.isLongIdle()) {
                this.playAnimation(this.IMAGES_LONG_IDLE);
            } else {
                this.playAnimation(this.IMAGES_IDLE);
            }
        }, 100);
    }

    isMoving() {
        return this.world.keyboard.RIGHT || this.world.keyboard.LEFT;
    }

    isLongIdle() {
        return Date.now() - this.lastActionTime > this.longIdleTimeout;
    }

}