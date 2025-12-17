class World {
    character = new characterPepe();
    level = level_1;
    canvas;
    ctx;
    keyboard;
    camera_x = 0;
    lastHit = 0;
    statusBar = new statusBar('health');
    coinBar = new statusBar('coins');
    bottleBar = new statusBar('bottles');

    constructor(canvas, keyboard) {
        this.ctx = canvas.getContext('2d');
        this.canvas = canvas;
        this.keyboard = keyboard;
        this.draw();
        this.setWorld();
        this.checkCollisions();
        this.statusBar.setPercentage(100);
        this.coinBar.setPercentage(0);
        this.bottleBar.setPercentage(0);
    }

    setWorld() {
        this.character.world = this;
    }

    checkCollisions() {
        this.level.enemies.forEach((enemy) => {
            if (this.character.isColliding(enemy)) {
                this.character.hit(5);
                this.statusBar.setPercentage(this.character.LP);
            }
        });
        this.collectItems(this.level.coins, () => {
            this.character.coins += 20;
            this.coinBar.setPercentage(this.character.coins);
        });
        this.collectItems(this.level.bottles, () => {
            this.character.bottles += 20;
            this.bottleBar.setPercentage(this.character.bottles);
        });
    }

    draw() {
        this.clearCanvas();
        this.checkCollisions();
        this.drawWorld();
        this.drawUI();
        requestAnimationFrame(() => this.draw());
    }

    clearCanvas() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    }

    drawWorld() {
        this.ctx.translate(this.camera_x, 0);
        this.addObjectsToMap(this.level.backgroundObjects);
        this.addObjectsToMap(this.level.coins);
        this.addToMap(this.character);
        this.addObjectsToMap(this.level.clouds);
        this.addObjectsToMap(this.level.enemies);
        this.ctx.translate(-this.camera_x, 0);
    }

    drawUI() {
        this.addToMap(this.statusBar);
        this.addToMap(this.coinBar);
        this.addToMap(this.bottleBar);
    }

    addObjectsToMap(objects) {
        objects.forEach(o => {
            this.addToMap(o);
        });
    }

    addToMap(mo) {
        if (mo.otherDirection) {
            this.flipImage(mo);
        }
        mo.draw(this.ctx);
        mo.drawFrame(this.ctx);
        if (mo.otherDirection) {
            this.flipImageBack(mo);
        }
    }

    flipImage(mo) {
        this.ctx.save();
        this.ctx.translate(mo.width, 0);
        this.ctx.scale(-1, 1)
        mo.x = mo.x * -1;
    }

    flipImageBack(mo) {
        mo.x = mo.x * -1;
        this.ctx.restore();
    }

    collectItems(items, onCollect) {
        for (let i = items.length - 1; i >= 0; i--) {
            if (this.character.isColliding(items[i])) {
                onCollect();
                items.splice(i, 1);
            }
        }
    }
}
