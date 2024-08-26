import React from 'react';
import Cell from './Cell';
import './Board.css';

function Board({ board, onCellClick, selectedPiece }) {
  console.log(selectedPiece)  
  return (
      <div className="board">
        {board.map((row, y) => (
          <div key={y} className="row">
            {row.map((cell, x) => (
              <Cell 
                key={x} 
                x={x} 
                y={y} 
                value={cell} 
                onClick={() => onCellClick(x, y)} 
                isSelected={cell === selectedPiece}
              />
            ))}
          </div>
        ))}
      </div>
    );
  }
  

export default Board;
