const WIDTH = 1920;
const HEIGHT = 1080;
const PADDING = 10;
const PLAYER_SPEED_CHANGE = 500;
const PLAYERS_NUMBER = 2;
const MAX_PLAYER_LIFE = 3;

const PLAYER_LEFT = 0;
const PLAYER_RIGHT = 1;

const config = {
    type: Phaser.AUTO,
    width: WIDTH,
    height: HEIGHT,
    scene: {
        preload: preload,
        create: create,
        update: update
    },
    callbacks: {
        postBoot: function (game) {
            game.canvas.style.width = '100%';
            game.canvas.style.height = '100%';
        }
    },
    physics: {
        default: 'arcade'
    },
    backgroundColor: '#eee',
    parent: 'game-container'
};

const game = new Phaser.Game(config);
let ball;
let bricks;
var players = [];

let ball_name = 'ball';
let paddle_1_name = 'paddle_1';
let paddle_2_name = 'paddle_2';
let brick_name = 'brick';


function preload() {
    this.load.image(ball_name, '/images/ball.png');
    this.load.image(paddle_1_name, '/images/paddle.png');
    this.load.image(paddle_2_name, '/images/paddle.png');
    this.load.image(brick_name, '/images/brick.png');
}

let getPaddlePostition = i => i % 2
        ? {
            x: PADDING,
            y: HEIGHT / 2,
            name: paddle_1_name
        }
        : {
            x: WIDTH - PADDING,
            y: HEIGHT / 2,
            name: paddle_2_name
        };

function create() {
    ball = this.physics.add.sprite(WIDTH / 2, HEIGHT / 2, ball_name);
    ball.setBounce(1);
    ball.setCollideWorldBounds(true);
    ball.body.onWorldBounds = true;

    for (var i = 0; i < PLAYERS_NUMBER; i += 1) {
        let paddle = getPaddlePostition(i);

        if (!players[i]) {
            players[i] = {};
        }

        players[i].paddle = this.physics.add.sprite(paddle.x, paddle.y, paddle.name);
        players[i].paddle.body.immovable = true;
        players[i].paddle.setCollideWorldBounds(true);

        this.physics.add.collider(ball, players[i].paddle);
    }

    this.physics.world.on("worldbounds", function (body, up, down, left, right) {
        if (left) {
            players[PLAYER_LEFT].life -= 1;

            // the ball goes to the opponent side
            ball.setVelocity(-250, 250);
            ball.setPosition(WIDTH - PADDING - 25, HEIGHT / 2);

            //stopGame();
            isGameOver();
        }
        if (right) {
            players[PLAYER_RIGHT].life -= 1;

            // the ball goes to the opponent side
            ball.setVelocity(250, 250);
            ball.setPosition(PADDING + 25, HEIGHT / 2);

            //stopGame();
            isGameOver();
        }
    });

    this.scene.pause();
}

function update() {
    updatePlayersLife();
}

function startGame() {
    //reset main data in case of restart
    ball.setVelocity(250, -250);
    ball.setPosition(WIDTH / 2, HEIGHT / 2);

    //bricks = this.physics.add.staticGroup();

    for (var i = 0; i < PLAYERS_NUMBER; i += 1) {
        let paddle = getPaddlePostition(i);

        players[i].paddle.setPosition(paddle.x, paddle.y);
        players[i].speed = 0;
        players[i].score = 0;
        players[i].life = MAX_PLAYER_LIFE;
    }

    game.scene.resume('default');
}

function stopGame() {
    game.scene.pause('default');
}

let isAlive = life => life > 0;
let alivePlayersCount = players => {
    let count = 0;
    for (player of players) {
        if (isAlive(player.life)) {
            count += 1;
        }
    }
    return count;
};

function isGameOver() {
    if (alivePlayersCount(players) <= 1) {
        gameOver();
    }
}