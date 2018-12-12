const socket = io();

let playerNumber;
let roomNumber;

socket.on('connection_error', (data) => {
    console.log('cannon_join_room');
});

socket.on('joined_room', (data) => {
    playerNumber = data.playerNumber;
});

socket.on('game_start', function (data) {
    $(document).ready(function() {
        $('#main-container').hide();
        $('#buttons-container').show();
    });
});

$(document).ready(function() {
    $('#left').on('mousedown', function() {
        socket.emit('player_state_changed', {
            playerNumber,
            roomNumber,
            direction: 'left',
            start: true
        });
    }).on('mouseup', function() {
        socket.emit('player_state_changed', {
            playerNumber,
            roomNumber,
            direction: 'left',
            start: false
        });
    });

    $('#right').on('mousedown', function() {
        socket.emit('player_state_changed', {
            playerNumber,
            roomNumber,
            direction: 'right',
            start: true
        });
    }).on('mouseup', function() {
        socket.emit('player_state_changed', {
            playerNumber,
            roomNumber,
            direction: 'right',
            start: false
        });
    });

    $('#confirm').off('click').on('click', function (event) {
        event.preventDefault();
        roomNumber = $('#roomNumber').val();
        socket.emit('controller_connection', {
            roomNumber: roomNumber,
            playerName: 'testBot'
        });
    });
});



