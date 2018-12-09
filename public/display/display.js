var socket = io();

socket.emit('display_connection');

$(document).ready(function() {
    $('#gameStart').off('click').on('click', function (event) {
        console.log('&');
        event.preventDefault();
        $('#game-container').show();
        startGame();
    });
});

