class MovableObject extends drawableObject {
    speed = 0.15;
    otherDirection = false;
    speedY = 0;
    acceleration = 2;
    LP = 100;
    offset = {
        top: 40,
        bottom: 10,
        left: 20,
        right: 20
    };

    /**
       * Applies gravity to the object.
       * Updates vertical position and falling speed.
       */
    applyGravity() {
        setInterval(() => {
            if (this.y < 180 || this.speedY > 0) {
                this.y -= this.speedY;
                this.speedY -= this.acceleration;
                if (this.y > 180) {
                    this.y = 180;
                    this.speedY = 0;
                }
            }
        }, 1000 / 25);
    }

    /**
     * Checks whether the object is above the ground.
     * @returns {boolean}
     */
    aboveGround() {
        return this.y < 180;
    }

    /**
     * Plays an animation by cycling through image paths.
     * @param {string[]} images - Array of image paths
     */
    playAnimation(images) {
        let i = this.currentImage % images.length;
        let path = images[i];
        this.img = this.imageCache[path];
        this.currentImage++;
    }

    /**
     * Moves the object continuously to the left.
     */
    moveLeft() {
        setInterval(() => {
            this.x -= this.speed;
        }, 1000 / 60);
    }

    /**
     * Checks collision with another movable object.
     * @param {MovableObject} mo - Other movable object
     * @returns {boolean}
     */
    isColliding(mo) {
        const hitboxX = this.x + 30;
        const hitboxY = this.y + 160;
        const hitboxW = this.width - 60;
        const hitboxH = this.height - 5;
        const moHitboxX = mo.x + 30;
        const moHitboxY = mo.y + 160;
        const moHitboxW = mo.width - 60;
        const moHitboxH = mo.height - 60;
        return (
            hitboxX + hitboxW > moHitboxX &&
            hitboxY + hitboxH > moHitboxY &&
            hitboxX < moHitboxX + moHitboxW &&
            hitboxY < moHitboxY + moHitboxH
        );
    }

    /**
     * Reduces life points when the object gets hit.
     */
    hit() {
        this.LP -= 5;
        if (this.LP < 0) {
            this.LP = 0
        };
    }

    /**
     * Checks if the object is dead.
     * @returns {boolean}
     */
    isDead() {
        return this.LP == 0;
    }
}