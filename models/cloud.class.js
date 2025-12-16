class Cloud extends MovableObject {
    width = 400;
    height = 300;
    speed = 0.15;

    constructor() {
        super().loadImage('./img/5_background/layers/4_clouds/1.png');
        this.x = 0 + Math.random() * 700;
        this.y = 10 + Math.random() * 50;
        this.animate();

    }

    animate() {
        this.moveLeft();
    }

    moveLeft() {
        setInterval(() => {
            this.x -= this.speed;
        }, 1000 / 60);
    }
}

