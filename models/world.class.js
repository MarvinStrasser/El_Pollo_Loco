class World {
    character = new CharacterPepe();
    camera_x = 0;
    lastHit = 0;
    statusBar = new StatusBar('health');
    coinBar = new StatusBar('coins');
    bottleBar = new StatusBar('bottles');
    bossBar = new StatusBar('boss');
    boss = null;
    bossBarVisible = false;
    throwableObjects = [];
    MAX_BOTTLES = 10;
    BOSS_TRIGGER_DISTANCE = 300;
    BOSS_ATTACK_DISTANCE = 100;

 /**
     * Creates the game world.
     * @param {HTMLCanvasElement} canvas - Game canvas
     * @param {Keyboard} keyboard - Keyboard input handler
     */
    constructor(canvas, keyboard) {
        this.canvas = canvas;
        this.ctx = canvas.getContext('2d');
        this.keyboard = keyboard;
        this.level = createLevel1();
        this.localGameId = gameId;
        this.initWorld();
    }

    /**
     * Initializes the world state.
     */
    initWorld() {
        this.setWorldReferences();
        this.initStatusBars();
        this.startGameLoop();
    }

    /**
     * Assigns the world reference to all relevant objects.
     */
    setWorldReferences() {
        this.character.world = this;
        this.boss = this.level.boss;
        this.level.enemies.forEach(e => e.world = this);
    }

    /**
     * Initializes all status bars.
     */
    initStatusBars() {
        this.statusBar.setPercentage(100);
        this.coinBar.setPercentage(0);
        this.bottleBar.setPercentage(0);
    }

    /**
     * Starts the main game loop.
     */
    startGameLoop() {
        this.draw();
    }

    /**
     * Main animation frame loop.
     */
    draw() {
        if (this.localGameId !== gameId) return;
        this.updateGameLogic();
        this.renderFrame();
        requestAnimationFrame(() => this.draw());
    }

    /**
     * Updates all game logic.
     */
    updateGameLogic() {
        this.clearCanvas();
        this.checkCollisions();
        this.checkBottleCollisions();
        this.checkBossTrigger();
        this.cleanupEnemies();
    }

    /**
     * Renders the current frame.
     */
    renderFrame() {
        this.ctx.translate(this.camera_x, 0);
        this.drawWorldObjects();
        this.ctx.translate(-this.camera_x, 0);
        this.drawUI();
    }

    /**
     * Clears the canvas.
     */
    clearCanvas() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    }

    /**
     * Removes enemies that are marked for removal.
     */
    cleanupEnemies() {
        this.level.enemies = this.level.enemies.filter(e => !e.remove);
    }

    /**
     * Draws all world objects.
     */
    drawWorldObjects() {
        this.drawObjectGroup(this.level.backgroundObjects);
        this.drawObjectGroup(this.level.clouds);
        this.drawObjectGroup(this.level.coins);
        this.drawObjectGroup(this.level.bottles);
        this.drawObjectGroup(this.throwableObjects);
        this.drawCharacterAndEnemies();
    }

    /**
     * Draws the player character and all enemies.
     */
    drawCharacterAndEnemies() {
        this.addToMap(this.character);
        this.level.enemies
            .filter(e => !(e instanceof Endboss))
            .forEach(e => this.addToMap(e));
        if (this.boss) this.addToMap(this.boss);
    }

    /**
     * Draws all UI elements.
     */
    drawUI() {
        this.addToMap(this.statusBar);
        this.addToMap(this.coinBar);
        this.addToMap(this.bottleBar);
        if (this.bossBarVisible) this.addToMap(this.bossBar);
    }

    /**
     * Draws a group of objects.
     * @param {Array<DrawableObject>} objects
     */
    drawObjectGroup(objects) {
        objects.forEach(o => this.addToMap(o));
    }

    /**
     * Draws a single object onto the canvas.
     * @param {DrawableObject} object
     */
    addToMap(object) {
        if (object.otherDirection) this.flipImage(object);
        object.draw(this.ctx);
        if (object.otherDirection) this.flipImageBack(object);
    }

    /**
     * Activates all enemies in the level.
     */
    activateEnemies() {
        this.level.enemies.forEach(enemy => enemy.active = true);
    }

    /**
     * Flips an object image horizontally.
     * @param {DrawableObject} object
     */
    flipImage(object) {
        this.ctx.save();
        this.ctx.translate(object.width, 0);
        this.ctx.scale(-1, 1);
        object.x *= -1;
    }

    /**
     * Restores a previously flipped image.
     * @param {DrawableObject} object
     */
    flipImageBack(object) {
        object.x *= -1;
        this.ctx.restore();
    }

    /**
     * Checks all collision types.
     */
    checkCollisions() {
        this.checkEnemyCollisions();
        this.checkBossCollision();
        this.checkItemCollisions();
    }

    /**
     * Checks collisions between the character and enemies.
     */
    checkEnemyCollisions() {
        this.level.enemies.forEach(enemy => {
            if (enemy instanceof Endboss || enemy.dead) return;
            if (!this.character.isColliding(enemy)) return;
            this.handleEnemyCollision(enemy);
        });
    }

    /**
     * Handles a collision between the character and an enemy.
     * @param {Enemy} enemy
     */
    handleEnemyCollision(enemy) {
        if (this.isJumpKill(enemy)) {
            enemy.die();
            this.character.speedY = 15;
        } else {
            this.character.hit(5);
            this.statusBar.setPercentage(this.character.LP);
        }
    }

    /**
     * Checks whether an enemy was killed by jumping on it.
     * @param {Enemy} enemy
     * @returns {boolean}
     */
    isJumpKill(enemy) {
        return this.character.speedY < 0 &&
            this.character.y + this.character.height <= enemy.y + enemy.height / 2;
    }

    /**
     * Checks collisions with the boss.
     */
    checkBossCollision() {
        if (!this.bossBarVisible || !this.boss || this.boss.dead) return;
        this.triggerBossAttack();
        this.handleBossHit();
    }

    /**
     * Triggers the boss attack if the player is close enough.
     */
    triggerBossAttack() {
        const distance = Math.abs(this.character.x - this.boss.x);
        if (distance < this.BOSS_ATTACK_DISTANCE && !this.boss.isAttacking) {
            this.boss.startAttack();
        }
    }

    /**
     * Handles damage dealt by the boss to the player.
     */
    handleBossHit() {
        if (!this.boss.isAttacking || this.boss.hasDealtDamage) return;
        if (!this.character.isColliding(this.boss)) return;
        this.character.hit(this.boss.damage);
        this.statusBar.setPercentage(this.character.LP);
        this.boss.hasDealtDamage = true;
    }

    /**
     * Checks collisions between the character and items.
     */
    checkItemCollisions() {
        this.collectItems(this.level.coins, () => this.collectCoin());
        this.collectItems(this.level.bottles, () => this.collectBottle());
    }

    /**
     * Collects a coin and updates the UI.
     */
    collectCoin() {
        this.character.coins = Math.min(this.character.coins + 5, 100);
        this.coinBar.setPercentage(this.character.coins);
        playCoinSound();
    }

    /**
     * Collects a bottle and updates the UI.
     */
    collectBottle() {
        this.character.bottles = Math.min(
            this.character.bottles + 1,
            this.MAX_BOTTLES
        );
        this.bottleBar.setPercentage(
            (this.character.bottles / this.MAX_BOTTLES) * 100
        );
        playBottleSound();
    }

    /**
     * Collects items if the character collides with them.
     * @param {Array<DrawableObject>} items
     * @param {Function} onCollect
     */
    collectItems(items, onCollect) {
        for (let i = items.length - 1; i >= 0; i--) {
            if (!this.character.isColliding(items[i])) continue;
            onCollect();
            items.splice(i, 1);
        }
    }

    /**
     * Checks collisions between bottles and enemies.
     */
    checkBottleCollisions() {
        this.throwableObjects.forEach(bottle => {
            if (bottle.hasSplashed) return;
            this.checkBottleHit(bottle);
        });
    }

    /**
     * Handles bottle collisions with enemies and the boss.
     * @param {ThrowableObject} bottle
     */
    checkBottleHit(bottle) {
        this.level.enemies.forEach(enemy => {
            if (enemy instanceof Endboss) return;
            if (!bottle.isCollidingEnemy(enemy)) return;
            enemy.hit();
            bottle.splash();
        });
        if (this.boss && bottle.isCollidingEnemy(this.boss)) {
            this.boss.hit();
            this.bossBar.setPercentage(this.boss.energy);
            bottle.splash();
        }
    }

    /**
     * Checks whether the boss fight should be triggered.
     */
    checkBossTrigger() {
        if (!this.boss || this.bossBarVisible) return;
        if (this.character.x <= this.boss.x - this.BOSS_TRIGGER_DISTANCE) return;
        this.activateBossFight();
    }

    /**
     * Activates the boss fight.
     */
    activateBossFight() {
        this.bossBarVisible = true;
        playBossMusic();
        playBossSound();
        this.setupBossBar();
        this.boss.startWalking();
    }

    /**
     * Sets up the boss health bar.
     */
    setupBossBar() {
        this.bossBar.width = 300;
        this.bossBar.height = 60;
        this.bossBar.x = (this.canvas.width / 2) - (this.bossBar.width / 2);
        this.bossBar.y = 10;
        this.bossBar.setPercentage(this.boss.energy);
    }
}