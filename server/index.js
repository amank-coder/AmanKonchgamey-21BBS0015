const express = require('express');
const { WebSocketServer } = require('ws');
const { initializeGame, processMove, getGameState } = require('./logic');

const app = express();
const PORT = process.env.PORT || 8080;

const server = app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

const wss = new WebSocketServer({ server });

let gameState = initializeGame();

wss.on('connection', (ws) => {
    ws.send(JSON.stringify({ type: 'init', state: getGameState(gameState) }));

    ws.on('message', (message) => {
        const move = JSON.parse(message);
        const result = processMove(gameState, move);

        if (result.valid) {
            gameState = result.state;
            broadcastGameState();
        } else {
            ws.send(JSON.stringify({ type: 'invalidMove', message: result.message }));
        }
    });
});

function broadcastGameState() {
    wss.clients.forEach(client => {
        if (client.readyState === client.OPEN) {
            client.send(JSON.stringify({ type: 'update', state: getGameState(gameState) }));
        }
    });
}
