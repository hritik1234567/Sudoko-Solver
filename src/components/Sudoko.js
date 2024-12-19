import React, { useState } from "react";
import axios from 'axios';
import "../sudoko.css";

const Sudoko = () => {
  const [grid, setGrid] = useState(
    Array.from({ length: 9 }, () => Array(9).fill(""))
  );

  const handleInputChange = (row, col, value) => {
    if (/^[1-9]?$/.test(value)) { // Only allow numbers 1-9 or empty
      const newGrid = grid.map((rowArr, rowIndex) =>
        rowArr.map((cell, colIndex) =>
          rowIndex === row && colIndex === col ? value : cell
        )
      );
      setGrid(newGrid);
    }
  };
  const handleReset=()=>{
    setGrid(Array.from({ length: 9 }, () => Array(9).fill("")));
  }
  const handleGenerate = async () => {
    try {
      // Log grid before sending it to ensure no circular references
  
      // Ensure that grid is a 9x9 matrix and contains only valid Sudoku data
      if (!grid || grid.length !== 9 || grid.some(row => row.length !== 9)) {
        console.error("Invalid grid structure");
        return;
      }
  
      // Make a deep copy of the grid to ensure no references to DOM elements or React internals
      const sanitizedGrid = grid.map(row => row.slice());
  
      // Sending the sanitized grid to the backend
      const response = await axios.post('http://localhost:8000/sudoko/solve', { grid: sanitizedGrid });
  
      // Check if the response contains a solved board and update the state
      if (response.data&&response.data.solvedBoard) {
        setGrid(response.data.solvedBoard);
      } else {
        console.error('No solvedBoard in response');
      }
    } catch (error) {
      // Handle errors and log them
      console.error('Error solving Sudoku:', error);
    }
  
    // Log the grid after calling the API to see if it changes
  };

  return (
    <div className="sudoku-container">
        <h2>Sudoko Solver</h2>
        <p>Enter your sudoko to fulfil your sudoko</p>
      <div className="sudoku-grid">
        {grid.map((row, rowIndex) => (
          <div key={rowIndex} className="sudoku-row">
            {row.map((cell, colIndex) => (
              <input
                key={`${rowIndex}-${colIndex}`}
                type="text"
                maxLength="1"
                value={cell}
                onChange={(e) =>
                  handleInputChange(rowIndex, colIndex, e.target.value)
                }
                className="sudoku-cell"
              />
            ))}
          </div>
        ))}
      </div>
      <button onClick={handleGenerate} className="generate-button">
        Generate
      </button>
      <button onClick={handleReset} className="reset-button">
            Reset
      </button>
    </div>
  );
};

export default Sudoko;
