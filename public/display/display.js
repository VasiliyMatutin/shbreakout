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

socket.on('player_not_ready', function (data) {
    $(document).ready(function() {
        $('#gameStart').attr("disabled", true);
    });
});

socket.on('room_destroyed', function (data) {
    $(document).ready(function() {
        stopGame();
        $('#main-container').hide();
        $('#end-container').hide();
        $('#game-container').hide();
        $('#room-delete-container').show();
    });
});

socket.on('player_state_changed', function (data) {
    if (data.start) {
        if (data.direction === 'left') {
                player_speed -= PLAYER_SPEED_CHANGE;
        } else if (data.direction === 'right'){
                player_speed += PLAYER_SPEED_CHANGE;
        } else {
            player_speed = 0
        }
    } else {
        player_speed = 0
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
