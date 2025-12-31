class Coin extends MovableObject {
    width = 60;
    height = 60;
    IMAGES_COIN = [
        './img/8_coin/coin_1.png',
        './img/8_coin/coin_2.png'
    ];

    /**
      * Creates a coin at a given x-position.
      * @param {number} x - Horizontal start position
      */
    constructor(x) {
        super();
        this.loadImages(this.IMAGES_COIN);
        this.img = this.imageCache[this.IMAGES_COIN[0]];
        this.x = x;
        this.animate();
    }

    /**
     * Starts the coin animation loop.
     */
    animate() {
        setInterval(() => {
            this.playAnimation(this.IMAGES_COIN);
        }, 400);
    }
}