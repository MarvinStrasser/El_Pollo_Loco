class Coin extends MovableObject {
    width = 60;
    height = 60;

    IMAGES_COIN = [
        './img/8_coin/coin_1.png',
        './img/8_coin/coin_2.png'
    ];

    constructor(x) {
        super();
        this.loadImages(this.IMAGES_COIN);
        this.img = this.imageCache[this.IMAGES_COIN[0]];
        this.x = x;
        this.animate();
    }

    animate() {
        setInterval(() => {
            this.playAnimation(this.IMAGES_COIN);
        }, 400);
    }
}