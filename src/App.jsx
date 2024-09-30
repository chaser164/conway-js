// import { useState } from 'react'
import './css/app.css'
import { Board } from './Board'

function generateRandomBoard(gridSize, numAliveCells) {
  const initialCells = [];

  // Function to generate a random number between min and max (inclusive)
  const getRandomNumber = (min, max) => {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  };

  // Choose a random starting cell and add it to initialCells
  const startX = getRandomNumber(0, gridSize - 1);
  const startY = getRandomNumber(0, gridSize - 1);
  initialCells.push({ x: startX, y: startY });

  // Function to add a random neighbor cell to initialCells
  const addRandomNeighbor = () => {
    // Choose a random cell from initialCells
    const randomIndex = getRandomNumber(0, initialCells.length - 1);
    const randomCell = initialCells[randomIndex];
    const neighbors = [];

    // Find available neighbor cells
    for (let dx = -3; dx <= 3; dx++) {
      for (let dy = -3; dy <= 3; dy++) {
        const newX = randomCell.x + dx;
        const newY = randomCell.y + dy;
        if (newX >= 0 && newX < gridSize && newY >= 0 && newY < gridSize) {
          const alreadyExists = initialCells.some(c => c.x === newX && c.y === newY);
          if (!alreadyExists) {
            neighbors.push({ x: newX, y: newY });
          }
        }
      }
    }

    // Choose a random neighbor and add it to initialCells
    if (neighbors.length > 0) {
      const randomNeighbor = neighbors[getRandomNumber(0, neighbors.length - 1)];
      initialCells.push(randomNeighbor);
    }
  };

  // Add random neighbors to initialCells
  for (let i = 1; i < numAliveCells; i++) {
    addRandomNeighbor();
  }

  return {
    gridSize: gridSize,
    initialCells: initialCells
  };
}

const board = generateRandomBoard(16, 8)


function App() {

  return (
    <>
      <Board initialState={board} />
    </>
  )
}

export default App
