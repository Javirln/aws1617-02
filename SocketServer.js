var app = undefined;
var SocketServer = function(app){this.app = app};
const http = require('http');

var server = http.createServer(this.app);
var io = require('socket.io').listen(server);

io.sockets.on('connection', (socket) => {
    console.log("User connected");
});

SocketServer.prototype.server = server;
SocketServer.prototype.io = io;

module.exports = SocketServer;