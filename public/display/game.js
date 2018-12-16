const WIDTH = 1920;
const HEIGHT = 1080;
const PADDING = 10;
const PLAYER_SPEED_CHANGE = 500;
const PLAYERS_NUMBER = 2;

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

function create() {
    ball = this.physics.add.sprite(WIDTH / 2, HEIGHT / 2, ball_name);
    ball.setVelocity(250, -250);
    ball.setBounce(1);
    ball.setCollideWorldBounds(true);
    ball.body.onWorldBounds = true;

    bricks = this.physics.add.staticGroup();

    for (var i = 0; i < PLAYERS_NUMBER; i += 1) {
        if (!players[i]) {
            players[i] = {};
        }
        players[i].speed = 0;
        players[i].score = 0;

        players[i].paddle = i % 2
            ? this.physics.add.sprite(WIDTH - PADDING, HEIGHT / 2, paddle_2_name)
            : this.physics.add.sprite(PADDING, HEIGHT / 2, paddle_1_name);
        players[i].paddle.body.immovable = true;
        players[i].paddle.setCollideWorldBounds(true);

        this.physics.add.collider(ball, players[i].paddle);
    }

    this.physics.world.on("worldbounds", function (body, up, down, left, right) {
        if (left) {
            // TODO: 1st player loses one life
            //game.scene.pause('default');
            //gameOver();
        }
        if (right) {
            // TODO: 2nd player loses one life
        }
    });

    this.scene.pause();
}

function update() {
}

function stopGame() {
    game.scene.pause('default');
}

function startGame() {
    //TODO: regenerate game state, because this method will be called on game restart
    game.scene.resume('default');
}
