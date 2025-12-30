class enemyChick extends MovableObject {
    height = 50;
    width = 50;
    y = 380;
    energy = 10;
    active = false;

    IMAGES_WALKING = [
        'img/3_enemies_chicken/chicken_small/1_walk/1_w.png',
        'img/3_enemies_chicken/chicken_small/1_walk/2_w.png',
        'img/3_enemies_chicken/chicken_small/1_walk/3_w.png'
    ];

    IMAGES_DEAD = [
        'img/3_enemies_chicken/chicken_small/2_dead/dead.png'
    ];

    constructor(x) {
        super().loadImage(this.IMAGES_WALKING[0]);
        this.loadImages(this.IMAGES_WALKING);
        this.loadImages(this.IMAGES_DEAD);
        this.x = x;
        this.speed = 6 + Math.random() * 0.5;
        this.animate();
    }

    animate() {
        this.animationInterval = setInterval(() => {
            if (gameOver) return;
            if (this.dead || !this.active) return;
            this.x -= this.speed;
            this.playAnimation(this.IMAGES_WALKING);
        }, 100);
    }

    hit() {
        this.energy -= 10;
        if (this.energy <= 0) this.die();
    }

    die() {
        if (this.dead) return;
        this.dead = true;
        this.speed = 0;
        playChickenSplatSound();
        clearInterval(this.animationInterval);
        this.img = this.imageCache[this.IMAGES_DEAD[0]];
        setTimeout(() => this.remove = true, 5000);
    }
}