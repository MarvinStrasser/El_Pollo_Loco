class ThrowableObject extends MovableObject {
    IMAGES_BOTTLE_THROW = [
        './img/6_salsa_bottle/bottle_rotation/1_bottle_rotation.png',
        './img/6_salsa_bottle/bottle_rotation/2_bottle_rotation.png',
        './img/6_salsa_bottle/bottle_rotation/3_bottle_rotation.png',
        './img/6_salsa_bottle/bottle_rotation/4_bottle_rotation.png',
    ];
    IMAGES_BOTTLE_SPLASH = [
        './img/6_salsa_bottle/bottle_rotation/bottle_splash/1_bottle_splash.png',
        './img/6_salsa_bottle/bottle_rotation/bottle_splash/2_bottle_splash.png',
        './img/6_salsa_bottle/bottle_rotation/bottle_splash/3_bottle_splash.png',
        './img/6_salsa_bottle/bottle_rotation/bottle_splash/4_bottle_splash.png',
        './img/6_salsa_bottle/bottle_rotation/bottle_splash/5_bottle_splash.png',
        './img/6_salsa_bottle/bottle_rotation/bottle_splash/6_bottle_splash.png',
    ];
    hasSplashed = false;

    /**
     * Creates a throwable bottle object.
     * @param {number} x - Start x-position
     * @param {number} y - Start y-position
     */
    constructor(x, y) {
        super();
        this.loadImages(this.IMAGES_BOTTLE_THROW);
        this.img = this.imageCache[this.IMAGES_BOTTLE_THROW[0]];
        this.loadImages(this.IMAGES_BOTTLE_SPLASH);
        this.gravityInterval = null;
        this.throwInterval = null;
        this.markedForRemoval = false;
        this.otherDirection = false;
        this.x = x;
        this.y = y;
        this.height = 100;
        this.width = 50;
        this.speedX = 10;
    }

    /**
     * Applies gravity to the thrown bottle.
     */
    applyGravity() {
        this.gravityInterval = setInterval(() => {
            this.y -= this.speedY;
            this.speedY -= this.acceleration;
            if (this.y >= 360) {
                this.y = 360;
                this.splash();
            }
        }, 1000 / 25);
    }

    /**
     * Throws the bottle.
     * @param {boolean} otherDirection - Direction of the throw
     */
    throw(otherDirection = false) {
        this.otherDirection = otherDirection;
        this.speedY = 20;
        this.speedX = this.otherDirection ? -10 : 10;
        playBottleThrowSound();
        this.applyGravity();
        this.throwInterval = setInterval(() => {
            this.x += this.speedX;
            this.playAnimation(this.IMAGES_BOTTLE_THROW);
        }, 25);
    }

    isCollidingEnemy(enemy) {
        return (
            this.x + this.width > enemy.x + 20 &&
            this.x < enemy.x + enemy.width - 20 &&
            this.y + this.height > enemy.y + 20 &&
            this.y < enemy.y + enemy.height - 20
        );
    }

    /**
     * Handles bottle splash animation and cleanup.
     */
    splash() {
        if (this.hasSplashed) return;
        this.hasSplashed = true;
        this.speedX = 0;
        this.speedY = 0;
        clearInterval(this.throwInterval);
        clearInterval(this.gravityInterval);
        this.playAnimation(this.IMAGES_BOTTLE_SPLASH);
        playBottleSplashSound();
        setTimeout(() => {
            this.markedForRemoval = true;
            this.width = 0;
            this.height = 0;
        }, 50);
    }
}