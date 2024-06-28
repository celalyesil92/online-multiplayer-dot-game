// public/client.js
const socket = io();

const form = document.getElementById('form');
const input = document.getElementById('input');

form.addEventListener('submit', function(event) {
    event.preventDefault();
    if (input.value) {
        socket.emit('message', input.value);
        input.value = '';
    }
});

socket.on('message', function(message) {
    const item = document.createElement('li');
    item.textContent = message;
    document.getElementById('messages').appendChild(item);
});
