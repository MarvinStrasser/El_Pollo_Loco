class MovableObject extends drawableObject {
    speed = 0.15;
    otherDirection = false;
    speedY = 0;
    acceleration = 2;
    LP = 100;


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

    aboveGround() {
        return this.y < 180;
    }

    playAnimation(images) {
        let i = this.currentImage % images.length;
        let path = images[i];
        this.img = this.imageCache[path];
        this.currentImage++;
    }

    moveLeft() {
        setInterval(() => {
            this.x -= this.speed;
        }, 1000 / 60);
    }

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

    hit() {
        this.LP -= 5;
        if (this.LP < 0) {
            this.LP = 0
        };
    
    }

    isDead() {
        return this.LP == 0;
    }

}
