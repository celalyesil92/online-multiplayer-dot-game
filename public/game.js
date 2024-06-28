const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
const socket = io();

let players = {};
let currentPlayerId;

const keys = {};

// Event listeners for key presses
window.addEventListener('keydown', (e) => {
    keys[e.key] = true;
});

window.addEventListener('keyup', (e) => {
    keys[e.key] = false;
});

// Update player positions
function update() {
    const movement = {
        up: keys['w'] || keys['ArrowUp'],
        down: keys['s'] || keys['ArrowDown'],
        left: keys['a'] || keys['ArrowLeft'],
        right: keys['d'] || keys['ArrowRight']
    };
    socket.emit('playerMovement', movement);
}

// Draw players
function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    for (let id in players) {
        const player = players[id];
        ctx.fillStyle = player.color;
        ctx.fillRect(player.x, player.y, 10, 10);
    }
}

// Game loop
function gameLoop() {
    update();
    draw();
    requestAnimationFrame(gameLoop);
}

socket.on('currentPlayers', (serverPlayers) => {
    players = serverPlayers;
    currentPlayerId = socket.id;
});

socket.on('newPlayer', (newPlayer) => {
    players[newPlayer.id] = newPlayer;
});

socket.on('playerMoved', (player) => {
    players[player.id] = player;
});

socket.on('disconnect', (id) => {
    delete players[id];
});

// Start the game
gameLoop();
