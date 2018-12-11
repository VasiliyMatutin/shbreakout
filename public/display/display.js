var socket = io();

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

$(document).ready(function() {
    $('#gameStart').off('click').on('click', function (event) {
        event.preventDefault();
        $('#game-container').show();
        startGame();
    });
});

