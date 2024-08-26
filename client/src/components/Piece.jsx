import React from 'react';

function Piece({ piece, onClick }) {
    return (
        <div className={`piece ${piece.type.toLowerCase()}`} onClick={() => onClick(piece)}>
            {piece.player}-{piece.type}
        </div>
    );
}

export default Piece;
