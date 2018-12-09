const config = {
    type: Phaser.AUTO,
    width: 480,
    height: 320,
    scene: {
        preload: preload,
        creat: create,
        update : update
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


function preload() {

}

function create() {

}

function update() {

}

function startGame() {

}
