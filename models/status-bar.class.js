class StatusBar extends drawableObject {
    isBlinking = false;
    blinkInterval = null;
    blinkState = false;
    lastPercentage = null;
    BLINK_THRESHOLD = 20;
    BLINK_INTERVAL_MS = 300;

    IMAGES = {
        health: [
            './img/7_statusbars/1_statusbar/2_statusbar_health/green/0.png',
            './img/7_statusbars/1_statusbar/2_statusbar_health/green/20.png',
            './img/7_statusbars/1_statusbar/2_statusbar_health/green/40.png',
            './img/7_statusbars/1_statusbar/2_statusbar_health/green/60.png',
            './img/7_statusbars/1_statusbar/2_statusbar_health/green/80.png',
            './img/7_statusbars/1_statusbar/2_statusbar_health/green/100.png',
        ],
        coins: [
            './img/7_statusbars/1_statusbar/1_statusbar_coin/green/0.png',
            './img/7_statusbars/1_statusbar/1_statusbar_coin/green/20.png',
            './img/7_statusbars/1_statusbar/1_statusbar_coin/green/40.png',
            './img/7_statusbars/1_statusbar/1_statusbar_coin/green/60.png',
            './img/7_statusbars/1_statusbar/1_statusbar_coin/green/80.png',
            './img/7_statusbars/1_statusbar/1_statusbar_coin/green/100.png',
        ],
        bottles: [
            './img/7_statusbars/1_statusbar/3_statusbar_bottle/green/0.png',
            './img/7_statusbars/1_statusbar/3_statusbar_bottle/green/20.png',
            './img/7_statusbars/1_statusbar/3_statusbar_bottle/green/40.png',
            './img/7_statusbars/1_statusbar/3_statusbar_bottle/green/60.png',
            './img/7_statusbars/1_statusbar/3_statusbar_bottle/green/80.png',
            './img/7_statusbars/1_statusbar/3_statusbar_bottle/green/100.png',
        ],
        boss: [
            './img/7_statusbars/2_statusbar_endboss/orange/orange0.png',
            './img/7_statusbars/2_statusbar_endboss/orange/orange20.png',
            './img/7_statusbars/2_statusbar_endboss/orange/orange40.png',
            './img/7_statusbars/2_statusbar_endboss/orange/orange60.png',
            './img/7_statusbars/2_statusbar_endboss/orange/orange80.png',
            './img/7_statusbars/2_statusbar_endboss/orange/orange100.png',
        ],
    };

    /**
     * @param {'health'|'coins'|'bottles'|'boss'} type
     */
    constructor(type) {
        super();
        this.type = type;
        this.initLayout();
        this.initImages();
        this.setPercentage(0);
    }

    /** Initializes size and position */
    initLayout() {
        this.height = 50;
        this.width = this.type === 'boss' ? 400 : 150;
        this.setPosition();
    }

    /** Sets x/y position based on type */
    setPosition() {
        const positions = {
            health: [20, 0],
            coins: [20, 50],
            bottles: [20, 100],
            boss: [0, 0],
        };
        [this.x, this.y] = positions[this.type];
    }

    /** Loads images for this status bar */
    initImages() {
        this.images = this.IMAGES[this.type];
        this.loadImages(this.images);
    }

    /**
     * Updates percentage and visuals
     * @param {number} percentage
     */
    setPercentage(percentage) {
        if (percentage === this.lastPercentage) return;
        this.lastPercentage = percentage;
        this.percentage = percentage;
        this.handleBlinking();
        this.updateImage();
    }

    /** Handles blinking state */
    handleBlinking() {
        if (this.shouldBlink()) this.startBlink();
        else this.stopBlink();
    }

    /** @returns {boolean} */
    shouldBlink() {
        return (
            this.type === 'health' &&
            this.percentage > 0 &&
            this.percentage <= this.BLINK_THRESHOLD
        );
    }

    /** Updates current image */
    updateImage() {
        if (this.isBlinking) return;
        const index = this.getImageIndex();
        this.img = this.imageCache[this.images[index]];
    }

    /** @returns {number} */
    getImageIndex() {
        if (this.percentage >= 100) return 5;
        if (this.percentage >= 80) return 4;
        if (this.percentage >= 60) return 3;
        if (this.percentage >= 40) return 2;
        if (this.percentage >= 20) return 1;
        return 0;
    }

    /** Starts blinking animation */
    startBlink() {
        if (this.isBlinking) return;
        this.isBlinking = true;
        this.blinkInterval = setInterval(
            () => this.toggleBlinkImage(),
            this.BLINK_INTERVAL_MS
        );
    }

    /** Toggles blink image */
    toggleBlinkImage() {
        this.blinkState = !this.blinkState;
        const index = this.blinkState ? 0 : 1;
        this.img = this.imageCache[this.images[index]];
    }

    /** Stops blinking animation */
    stopBlink() {
        if (!this.isBlinking) return;
        clearInterval(this.blinkInterval);
        this.resetBlinkState();
    }

    /** Resets blink state */
    resetBlinkState() {
        this.isBlinking = false;
        this.blinkInterval = null;
        this.blinkState = false;
    }
}