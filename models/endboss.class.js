class Endboss extends MovableObject {
    height = 400;
    width = 300;
    y = 40;
    energy = 100;
    dead = false;
    state = 'alert';
    speed = 15;
    animationStarted = false;
    isAttacking = false;
    attackDuration = 800;
    isDying = false;
    hasDealtDamage = false;
    damage = 20;

    IMAGES_WALKING = [
        './img/4_enemie_boss_chicken/1_walk/G1.png',
        './img/4_enemie_boss_chicken/1_walk/G2.png',
        './img/4_enemie_boss_chicken/1_walk/G3.png',
        './img/4_enemie_boss_chicken/1_walk/G4.png',
    ];

    IMAGES_ALERT = [
        './img/4_enemie_boss_chicken/2_alert/G5.png',
        './img/4_enemie_boss_chicken/2_alert/G6.png',
        './img/4_enemie_boss_chicken/2_alert/G7.png',
        './img/4_enemie_boss_chicken/2_alert/G8.png',
        './img/4_enemie_boss_chicken/2_alert/G9.png',
        './img/4_enemie_boss_chicken/2_alert/G10.png',
        './img/4_enemie_boss_chicken/2_alert/G11.png',
        './img/4_enemie_boss_chicken/2_alert/G12.png'
    ];

    IMAGES_BOSS_ATTACK = [
        './img/4_enemie_boss_chicken/3_attack/G13.png',
        './img/4_enemie_boss_chicken/3_attack/G14.png',
        './img/4_enemie_boss_chicken/3_attack/G15.png',
        './img/4_enemie_boss_chicken/3_attack/G16.png',
        './img/4_enemie_boss_chicken/3_attack/G17.png',
        './img/4_enemie_boss_chicken/3_attack/G18.png',
        './img/4_enemie_boss_chicken/3_attack/G19.png',
        './img/4_enemie_boss_chicken/3_attack/G20.png',
    ];

    IMAGES_BOSS_HURT = [
        './img/4_enemie_boss_chicken/4_hurt/G21.png',
        './img/4_enemie_boss_chicken/4_hurt/G22.png',
        './img/4_enemie_boss_chicken/4_hurt/G23.png',
    ];

    IMAGES_BOSS_DEAD = [
        './img/4_enemie_boss_chicken/5_dead/G24.png',
        './img/4_enemie_boss_chicken/5_dead/G25.png',
        './img/4_enemie_boss_chicken/5_dead/G26.png',
    ];

    constructor() {
        super().loadImage(this.IMAGES_ALERT[0]);
        this.loadImages(this.IMAGES_ALERT);
        this.loadImages(this.IMAGES_WALKING);
        this.loadImages(this.IMAGES_BOSS_ATTACK);
        this.loadImages(this.IMAGES_BOSS_HURT);
        this.loadImages(this.IMAGES_BOSS_DEAD);
        this.x = 1700;
        this.animate();
    }

    animate() {
        if (this.animationStarted) return;
        this.animationStarted = true;
        this.animationInterval = setInterval(() => {
            this.updateState();
            this.updateMovement();
            this.updateAnimation();
        }, 150);
    }

    updateState() {
        if (this.dead) this.state = 'dead';
    }

    updateMovement() {
        if (this.state === 'walking') {
            this.x -= this.speed;
        }
    }

    updateAnimation() {
        const animations = {
            alert: this.IMAGES_ALERT,
            walking: this.IMAGES_WALKING,
            attack: this.IMAGES_BOSS_ATTACK,
            hurt: this.IMAGES_BOSS_HURT,
            dead: this.IMAGES_BOSS_DEAD
        };

        this.playAnimation(animations[this.state]);
    }

    startWalking() {
        if (this.dead) return;
        this.state = 'walking';
    }

    startAttack() {
        if (this.dead || this.isAttacking) return;
        this.isAttacking = true;
        this.hasDealtDamage = false;
        this.state = 'attack';
        setTimeout(() => {
            this.isAttacking = false;
            if (!this.dead) this.state = 'walking';
        }, this.attackDuration);
    }

    hit() {
        if (this.dead) return;
        this.energy -= 20;
        this.state = 'hurt';
        setTimeout(() => {
            if (!this.dead) this.state = 'walking';
        }, 400);
        if (this.energy <= 0) {
            this.energy = 0;
            this.die();
        }
    }

    die() {
        if (this.dead) return;
        this.dead = true;
        this.state = 'dead';
        this.isDying = true;
        clearInterval(this.animationInterval);
        let i = 0;
        this.animationInterval = setInterval(() => {
            if (i >= this.IMAGES_BOSS_DEAD.length) {
                clearInterval(this.animationInterval);
                return;
            }
            this.img = this.imageCache[this.IMAGES_BOSS_DEAD[i]];
            i++;
        }, 100);
    }
}