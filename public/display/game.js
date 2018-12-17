const WIDTH = 1920;
const HEIGHT = 1080;

const PADDING = 20;
const SHIFT = 20;

const PLAYER_SPEED_CHANGE = 500;
const BALL_SPEED = 300;
const PLAYERS_NUMBER = 2;
const MAX_PLAYER_LIFE = 3;

const PLAYER_LEFT = 0;
const PLAYER_RIGHT = 1;
let lastBallHitBy;

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
let bricks = [];
var players = [];

let ball_name = 'ball';
let paddle_name = 'paddle';
let brick_name = 'brick';


function preload() {
    this.load.image(ball_name, '/images/ball.png');
    this.load.image(paddle_name, '/images/paddle.png');
    this.load.image(brick_name, '/images/brick.png');
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

let getPaddlePostition = i => i % 2
        ? {
            x: PADDING,
            y: HEIGHT / 2,
            name: paddle_name
        }
        : {
            x: WIDTH - PADDING,
            y: HEIGHT / 2,
            name: paddle_name
        };

function create() {
    ball = this.physics.add.sprite(WIDTH / 2, HEIGHT / 2, ball_name);
    ball.setBounce(1);
    ball.setCollideWorldBounds(true);
    ball.body.onWorldBounds = true;

    bricks = [];
    const N = 10;
    const M = 10;
    for (var i = 0; i < N; i += 1) {
        for (var j = 0; j < M; j += 1) {
            let position = M * i + j;
            bricks[position] = this.physics.add.sprite(0, 0, brick_name);

            let startX = ( WIDTH - bricks[position].width * N - SHIFT * N ) / 2;
            let startY = ( HEIGHT - bricks[position].height * M - SHIFT * M ) / 2;

            bricks[position].body.onWorldBounds = true;
            bricks[position].setPosition(
                startX + i * (bricks[position].width + SHIFT),
                startY + j * (bricks[position].height + SHIFT)
            );

            bricks[position].body.immovable = true;
            this.physics.add.collider(ball, bricks[position], collisionBallBrick);
        }
    }

    for (var i = 0; i < PLAYERS_NUMBER; i += 1) {
        let paddle = getPaddlePostition(i);

        if (!players[i]) {
            players[i] = {};
        }

        players[i].paddle = this.physics.add.sprite(paddle.x, paddle.y, paddle.name);
        players[i].paddle.body.immovable = true;
        players[i].paddle.setCollideWorldBounds(true);

        this.physics.add.collider(ball, players[i].paddle, collisionBallPlayer);
    }

    this.physics.world.on("worldbounds", function (body, up, down, left, right) {
        if (left) {
            players[PLAYER_LEFT].life -= 1;

            // the ball goes to the opponent side
            ball.setVelocity(-BALL_SPEED, BALL_SPEED);
            ball.setPosition(WIDTH - PADDING - 25, HEIGHT / 2);
            lastBallHitBy = PLAYER_RIGHT;

            //stopGame();
            isGameOver();
        }
        if (right) {
            players[PLAYER_RIGHT].life -= 1;

            // the ball goes to the opponent side
            ball.setVelocity(BALL_SPEED, BALL_SPEED);
            ball.setPosition(PADDING + 25, HEIGHT / 2);
            lastBallHitBy = PLAYER_LEFT;

            //stopGame();
            isGameOver();
        }
    });

    this.scene.pause();
}

function update() {
    updatePlayersLife();
}

function collisionBallPlayer(ball, playerPaddle) {
    if (playerPaddle.position() === players[PLAYER_LEFT].paddle.position()) {
        lastBallHitBy = PLAYER_LEFT;
    } else if (playerPaddle.position() === players[PLAYER_RIGHT].paddle.position()) {
        lastBallHitBy = PLAYER_RIGHT;
    }
}

function collisionBallBrick(ball, brick) {
    if (!brick.isEnabled()) {
        return;
    }

    brick.enabled = false;
    players[lastBallHitBy].score += 1;
}

function startGame() {
    //reset main data in case of restart
    ball.setVelocity(BALL_SPEED, -BALL_SPEED);
    ball.setPosition(WIDTH / 2, HEIGHT / 2);

    for (var i = 0; i < PLAYERS_NUMBER; i += 1) {
        let paddle = getPaddlePostition(i);

        players[i].paddle.setPosition(paddle.x, paddle.y);
        players[i].speed = 0;
        players[i].score = 0;
        players[i].life = MAX_PLAYER_LIFE;
    }

    for (brick of bricks) {
        brick.enabled = true;
    }

    game.scene.resume('default');

    console.log(bricks);
    console.log(players);
}

function stopGame() {
    game.scene.pause('default');
}
