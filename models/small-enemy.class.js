class enemyChick extends MovableObject {
    height = 50;
    width = 50;
    y = 380;
    energy = 10;
    active = false;
    dead = false;
    DAMAGE = 10;
    ANIMATION_INTERVAL = 100;
    REMOVE_DELAY = 5000;
    IMAGES_WALKING = [
        'img/3_enemies_chicken/chicken_small/1_walk/1_w.png',
        'img/3_enemies_chicken/chicken_small/1_walk/2_w.png',
        'img/3_enemies_chicken/chicken_small/1_walk/3_w.png'
    ];

    IMAGES_DEAD = [
        'img/3_enemies_chicken/chicken_small/2_dead/dead.png'
    ];

    /**
     * @param {number} x - Start position
     */
    constructor(x) {
        super().loadImage(this.IMAGES_WALKING[0]);
        this.loadImages(this.IMAGES_WALKING);
        this.loadImages(this.IMAGES_DEAD);
        this.x = x;
        this.setRandomSpeed();
        this.startAnimation();
    }

    /** Sets random movement speed */
    setRandomSpeed() {
        this.speed = 6 + Math.random() * 0.5;
    }

    /** Starts movement animation */
    startAnimation() {
        this.animationInterval = setInterval(
            () => this.updateMovement(),
            this.ANIMATION_INTERVAL
        );
    }

    /** Updates movement and animation */
    updateMovement() {
        if (this.shouldStop()) return;
        this.moveLeft();
        this.playAnimation(this.IMAGES_WALKING);
    }

    /** @returns {boolean} */
    shouldStop() {
        return gameOver || this.dead || !this.active;
    }

    /** Moves enemy left */
    moveLeft() {
        this.x -= this.speed;
    }

    /** Applies damage */
    hit() {
        this.energy -= this.DAMAGE;
        if (this.energy <= 0) this.die();
    }

    /** Kills the enemy */
    die() {
        if (this.dead) return;
        this.dead = true;
        this.stopMovement();
        this.playDeathSound();
        this.showDeadImage();
        this.scheduleRemoval();
    }

    /** Stops movement and animation */
    stopMovement() {
        this.speed = 0;
        clearInterval(this.animationInterval);
    }

    /** Plays death sound */
    playDeathSound() {
        playChickenSplatSound();
    }

    /** Displays dead image */
    showDeadImage() {
        this.img = this.imageCache[this.IMAGES_DEAD[0]];
    }

    /** Removes enemy after delay */
    scheduleRemoval() {
        setTimeout(() => this.remove = true, this.REMOVE_DELAY);
    }
}