var socket = io();

socket.on('cannon_join_room', (data) => {
    console.log('cannon_join_room');
});

socket.on('joined_room', (data) => {
    console.log('joined_room');
});

$(document).ready(function() {
    $('#left').on('mousedown', function() {
        socket.emit('player_state_changed', {
            direction: 'left',
            start: true
        });
    }).on('mouseup mouseleave', function() {
        socket.emit('player_state_changed', {
            direction: 'left',
            start: false
        });
    });

    $('#right').on('mousedown', function() {
        socket.emit('player_state_changed', {
            direction: 'right',
            start: true
        });
    }).on('mouseup mouseleave', function() {
        socket.emit('player_state_changed', {
            direction: 'right',
            start: false
        });
    });

    $('#confirm').off('click').on('click', function (event) {
        event.preventDefault();
        const gameRoom = $('#roomNumber').val();
        socket.emit('controller_connection', {
            roomNumber: gameRoom,
            playerName: 'testBot'
        });
    });
});



