class BackgroundObject extends MovableObject {
    width = 720;
    height = 480;

    /**
      * Creates a background object.
      * @param {string} imagePath - Path to the background image
      * @param {number} x - Horizontal start position
      */
    constructor(imagePath, x,) {
        super(), this.loadImage(imagePath);
        this.x = x;
        this.y = 480 - this.height;
    }
}