function createLevel1() {
    return new Level(
        createChickens(9).concat([new Endboss()]),
        [
            new Cloud(),
        ],
        [
            new BackgroundObject('img/5_background/layers/air.png', -720),
            new BackgroundObject('img/5_background/layers/3_third_layer/2.png', -720),
            new BackgroundObject('img/5_background/layers/2_second_layer/2.png', -720),
            new BackgroundObject('img/5_background/layers/1_first_layer/2.png', -720),

            new BackgroundObject('img/5_background/layers/air.png', 0),
            new BackgroundObject('img/5_background/layers/3_third_layer/1.png', 0),
            new BackgroundObject('img/5_background/layers/2_second_layer/1.png', 0),
            new BackgroundObject('img/5_background/layers/1_first_layer/1.png', 0),

            new BackgroundObject('img/5_background/layers/air.png', 720),
            new BackgroundObject('img/5_background/layers/3_third_layer/2.png', 720),
            new BackgroundObject('img/5_background/layers/2_second_layer/2.png', 720),
            new BackgroundObject('img/5_background/layers/1_first_layer/2.png', 720),

            new BackgroundObject('img/5_background/layers/air.png', 1440),
            new BackgroundObject('img/5_background/layers/3_third_layer/1.png', 1440),
            new BackgroundObject('img/5_background/layers/2_second_layer/1.png', 1440),
            new BackgroundObject('img/5_background/layers/1_first_layer/1.png', 1440),

            new BackgroundObject('img/5_background/layers/air.png', 2160),
            new BackgroundObject('img/5_background/layers/3_third_layer/2.png', 2160),
            new BackgroundObject('img/5_background/layers/2_second_layer/2.png', 2160),
            new BackgroundObject('img/5_background/layers/1_first_layer/2.png', 2160),

            new BackgroundObject('img/5_background/layers/air.png', 2880),
            new BackgroundObject('img/5_background/layers/3_third_layer/1.png', 2880),
            new BackgroundObject('img/5_background/layers/2_second_layer/1.png', 2880),
            new BackgroundObject('img/5_background/layers/1_first_layer/1.png', 2880),

            new BackgroundObject('img/5_background/layers/air.png', 3600),
            new BackgroundObject('img/5_background/layers/3_third_layer/2.png', 3600),
            new BackgroundObject('img/5_background/layers/2_second_layer/2.png', 3600),
            new BackgroundObject('img/5_background/layers/1_first_layer/2.png', 3600),
        ],
        createCoins(),
        createBottles()
    );
}

/**
 * Description placeholder
 *
 * @param {*} count 
 * @returns {{}} 
 */
function createChickens(count) {
    let enemies = [];
    let lastX = 600;
    for (let i = 0; i < count; i++) {
        let gap = 250 + Math.random() * 250;
        let x = lastX + gap;
        if (Math.random() < 0.4) {
            enemies.push(new enemyChick(x));
        } else {
            enemies.push(new EnemyChicken(x));
        }
        lastX = x;
    }
    return enemies;
}

/**
 * Description placeholder
 *
 * @returns {{}} 
 */
function createCoins() {
    let coins = [];
    coins.push(...createCoinArc(300, 6));
    coins.push(...createCoinArc(800, 5));
    coins.push(...createCoinArc(1200, 7));
    coins.push(...createCoinArc(1700, 6));
    coins.push(...createCoinArc(2200, 7));
    coins.push(...createCoinArc(2700, 6));
    coins.push(...createCoinArc(3200, 8));
    return coins;
}

/**
 * Description placeholder
 *
 * @returns {{}} 
 */
function createBottles() {
    let bottles = [];
    let positions = [
        500, 700, 900,
        1150, 1300, 1400,
        1650, 1850,
        2100, 2300,
        2550, 2750,
        3000, 3200
    ];
    positions.forEach(x => {
        bottles.push(new Bottle(x, 370));
    });
    return bottles;
}

/**
 * Description placeholder
 *
 * @param {*} startX 
 * @param {*} amount 
 * @returns {{}} 
 */
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