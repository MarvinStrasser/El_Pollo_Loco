class Bottle extends MovableObject {
    width = 60;
    height = 60;

    IMAGES_BOTTLES = [
        './img/6_salsa_bottle/1_salsa_bottle_on_ground.png',
        './img/6_salsa_bottle/2_salsa_bottle_on_ground.png'
    ];

    constructor(x, y) {
        super();
        this.loadImages(this.IMAGES_BOTTLES);
        this.img = this.imageCache[this.IMAGES_BOTTLES[0]];
        this.x = x;
        this.y = y;
        this.animate();
    }

    animate() {
        setInterval(() => {
            this.playAnimation(this.IMAGES_BOTTLES);
        }, 400);
    }
}
