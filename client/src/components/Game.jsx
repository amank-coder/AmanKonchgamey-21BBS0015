import React, { useState, useEffect } from 'react';
import Board from './Board';

const ws = new WebSocket('https://chess-backend-jjyt.onrender.com');

function Game() {
    const [board, setBoard] = useState([]);
    const [currentPlayer, setCurrentPlayer] = useState('');
    const [selectedPiece, setSelectedPiece] = useState(null);

    useEffect(() => {
        ws.onopen = () => {
            console.log('Connected to WebSocket server');
          };
        
        ws.onmessage = (message) => {
            const data = JSON.parse(message.data);
            if (data.type === 'init' || data.type === 'update') {
                setBoard(data.state.board);
                setCurrentPlayer(data.state.currentPlayer);
            } else if (data.type === 'invalidMove') {
                alert(data.message);
            }
        };
    }, []);

    const handlePieceSelect = (piece) => {
        setSelectedPiece(piece);
    };
    
    const handleCellClick = (x, y) => {
        const clickedCell = board[y][x];
    
        if (selectedPiece) {
            // If a piece is selected, check if the clicked cell is empty
            if (clickedCell === null) {
                // Calculate the direction and send the move
                ws.send(JSON.stringify({ character: selectedPiece, direction: calculateDirection(selectedPiece, x, y) }));
                setSelectedPiece(null); // Deselect the piece after moving
            } else {
                // Handle the case where the cell is occupied
                alert('Invalid move: Cannot move to an occupied cell');
            }
        } else {
            // Check if the clicked cell contains the current player's piece
            if (clickedCell && clickedCell.startsWith(currentPlayer + '-')) { // Ensure it belongs to the current player
                setSelectedPiece(clickedCell);
            } else {
                alert("You cannot select this piece");
            }
        }
    };
    

    

    const calculateDirection = (piece, targetX, targetY) => {
        // Find the current position of the selected piece
        const currentPiecePosition = board.flatMap((row, y) =>
            row.map((cell, x) => (cell === piece ? { x, y } : null))
        ).find(Boolean);
    
        if (!currentPiecePosition) return null;
    
        const { x: startX, y: startY } = currentPiecePosition;
    
        if (targetX === startX) {
            // Vertical move
            if (targetY < startY) return 'B'; // Backward
            if (targetY > startY) return 'F'; // Forward
        } else if (targetY === startY) {
            // Horizontal move
            if (targetX < startX) return 'L'; // Left
            if (targetX > startX) return 'R'; // Right
        } else if (Math.abs(targetX - startX) === 1 && Math.abs(targetY - startY) === 1) {
            // Diagonal move (if applicable)
            if (targetY < startY) {
                if (targetX < startX) return 'BL'; // Backward-Left
                return 'BR'; // Backward-Right
            } else {
                if (targetX < startX) return 'FL'; // Forward-Left
                return 'FR'; // Forward-Right
            }
        }
    
        return null; // Invalid move
    };
    

    return (
        <div>
            <h2>Current Player: {currentPlayer}</h2>
            <Board board={board} onCellClick={handleCellClick} selectedPiece={selectedPiece}/>
        </div>
    );
}

export default Game;
