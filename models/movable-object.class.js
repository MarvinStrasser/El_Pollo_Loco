class MovableObject {
    x = 150;
    y = 180;
    img;
    height = 150;
    width = 100;
    imageCache = [];
    currentImage = 0;
    speed = 0.15;
    otherDirection = false;
    speedY = 0;
    acceleration = 2;
    LP = 100;

    applyGravity() {
        setInterval(() => {
            if (this.aboveGround() || this.speedY > 0) {
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


    loadImage(path) {
        this.img = new Image();
        this.img.src = path;
    }

    loadImages(arr) {
        arr.forEach((path) => {
            let img = new Image();
            img.src = path;
            img.style = 'transform: scaleX(-1)';
            this.imageCache[path] = img;
        });
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

    draw(ctx) {
        ctx.drawImage(this.img, this.x, this.y, this.width, this.height);
    }

    drawFrame(ctx) {
        if (this instanceof characterPepe || this instanceof enemyChicken || this instanceof Coin || this instanceof Endboss) {
            ctx.beginPath();
            ctx.lineWidth = '5';
            ctx.strikeStyle = 'blue';
            ctx.rect(this.x, this.y, this.width, this.height);
            ctx.stroke();
        }
    }

    isColliding(mo) {
        const hitboxX = this.x + 30;
        const hitboxY = this.y + 40;
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
