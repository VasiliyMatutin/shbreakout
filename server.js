const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const http = require('http');
const socketIO = require('socket.io');
const $ = require("jquery");

const gameSessions = new Map();
const PLAYERS_REQUIRED = 1;
const ROOM_NUMBER_UP_LIMIT = 999999;
const ROOM_NUMBER_DOWN_LIMIT = 100000;

const app = express();
const port = normalizePort(process.env.PORT || '3000');
app.set('port', port);

const server = http.createServer(app);
const io = socketIO(server);
server.listen(port);

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.get('/', function(req, res, next) {
    res.render('/public/index');
});

module.exports = server;

// Bind listeners
io.sockets.on('connection', function (socket) {

    //Handle incoming request from desktop
    socket.on('display_connection', function (data) {
        assignGameRoomOnConnection(socket);
    });

    //Handle incoming request from mobile device
    socket.on('controller_connection', function (data) {
        addPlayerToRoom(socket, data.roomNumber, data.playerName);
    });

});

function assignGameRoomOnConnection(socket) {
    let successGen = false;
    let roomNumber;
    while (!successGen) {
        roomNumber = (Math.floor(Math.random() * ROOM_NUMBER_UP_LIMIT) + ROOM_NUMBER_DOWN_LIMIT).toString();
        if (!gameSessions.has(roomNumber)){
            successGen = true;
        }
    }

    gameSessions.set(roomNumber, {
        displaySocket: socket.id,
        players: {},
        active: false
    });

    // Add viewer to gameRoom
    socket.join('room-' + roomNumber);

    // Emit updated gameState to viewer
    socket.emit('room_assigned', {
        roomNumber
    });
}

function addPlayerToRoom(socket, roomNumber, playerName) {
    if (!gameSessions.has(roomNumber) || gameSessions.get(roomNumber).players.length === PLAYERS_REQUIRED) {
        socket.emit('cannon_join_room');
        return;
    }

    // Add player to gameRoom
    socket.join('room-' + roomNumber);

    //TODO: generate color
    var playerColor = '#0000';
    const room = gameSessions.get(roomNumber);
    room.players[socket.id] = {
        playerName,
        playerColor
    };
    gameSessions.set(roomNumber, room);

    // Emit updated gameState to viewer
    socket.emit('joined_room');

    roomFilled(roomNumber)
}

function roomFilled(roomNumber) {
    if (Object.keys(gameSessions.get(roomNumber).players).length === PLAYERS_REQUIRED){
        io.to(gameSessions.get(roomNumber).displaySocket).emit('player_ready');
    }
}

function log(logline) {
    console.log('[' + new Date().toUTCString() + '] ' + logline);
}

function normalizePort(val) {
    var port = parseInt(val, 10);

    if (isNaN(port)) {
        // named pipe
        return val;
    }

    if (port >= 0) {
        // port number
        return port;
    }

    return false;
}
