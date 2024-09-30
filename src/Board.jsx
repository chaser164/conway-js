import React, { useState, useEffect, useRef } from 'react';
import './css/board.css'; // Assuming this is your CSS file

export const Board = ({ initialState }) => {

const gridSize = initialState.gridSize;
const initialCells = initialState.initialCells;

const initializeClickedSquares = () => {
    const newClickedSquares = new Set();
    initialCells.forEach(cell => {
        const key = `${cell.x}-${cell.y}`;
        newClickedSquares.add(key);
    });
    return newClickedSquares;
    };

  const [clickedSquares, setClickedSquares] = useState(initializeClickedSquares());
  const [isPlaying, setIsPlaying] = useState(false); // State to control animation
  const intervalRef = useRef(null); // Ref to hold interval ID

  const handleStep = () => {
    setClickedSquares(prevClickedSquares => {
      const nextLivingCells = new Set(prevClickedSquares);
  
      // Helper function to handle wrapping on the edges
      const getWrappedIndex = (index, maxIndex) => {
        if (index < 0) {
          return maxIndex - 1;
        } else if (index >= maxIndex) {
          return 0;
        }
        return index;
      };
  
      // Iterate over each square
      for (let i = 0; i < gridSize; i++) {
        for (let j = 0; j < gridSize; j++) {
          const key = `${i}-${j}`;
          const isAlive = prevClickedSquares.has(key);
  
          // Count the number of living neighbors for the current cell
          let livingNeighbors = 0;
          for (let di = -1; di <= 1; di++) {
            for (let dj = -1; dj <= 1; dj++) {
              if (di === 0 && dj === 0) continue; // Skip the current cell
              const neighborKey = `${getWrappedIndex(i + di, gridSize)}-${getWrappedIndex(j + dj, gridSize)}`;
              if (prevClickedSquares.has(neighborKey)) {
                livingNeighbors++;
              }
            }
          }
  
          // Apply Conway's Game of Life rules
          if (isAlive) {
            if (livingNeighbors !== 2 && livingNeighbors !== 3) {
              // Cell dies due to underpopulation or overpopulation
              nextLivingCells.delete(key);
            }
          } else {
            if (livingNeighbors === 3) {
              // Cell becomes alive due to reproduction
              nextLivingCells.add(key);
            }
          }
        }
      }
  
      return nextLivingCells;
    });
  };
  

  // Function to start or stop the animation
  const toggleAnimation = () => {
    setIsPlaying(!isPlaying);
  };

  // UseEffect to handle animation
  useEffect(() => {
    if (isPlaying) {
      intervalRef.current = setInterval(() => {
        handleStep();
      }, 100); // Adjust speed of animation as needed
    } else {
      clearInterval(intervalRef.current);
    }
    return () => clearInterval(intervalRef.current);
  }, [isPlaying]);

  return (
    <div>
      <div className="grid-container">
        <div className="grid">
          {Array.from({ length: gridSize * gridSize }, (_, index) => {
            const i = Math.floor(index / gridSize);
            const j = index % gridSize;
            const key = `${i}-${j}`;
            const isClicked = clickedSquares.has(key);
            return (
              <div
                key={key}
                className={`square ${isClicked ? 'clicked' : ''}`}
                onClick={() => {
                  const newClickedSquares = new Set(clickedSquares);
                  if (newClickedSquares.has(key)) {
                    newClickedSquares.delete(key);
                  } else {
                    newClickedSquares.add(key);
                  }
                  setClickedSquares(newClickedSquares);
                }}
              ></div>
            );
          })}
        </div>
      </div>
      <button onClick={toggleAnimation}>{isPlaying ? "Pause" : "Play"}</button>
    </div>
  );
};
