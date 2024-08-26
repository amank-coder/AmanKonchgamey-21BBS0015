const BOARD_SIZE = 5;

const CHARACTER_TYPES = {
    PAWN: 'Pawn',
    HERO1: 'Hero1',
    HERO2: 'Hero2'
};

function initializeGame() {
    return {
        board: Array(BOARD_SIZE).fill(null).map(() => Array(BOARD_SIZE).fill(null)),
        players: {
            A: { pieces: placeInitialPieces('A') },
            B: { pieces: placeInitialPieces('B') }
        },
        currentPlayer: 'A'
    };
}

function placeInitialPieces(player) {
    return [
        { type: CHARACTER_TYPES.PAWN, position: { x: 0, y: player === 'A' ? 0 : 4 }, player },
        { type: CHARACTER_TYPES.HERO1, position: { x: 1, y: player === 'A' ? 0 : 4 }, player },
        { type: CHARACTER_TYPES.HERO2, position: { x: 2, y: player === 'A' ? 0 : 4 }, player },
        { type: CHARACTER_TYPES.HERO1, position: { x: 3, y: player === 'A' ? 0 : 4 }, player },
        { type: CHARACTER_TYPES.PAWN, position: { x: 4, y: player === 'A' ? 0 : 4 }, player }
    ];
}

function processMove(gameState, move) {
    const { character, direction } = move;
    const player = gameState.currentPlayer;
    
    let piece; // Declare piece with let for reassignment
    if (character.includes("B")) {
        piece = gameState.players[player].pieces.find(p => character === ("B-" + p.type));
    } else {
        piece = gameState.players[player].pieces.find(p => character === ("A-" + p.type));
    }

    console.log("piece", piece);
    console.log("direction", direction);

    // Check if piece is valid
    if (!piece) {
        return { valid: false, message: 'Invalid piece selected' };
    }

    // Check if direction is null
    if (!direction) {
        return { valid: false, message: 'Invalid move: direction cannot be null' };
    }

    const newPosition = calculateNewPosition(piece.position, direction, piece.type, direction);
    console.log("new Position: ", newPosition);

    // Check if move is out of bounds
    if (isOutOfBounds(newPosition)) {
        return { valid: false, message: 'Move out of bounds' };
    }

    // Check if the position is occupied by a friendly piece
    if (isOccupiedByFriendly(newPosition, gameState, player)) {
        return { valid: false, message: 'Position occupied by friendly piece' };
    }

    // Handle piece elimination based on type
    if (piece.type === CHARACTER_TYPES.HERO1 || piece.type === CHARACTER_TYPES.HERO2) {
        eliminatePathOpponents(piece.position, newPosition, gameState, player);
    } else {
        eliminateIfOccupied(newPosition, gameState, player);
    }

    // Move the piece to the new position
    piece.position = newPosition;
    gameState.currentPlayer = gameState.currentPlayer === 'A' ? 'B' : 'A';

    return { valid: true, state: gameState };
}


function calculateNewPosition(position, direction, type) {
    
    
    let moveMap = {
        L: { x: -1, y: 0 },
        R: { x: 1, y: 0 },
        F: { x: 0, y: 1 },
        B: { x: 0, y: -1 },
        FL: { x: -1, y: 1 },  // Fixed: x should be -1 for left movement
        FR: { x: 1, y: 1 },   // Correct: move diagonally right-forward
        BL: { x: -1, y: -1 }, // Fixed: x should be -1 for left movement
        BR: { x: 1, y: -1 }   // Correct: move diagonally right-backward
    };
    

    const multiplier = type === CHARACTER_TYPES.PAWN ? 1 : 2;

    return {
        x: position.x + moveMap[direction].x * multiplier,
        y: position.y + moveMap[direction].y * multiplier
    };
    
}

function isOutOfBounds(position) {
    return position.x < 0 || position.x >= BOARD_SIZE || position.y < 0 || position.y >= BOARD_SIZE;
}

function isOccupiedByFriendly(position, gameState, player) {
    return gameState.players[player].pieces.some(p => p.position.x === position.x && p.position.y === position.y);
}

function eliminatePathOpponents(start, end, gameState, player) {
    const opponent = player === 'A' ? 'B' : 'A';
    const dx = end.x === start.x ? 0 : (end.x - start.x) / Math.abs(end.x - start.x);
    const dy = end.y === start.y ? 0 : (end.y - start.y) / Math.abs(end.y - start.y);


    for (let x = start.x + dx, y = start.y + dy; x !== end.x || y !== end.y; x += dx, y += dy) {
        eliminateIfOccupied({ x, y }, gameState, opponent);
    }
    eliminateIfOccupied(end, gameState, opponent);
}

function eliminateIfOccupied(position, gameState, player) {
    const index = gameState.players[player].pieces.findIndex(p => p.position.x === position.x && p.position.y === position.y);
    if (index !== -1) {
        gameState.players[player].pieces.splice(index, 1);
    }
}

function getGameState(gameState) {
    const board = Array(BOARD_SIZE).fill(null).map(() => Array(BOARD_SIZE).fill(null));
    
    for (const player of Object.keys(gameState.players)) {
        gameState.players[player].pieces.forEach(piece => {
            board[piece.position.y][piece.position.x] = `${player}-${piece.type}`;
        });
    }
    
    return {
        board,
        currentPlayer: gameState.currentPlayer
    };
}

module.exports = {
    initializeGame,
    processMove,
    getGameState
};
