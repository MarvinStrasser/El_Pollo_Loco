class Bottle extends MovableObject {
    width = 60;
    height = 60;
    IMAGES_BOTTLES = [
        './img/6_salsa_bottle/1_salsa_bottle_on_ground.png',
        './img/6_salsa_bottle/2_salsa_bottle_on_ground.png'
    ];

    /**
       * Creates a bottle at a given position.
       * @param {number} x - Horizontal start position
       * @param {number} y - Vertical start position
       */
    constructor(x, y) {
        super();
        this.loadImages(this.IMAGES_BOTTLES);
        this.img = this.imageCache[this.IMAGES_BOTTLES[0]];
        this.x = x;
        this.y = y;
        this.animate();
    }

    /**
     * Starts the bottle animation loop.
     */
    animate() {
        setInterval(() => {
            this.playAnimation(this.IMAGES_BOTTLES);
        }, 400);
    }
}
