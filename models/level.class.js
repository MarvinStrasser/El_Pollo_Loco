class Level {
    enemies;
    boss;
    clouds;
    backgroundObjects;
    coins;
    bottles;
    level_end_x = 3600;

    /**
     * Creates an instance of Level.
     *
     * @constructor
     * @param {*} enemies 
     * @param {*} clouds 
     * @param {*} backgroundObjects 
     * @param {*} coins 
     * @param {*} bottles 
     */
    constructor(enemies, clouds, backgroundObjects, coins, bottles) {
        this.enemies = enemies;
        this.boss = enemies.find(e => e instanceof Endboss);
        this.clouds = clouds;
        this.backgroundObjects = backgroundObjects;
        this.coins = coins;
        this.bottles = bottles;
    }
}