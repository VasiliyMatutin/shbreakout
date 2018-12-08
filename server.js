const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const http = require('http');
const socketIO = require('socket.io');
const $ = require("jquery");

const lockedRooms = {};
const PLAYERS_REQUIRED = 2;

const app = express();
const port = normalizePort(process.env.PORT || '3000');
app.set('port', port);

const server = http.createServer(app);
const io = socketIO(server);
server.listen(port);

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
        log('Desktop request');
    });

    //Handle incoming request from mobile device
    socket.on('controller_connection', function (data) {
        log('Mobile request');
    });
});

function log(logline) {
    console.log('[' + new Date().toUTCString() + '] ' + logline);
}
