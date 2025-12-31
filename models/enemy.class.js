class EnemyChicken extends MovableObject {
    height = 70;
    width = 70;
    y = 360;
    energy = 20;
    active = false;
    speed = 0;
    DAMAGE = 20;
    ANIMATION_SPEED = 120;
    REMOVE_DELAY = 5000;
    localGameId;
    offset = {
        top: 12,
        bottom: 12,
        left: 10,
        right: 10
    };
    IMAGES_WALKING = [
        'img/3_enemies_chicken/chicken_normal/1_walk/1_w.png',
        'img/3_enemies_chicken/chicken_normal/1_walk/2_w.png',
        'img/3_enemies_chicken/chicken_normal/1_walk/3_w.png'
    ];
    IMAGES_DEAD = [
        'img/3_enemies_chicken/chicken_normal/2_dead/dead.png'
    ];

  /**
     * Creates a chicken enemy.
     * @param {number} x
     */
    constructor(x) {
        super().loadImage(this.IMAGES_WALKING[0]);
        this.localGameId = gameId;
        this.loadImages(this.IMAGES_WALKING);
        this.loadImages(this.IMAGES_DEAD);
        this.x = x;
        this.setRandomSpeed();
        this.startAnimation();
    }

    /**
     * Sets a random movement speed.
     */
    setRandomSpeed() {
        this.speed = 3 + Math.random() * 0.15;
    }

    /**
     * Starts enemy animation loop.
     */
    startAnimation() {
        const id = this.localGameId;
        allIntervals.push(setInterval(() => {
            if (id !== gameId) return;
            this.animate();
        }, this.ANIMATION_SPEED));
    }

    /**
     * Animates enemy movement.
     */
    animate() {
        if (gameOver || this.dead || !this.active) return;
        this.x -= this.speed;
        this.playAnimation(this.IMAGES_WALKING);
    }

    /**
     * Handles damage.
     */
    hit() {
        this.energy -= this.DAMAGE;
        if (this.energy <= 0) this.die();
    }

    /**
     * Kills the enemy.
     */
    die() {
        if (this.dead) return;
        this.dead = true;
        this.speed = 0;
        this.resetOffset();
        this.playDeathAnimation();
        this.scheduleRemoval();
    }

    /**
     * Resets collision offset.
     */
    resetOffset() {
        this.offset = { top: 0, bottom: 0, left: 0, right: 0 };
    }

    /**
     * Plays death animation.
     */
    playDeathAnimation() {
        playChickenSplatSound();
        this.img = this.imageCache[this.IMAGES_DEAD[0]];
    }

    /**
     * Removes enemy after delay.
     */
    scheduleRemoval() {
        const id = this.localGameId;
        allTimeouts.push(setTimeout(() => {
            if (id !== gameId) return;
            this.remove = true;
        }, this.REMOVE_DELAY));
    }
}