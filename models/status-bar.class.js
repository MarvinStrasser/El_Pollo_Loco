class statusBar extends drawableObject {
    isBlinking = false;
    blinkInterval = null;
    blinkState = false;
    lastPercentage = null;
    IMAGES_HEALTHBAR = [
        './img/7_statusbars/1_statusbar/2_statusbar_health/green/0.png',
        './img/7_statusbars/1_statusbar/2_statusbar_health/green/20.png',
        './img/7_statusbars/1_statusbar/2_statusbar_health/green/40.png',
        './img/7_statusbars/1_statusbar/2_statusbar_health/green/60.png',
        './img/7_statusbars/1_statusbar/2_statusbar_health/green/80.png',
        './img/7_statusbars/1_statusbar/2_statusbar_health/green/100.png',
    ];

    IMAGES_COINS = [
        './img/7_statusbars/1_statusbar/1_statusbar_coin/green/0.png',
        './img/7_statusbars/1_statusbar/1_statusbar_coin/green/20.png',
        './img/7_statusbars/1_statusbar/1_statusbar_coin/green/40.png',
        './img/7_statusbars/1_statusbar/1_statusbar_coin/green/60.png',
        './img/7_statusbars/1_statusbar/1_statusbar_coin/green/80.png',
        './img/7_statusbars/1_statusbar/1_statusbar_coin/green/100.png',
    ];

    IMAGES_BOTTLES = [
        './img/7_statusbars/1_statusbar/3_statusbar_bottle/green/0.png',
        './img/7_statusbars/1_statusbar/3_statusbar_bottle/green/20.png',
        './img/7_statusbars/1_statusbar/3_statusbar_bottle/green/40.png',
        './img/7_statusbars/1_statusbar/3_statusbar_bottle/green/60.png',
        './img/7_statusbars/1_statusbar/3_statusbar_bottle/green/80.png',
        './img/7_statusbars/1_statusbar/3_statusbar_bottle/green/100.png',
    ];

    IMAGES_BOSS_HEALTHBAR = [
        './img/7_statusbars/2_statusbar_endboss/orange/orange0.png',
        './img/7_statusbars/2_statusbar_endboss/orange/orange20.png',
        './img/7_statusbars/2_statusbar_endboss/orange/orange40.png',
        './img/7_statusbars/2_statusbar_endboss/orange/orange60.png',
        './img/7_statusbars/2_statusbar_endboss/orange/orange80.png',
        './img/7_statusbars/2_statusbar_endboss/orange/orange100.png',
    ];

    constructor(type) {
        super();
        this.type = type;
        this.height = 50;
        if (type === 'boss') {
            this.width = 400;
        } else {
            this.width = 150;
        }
        this.initByType(type);
        this.loadImages(this.images);
        this.setPercentage(0);
    }

    initByType(type) {
        const TYPES = {
            health: { images: this.IMAGES_HEALTHBAR, x: 20, y: 0 },
            coins: { images: this.IMAGES_COINS, x: 20, y: 50 },
            bottles: { images: this.IMAGES_BOTTLES, x: 20, y: 100 },
            boss: { images: this.IMAGES_BOSS_HEALTHBAR, x: 0, y: 0 }
        };

        const config = TYPES[type];
        Object.assign(this, config);
    }

    setPercentage(percentage) {
        if (percentage === this.lastPercentage) return;
        this.lastPercentage = percentage;
        this.percentage = percentage;
        if (this.type === 'health' && percentage > 0 && percentage <= 20) {
            this.startBlink();
        } else {
            this.stopBlink();
            this.img = this.imageCache[this.images[this.resolveImageIndex()]];
        }
    }

    resolveImageIndex() {
        if (this.percentage == 100) return 5;
        if (this.percentage >= 80) return 4;
        if (this.percentage >= 60) return 3;
        if (this.percentage >= 40) return 2;
        if (this.percentage >= 20) return 1;
        return 0;
    }

startBlink() {
    if (this.type !== 'health' || this.isBlinking) return;
    this.isBlinking = true;
    this.blinkInterval = setInterval(() => {
        this.blinkState = !this.blinkState;
        if (this.blinkState) {
            this.img = this.imageCache[this.images[0]];
        } else {
            this.img = this.imageCache[this.images[1]];
        }
    }, 300);
}

    stopBlink() {
        if (!this.isBlinking) return;
        this.isBlinking = false;
        clearInterval(this.blinkInterval);
        this.blinkInterval = null;
        this.blinkState = false;
    }

}