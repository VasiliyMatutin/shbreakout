const socket = io();

socket.emit('display_connection');

let roomNumber;
socket.on('room_assigned', function (data) {
    roomNumber = data.roomNumber;
    $(document).ready(function() {
        $('#roomNumber').text(roomNumber);
    });
});

socket.on('player_ready', function (data) {
    $(document).ready(function() {
        $('#gameStart').removeAttr("disabled");
    });
});

socket.on('player_state_changed', function (data) {
    if (data.direction === 'left') {
        if (data.start) {
            player_speed -= PLAYER_SPEED_CHANGES;
        } else {
            player_speed += PLAYER_SPEED_CHANGES;
        }
    } else {
        if (data.start) {
            player_speed += PLAYER_SPEED_CHANGES;
        } else {
            player_speed -= PLAYER_SPEED_CHANGES;
        }
    }
    paddle.setVelocityX(player_speed);
});

$(document).ready(function() {
    $('#gameStart').off('click').on('click', function (event) {
        event.preventDefault();
        socket.emit('game_start', {
            roomNumber
        });
        $('#main-container').hide();
        $('#game-container').show();
        startGame();
    });
    $('#gameRestart').off('click').on('click', function (event) {
        event.preventDefault();
        socket.emit('game_start', {
            roomNumber
        });
        $('#end-container').hide();
        $('#game-container').show();
        startGame();
    });
});

function gameOver() {
    $(document).ready(function() {
        $('#game-container').hide();
        $('#end-container').show();
    });
    socket.emit('game_over', {
        roomNumber
    });
}
