class Cloud extends MovableObject {
    width = 400;
    height = 300;
    speed = 0.15;

    /**
       * Creates a cloud with random start position.
       */
    constructor() {
        super().loadImage('./img/5_background/layers/4_clouds/1.png');
        this.x = 0 + Math.random() * 700;
        this.y = 10 + Math.random() * 50;
        this.animate();
    }

    /**
     * Starts cloud animation.
     */
    animate() {
        this.moveLeft();
    }

    /**
     * Moves the cloud continuously to the left.
     */
    moveLeft() {
        setInterval(() => {
            this.x -= this.speed;
        }, 1000 / 60);
    }
}

