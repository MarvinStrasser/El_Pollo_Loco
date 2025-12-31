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
    hasPlayedDeathSound = false;
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

    /**
       * Creates a new Endboss instance.
       * Loads all required images and starts the animation loop.
       */
    constructor() {
        super().loadImage(this.IMAGES_ALERT[0]);
        this.loadImages(this.IMAGES_ALERT);
        this.loadImages(this.IMAGES_WALKING);
        this.loadImages(this.IMAGES_BOSS_ATTACK);
        this.loadImages(this.IMAGES_BOSS_HURT);
        this.loadImages(this.IMAGES_BOSS_DEAD);
        this.x = 3400;
        this.animate();
    }

    /**
     * Starts the main animation loop of the endboss.
     * Prevents multiple animation intervals from running.
     */
    animate() {
        if (this.animationStarted) return;
        this.animationStarted = true;
        this.animationInterval = setInterval(() => {
            this.updateState();
            this.updateMovement();
            this.updateAnimation();
        }, 150);
    }

    /**
     * Updates the current state of the endboss.
     * Switches to dead state if the boss is defeated.
     */
    updateState() {
        if (this.dead) this.state = 'dead';
    }

    /**
     * Handles the movement logic of the endboss.
     * Moves towards the player while in walking state.
     */
    updateMovement() {
        if (this.state !== 'walking' || this.dead || !this.world) return;
        const pepe = this.world.character;
        if (!pepe) return;
        if (pepe.x < this.x) {
            this.x -= this.speed;
            this.otherDirection = false;
        } else {
            this.x += this.speed;
            this.otherDirection = true;
        }
    }

    /**
     * Updates the animation based on the current boss state.
     */
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

    /**
     * Switches the endboss into walking state.
     */
    startWalking() {
        if (this.dead) return;
        this.state = 'walking';
    }

    /**
     * Starts an attack animation and attack state.
     * Automatically returns to walking state after the attack duration.
     */
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

    /**
     * Handles damage taken by the endboss.
     * Triggers hurt animation and death if energy reaches zero.
     */
    hit() {
        if (this.dead) return;
        this.energy -= 20;
        playBossHitSound();
        this.state = 'hurt';
        setTimeout(() => {
            if (!this.dead) this.state = 'walking';
        }, 400);
        if (this.energy <= 0) {
            this.energy = 0;
            this.die();
        }
    }

    /**
     * Handles the death of the endboss.
     * Stops gameplay, plays the death animation
     * and schedules the win screen.
     */
    die() {
        if (this.dead || gameOver) return;
        this.prepareDeath();
        this.startDeathAnimation();
        this.scheduleWinScreen();
    }

    /**
     * Prepares the endboss death state.
     * Stops all sounds and clears active animations.
     */
    prepareDeath() {
        gameOver = true;
        stopBossSound();
        stopBossMusic();
        stopAllMusic();
        stopFootsteps();
        this.dead = true;
        this.state = 'dead';
        this.isDying = true;
        clearInterval(this.animationInterval);
    }

    /**
     * Plays the endboss death animation frame by frame.
     * Plays the death sound after the final frame.
     */
    startDeathAnimation() {
        let i = 0;
        this.animationInterval = setInterval(() => {
            if (i >= this.IMAGES_BOSS_DEAD.length) {
                clearInterval(this.animationInterval);
                playBossDeathSound();
                return;
            }
            this.img = this.imageCache[this.IMAGES_BOSS_DEAD[i]];
            i++;
        }, 100);
    }

    /**
     * Displays the win screen after the endboss is defeated.
     * Plays win music and shows end options after a delay.
     */
    scheduleWinScreen() {
        setTimeout(() => {
            document.getElementById('winScreen').classList.remove('hidden');
            playWinMusic();
            setTimeout(() => {
                document.getElementById('winScreen').classList.add('hidden');
                document.getElementById('endOptionsScreen').classList.remove('hidden');
            }, 5000);
        }, 2000);
    }
}