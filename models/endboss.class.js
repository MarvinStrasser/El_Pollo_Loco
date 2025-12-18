class Endboss extends MovableObject {
    height = 400;
    width = 300;
    y = 40;
    energy = 100;
    dead = false;

    IMAGES_WALKING = [
        './img/4_enemie_boss_chicken/2_alert/G5.png',
        './img/4_enemie_boss_chicken/2_alert/G6.png',
        './img/4_enemie_boss_chicken/2_alert/G7.png',
        './img/4_enemie_boss_chicken/2_alert/G8.png',
        './img/4_enemie_boss_chicken/2_alert/G9.png',
        './img/4_enemie_boss_chicken/2_alert/G10.png',
        './img/4_enemie_boss_chicken/2_alert/G11.png',
        './img/4_enemie_boss_chicken/2_alert/G12.png'
    ];

    constructor() {
        super().loadImage(this.IMAGES_WALKING[0]);
        this.loadImages(this.IMAGES_WALKING);
        this.x = 1700;
        this.animate();
    }

    animate() {
        this.animationInterval = setInterval(() => {
            if (!this.dead) this.playAnimation(this.IMAGES_WALKING);
        }, 120);
    }

    hit() {
        if (this.dead) return;
        this.energy -= 20;
        if (this.energy <= 0) this.die();
    }

    die() {
        this.dead = true;
        this.energy = 0;
        clearInterval(this.animationInterval);
    }
}