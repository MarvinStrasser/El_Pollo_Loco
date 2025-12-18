const level_1 = new Level(
    createChickens(3).concat([new Endboss()]),
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
    ],
    createCoins(),
    createBottles()
);

function createChickens(count) {
    let chickens = [];
    let lastX = 600;
    for(let i=0;i<count;i++){
        let gap = 250 + Math.random() * 250;
        let x = lastX + gap;
        chickens.push(new enemyChicken(x));
        lastX = x;
    }
    return chickens;
}

function createCoins() {
    let coins = [];
    coins.push(...createCoinArc(300, 6));
    coins.push(...createCoinArc(800, 5));
    coins.push(...createCoinArc(1200, 7));
    return coins;
}

function createBottles() {
    let bottles = [];
    bottles.push(new Bottle(500, 370));
    bottles.push(new Bottle(700, 370));
    bottles.push(new Bottle(900, 370));
    bottles.push(new Bottle(1150, 370));
    bottles.push(new Bottle(1300, 370));
    bottles.push(new Bottle(1400, 370));
    return bottles;
}

function createCoinArc(startX, amount) {
    let coins = [];
    let spacing = 40;
    let baseY = 250;
    let arcHeight = 120;
    for(let i=0;i<amount;i++){
        let progress = i/(amount-1);
        let x = startX + i*spacing;
        let y = baseY - Math.sin(progress*Math.PI)*arcHeight;
        let coin = new Coin(x);
        coin.y = y;
        coins.push(coin);
    }
    return coins;
}