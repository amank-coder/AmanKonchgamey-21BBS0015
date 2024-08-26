import React from 'react'

function Cell({ x, y, value, onClick, isSelected }) {
    return (
      <div 
        className={`cell ${value ? 'occupied' : ''} ${isSelected ? 'selected' : ''}`} 
        onClick={onClick}
      >
        {value && <span>{value}</span>}
      </div>
    );
  }

  export default Cell;