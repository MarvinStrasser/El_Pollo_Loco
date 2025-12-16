class Coin extends MovableObject {
    width = 60;
    height = 60;
    y = 360;

    constructor(x) {
        super();
        this.loadImage('./img/8_coin/coin_1.png');
        this.x = x;
    }

}