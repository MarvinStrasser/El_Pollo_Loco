class enemyChicken extends MovableObject {
    height = 70;
    width = 70;
    y = 360;
    currentImage = 0;
    energy = 20;
    IMAGES_WALKING = [
        'img/3_enemies_chicken/chicken_normal/1_walk/1_w.png',
        'img/3_enemies_chicken/chicken_normal/1_walk/2_w.png',
        'img/3_enemies_chicken/chicken_normal/1_walk/3_w.png',
    ];

    IMAGES_DEAD = [
        'img/3_enemies_chicken/chicken_normal/2_dead/dead.png'
    ];


    constructor() {
        super().loadImage('img/3_enemies_chicken/chicken_normal/1_walk/1_w.png');
        this.loadImages(this.IMAGES_WALKING);
        this.x = 400 + Math.random() * 500;
        this.speed = 0.15 + Math.random() * 0.25;
        this.loadImages(this.IMAGES_DEAD);
        this.animate();
    }

    animate() {
        this.moveLeft();
        this.animationInterval = setInterval(() => {
            if (!this.dead) {
                this.playAnimation(this.IMAGES_WALKING);
            }
        }, 120);
    }

    hit() {
        this.energy -= 20;
        if (this.energy <= 0) {
            this.die();
        }
    }

    die() {
        this.energy = 0;
        this.dead = true;
        this.speed = 0;
        clearInterval(this.animationInterval);
        this.img = this.imageCache[this.IMAGES_DEAD[0]];
        setTimeout(() => {
            this.remove = true;
        }, 5000);
    }
}