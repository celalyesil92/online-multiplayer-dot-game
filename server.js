const express = require('express');
const http = require('http');
const socketIo = require('socket.io');

const app = express();
const server = http.createServer(app);
const io = socketIo(server);

const players = {};

io.on('connection', (socket) => {
    console.log('a user connected:', socket.id);
    players[socket.id] = {
        x: Math.floor(Math.random() * 800),
        y: Math.floor(Math.random() * 600),
        color: socket.id % 2 === 0 ? 'red' : 'blue',
        speed: 5
    };

    socket.emit('currentPlayers', players);
    socket.broadcast.emit('newPlayer', players[socket.id]);

    socket.on('playerMovement', (movementData) => {
        const player = players[socket.id];
        if (movementData.up) player.y -= player.speed;
        if (movementData.down) player.y += player.speed;
        if (movementData.left) player.x -= player.speed;
        if (movementData.right) player.x += player.speed;
        io.emit('playerMoved', player);
    });

    socket.on('disconnect', () => {
        console.log('user disconnected:', socket.id);
        delete players[socket.id];
        io.emit('disconnect', socket.id);
    });
});

app.use(express.static(__dirname + '/public'));

server.listen(3000, () => {
    console.log('listening on *:3000');
});
