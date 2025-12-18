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
    bossBar = new statusBar('boss');
    boss = null;
    bossBarVisible = false;
    throwableObjects = [];

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
        this.boss = this.level.boss;
    }

    checkCollisions() {
        this.checkEnemyCollisions();
        this.checkBossCollision();
        this.checkItemCollisions();
    }

    checkEnemyCollisions() {
        this.level.enemies.forEach((enemy) => {
            if (enemy instanceof Endboss || enemy.dead) return;
            if (!this.character.isColliding(enemy)) return;
            if (this.isJumpKill(enemy)) {
                enemy.die();
                this.character.speedY = 15;
            } else {
                this.character.hit(5);
                this.statusBar.setPercentage(this.character.LP);
            }
        });
    }

    isJumpKill(enemy) {
        return this.character.speedY < 0 &&
            this.character.y + this.character.height <= enemy.y + enemy.height / 2;
    }

    checkBossCollision() {
        if (!this.bossBarVisible || !this.boss || this.boss.dead) return;
        const distance = Math.abs(this.character.x - this.boss.x);
        if (distance < 100 && !this.boss.isAttacking) {
            this.boss.startAttack();
        }
        if (
            this.boss.isAttacking &&
            !this.boss.hasDealtDamage &&
            this.character.isColliding(this.boss)
        ) {
            this.character.hit(this.boss.damage);
            this.statusBar.setPercentage(this.character.LP);
            this.boss.hasDealtDamage = true;
        }
    }

    checkItemCollisions() {
        this.collectItems(this.level.coins, () => {
            this.character.coins = Math.min(this.character.coins + 20, 100);
            this.coinBar.setPercentage(this.character.coins);
        });
        this.collectItems(this.level.bottles, () => {
            this.character.bottles = Math.min(this.character.bottles + 20, 100);
            this.bottleBar.setPercentage(this.character.bottles);
        });
    }

    checkBottleCollisions() {
        this.throwableObjects.forEach(bottle => {
            if (bottle.hasSplashed) return;
            this.level.enemies.forEach(enemy => {
                if (enemy instanceof Endboss) return;
                if (bottle.isColliding(enemy)) {
                    enemy.hit();
                    bottle.splash();
                }
            });
            if (this.boss && bottle.isColliding(this.boss)) {
                this.boss.hit();
                this.bossBar.setPercentage(this.boss.energy);
                bottle.splash();
            }
        });
    }

    draw() {
        this.clearCanvas();
        this.checkCollisions();
        this.checkThrowObjects();
        this.checkBottleCollisions();
        this.checkBossTrigger();
        this.level.enemies = this.level.enemies.filter(e => !e.remove);
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
        this.addObjectsToMap(this.level.clouds);
        this.addObjectsToMap(this.level.coins);
        this.addObjectsToMap(this.level.bottles);
        this.addObjectsToMap(this.throwableObjects);
        this.addToMap(this.character);
        this.level.enemies
            .filter(e => !(e instanceof Endboss))
            .forEach(e => this.addToMap(e));
        if (this.boss) {
            this.addToMap(this.boss);
        }
        this.ctx.translate(-this.camera_x, 0);
    }

    drawUI() {
        this.addToMap(this.statusBar);
        this.addToMap(this.coinBar);
        this.addToMap(this.bottleBar);
        if (this.bossBarVisible) {
            this.addToMap(this.bossBar);
        }
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

    checkThrowObjects() {
        if (this.keyboard.N && this.character.bottles > 0) {
            let bottle = new ThrowableObject(
                this.character.x + 50,
                this.character.y + 100
            );
            bottle.throw(this.character.otherDirection);
            this.throwableObjects.push(bottle);
            this.character.bottles -= 20;
            this.bottleBar.setPercentage(this.character.bottles);
            this.keyboard.N = false;
        }
    }

    checkBossTrigger() {
        if (!this.boss) return;
        const triggerX = this.boss.x - 300;
        if (this.character.x > triggerX && !this.bossBarVisible) {
            this.bossBarVisible = true;
            this.bossBar.width = 300;
            this.bossBar.height = 60;
            this.bossBar.x = (this.canvas.width / 2) - (this.bossBar.width / 2);
            this.bossBar.y = 10;
            this.bossBar.setPercentage(this.boss.energy);
            this.boss.startWalking();
        }
    }

}
