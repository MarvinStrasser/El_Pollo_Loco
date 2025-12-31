class MovableObject extends drawableObject {
    speed = 0.15;
    otherDirection = false;
    speedY = 0;
    acceleration = 2;
    LP = 100;
    offset = {
        top: 10,
        bottom: 10,
        left: 10,
        right: 10
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
        const hitboxY = this.y + 80;
        const hitboxW = this.width - 60;
        const hitboxH = this.height - 60;
        return (
            hitboxX + hitboxW > mo.x &&
            hitboxY + hitboxH > mo.y &&
            hitboxX < mo.x + mo.width &&
            hitboxY < mo.y + mo.height
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