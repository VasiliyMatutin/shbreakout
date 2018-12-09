const WIDTH = 1920;
const HEIGHT = 1080;

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
let paddle;
let bricks;

function preload() {
    this.load.image('ball', '/images/ball.png');
    this.load.image('paddle', '/images/paddle.png');
    this.load.image('brick', '/images/brick.png');
}

function create() {
    ball = this.physics.add.sprite(WIDTH / 2, HEIGHT - 25, 'ball');
    bricks = this.physics.add.staticGroup();
    paddle = this.physics.add.sprite(WIDTH / 2, HEIGHT - 5, 'paddle');
    paddle.body.immovable = true;
    ball.setVelocity(250, -250);
    ball.setBounce(1);
    ball.setCollideWorldBounds(true);
    ball.body.onWorldBounds = true;
    this.physics.world.on("worldbounds", function (body, up, down, left, right) {
        if (down) {
            alert("Game over!");
        }
    });

    this.physics.add.collider(ball, paddle);
}

function update() {
    paddle.x = this.input.x;
}

function startGame() {

}
