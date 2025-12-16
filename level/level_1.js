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

    createCoins()

)

function createCoins() {
    let coins = [];

    for (let i = 0; i < 10; i++) {
        let x = 300 + Math.random() * 1400;
        let y = 150 + Math.random() * 200;
        let coin = new Coin(x);
        coin.y = y;
        coins.push(coin);
    }

    return coins;
}
