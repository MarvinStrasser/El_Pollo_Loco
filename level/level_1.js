const level_1 = new Level(
    [
        new enemyChicken(),
        new enemyChicken(),
        new enemyChicken(),
        new Endboss()
    ],

    [
        new Cloud(),
    ],

    [
        new BackgroundObject('img/5_background/layers/air.png', -720),
        new BackgroundObject('img/5_background/layers/3_third_layer/2.png', -720),
        new BackgroundObject('img/5_background/layers/2_second_layer/2.png', -720),
        new BackgroundObject('img/5_background/layers/1_first_layer/2.png', -720),

        new BackgroundObject('img/5_background/layers/air.png', 0),
        new BackgroundObject('img/5_background/layers/3_third_layer/1.png', 0, 0),
        new BackgroundObject('img/5_background/layers/2_second_layer/1.png', 0),
        new BackgroundObject('img/5_background/layers/1_first_layer/1.png', 0),

        new BackgroundObject('img/5_background/layers/air.png', 720),
        new BackgroundObject('img/5_background/layers/3_third_layer/2.png', 720),
        new BackgroundObject('img/5_background/layers/2_second_layer/2.png', 720),
        new BackgroundObject('img/5_background/layers/1_first_layer/2.png', 720),

        new BackgroundObject('img/5_background/layers/air.png', 720 * 2),
        new BackgroundObject('img/5_background/layers/3_third_layer/1.png', 720 * 2),
        new BackgroundObject('img/5_background/layers/2_second_layer/1.png', 720 * 2),
        new BackgroundObject('img/5_background/layers/1_first_layer/1.png', 720 * 2),
    ],
    createCoins(),
    createBottles()
)

function createCoins() {
    let coins = [];
    coins.push(...createCoinArc(300, 6));
    coins.push(...createCoinArc(800, 5));
    coins.push(...createCoinArc(1200, 7));
    return coins;
}

function createBottles() {
    let bottles = [];
    bottles.push(new Bottle(500, 160));
    bottles.push(new Bottle(900, 160));
    bottles.push(new Bottle(1300, 160));
    bottles.push(new Bottle(1700, 160));
    return bottles;
}

function createCoinArc(startX, amount) {
    let coins = [];
    let spacing = 40;
    let baseY = 250;
    let arcHeight = 120;
    for (let i = 0; i < amount; i++) {
        let progress = i / (amount - 1);
        let x = startX + i * spacing;
        let y = baseY - Math.sin(progress * Math.PI) * arcHeight;
        let coin = new Coin(x);
        coin.y = y;
        coins.push(coin);
    }
    return coins;
}
