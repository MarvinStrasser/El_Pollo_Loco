class drawableObject {
    x = 150;
    y = 180;
    height = 150;
    width = 100;
    img;
    imageCache = [];
    currentImage = 0;

    /**
     * Description placeholder
     *
     * @param {*} path 
     */
    loadImage(path) {
        this.img = new Image();
        this.img.src = path;
    }

    /**
     * Description placeholder
     *
     * @param {*} arr 
     */
    loadImages(arr) {
        arr.forEach((path) => {
            let img = new Image();
            img.src = path;
            img.style = 'transform: scaleX(-1)';
            this.imageCache[path] = img;
        });
    }

    /**
     * Description placeholder
     *
     * @param {*} ctx 
     */
    draw(ctx) {
        ctx.drawImage(this.img, this.x, this.y, this.width, this.height);
    }
}