class enemyChicken extends MovableObject {
    height = 70;
    width = 70;
    y = 360;
    energy = 20;
    active = false;

    IMAGES_WALKING = [
        'img/3_enemies_chicken/chicken_normal/1_walk/1_w.png',
        'img/3_enemies_chicken/chicken_normal/1_walk/2_w.png',
        'img/3_enemies_chicken/chicken_normal/1_walk/3_w.png'
    ];

    IMAGES_DEAD = [
        'img/3_enemies_chicken/chicken_normal/2_dead/dead.png'
    ];

    constructor(x) {
        super().loadImage(this.IMAGES_WALKING[0]);
        this.loadImages(this.IMAGES_WALKING);
        this.loadImages(this.IMAGES_DEAD);
        this.x = x;
        this.speed = 5 + Math.random() * 0.25;
        this.animate();
    }

    animate() {
        this.animationInterval = setInterval(() => {
            if (this.dead || !this.active) return;
            this.x -= this.speed;
            this.playAnimation(this.IMAGES_WALKING);
        }, 120);
    }

    hit() {
        this.energy -= 20;
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