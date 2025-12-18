class Level {
    enemies;
    boss;
    clouds;
    backgroundObjects;
    coins;
    bottles;
    level_end_x = 1500;

    constructor(enemies, clouds, backgroundObjects, coins, bottles) {
        this.enemies = enemies;
        this.boss = enemies.find(e => e instanceof Endboss);
        this.clouds = clouds;
        this.backgroundObjects = backgroundObjects;
        this.coins = coins;
        this.bottles = bottles;
    }
}