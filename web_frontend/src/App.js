import React, { useState, useEffect, useRef } from "react";
import "./App.css";

// PUBLIC_INTERFACE
function App() {
  // State initialization: 9 squares, null means empty
  const [squares, setSquares] = useState(Array(9).fill(null));
  const [xIsNext, setXIsNext] = useState(true);
  const [status, setStatus] = useState("ongoing");
  // Keyboard navigation: selected cell
  const [focusedIndex, setFocusedIndex] = useState(0);

  // Refs for each square for focus management (must only be created once)
  const cellRefs = useRef(Array.from({ length: 9 }, () => React.createRef()));

  // Handle move on click or keyboard activation
  // PUBLIC_INTERFACE
  function handleMove(index) {
    if (status !== "ongoing" || squares[index]) return;
    const nextSquares = squares.slice();
    nextSquares[index] = xIsNext ? "X" : "O";
    setSquares(nextSquares);
    setXIsNext(!xIsNext);
  }

  // PUBLIC_INTERFACE
  function resetGame() {
    setSquares(Array(9).fill(null));
    setXIsNext(true);
    setStatus("ongoing");
    setFocusedIndex(0);
  }

  // Compute winner or draw after each move
  useEffect(() => {
    const winner = calculateWinner(squares);
    if (winner) {
      setStatus(winner === "draw" ? "draw" : `${winner}`);
    } else {
      setStatus("ongoing");
    }
  }, [squares]);

  // Keyboard support for board navigation
  // PUBLIC_INTERFACE
  function onCellKeyDown(e, index) {
    let newIndex = index;
    if (e.key === "ArrowRight") {
      newIndex = (index + 1) % 9;
      setFocusedIndex(newIndex);
    } else if (e.key === "ArrowLeft") {
      newIndex = (index + 8) % 9;
      setFocusedIndex(newIndex);
    } else if (e.key === "ArrowUp") {
      newIndex = (index + 6) % 9;
      setFocusedIndex(newIndex);
    } else if (e.key === "ArrowDown") {
      newIndex = (index + 3) % 9;
      setFocusedIndex(newIndex);
    } else if (e.key === " " || e.key === "Enter") {
      handleMove(index);
    }
  }

  // Focus cell on navigation
  useEffect(() => {
    if (
      cellRefs.current[focusedIndex] &&
      cellRefs.current[focusedIndex].current
    ) {
      cellRefs.current[focusedIndex].current.focus();
    }
  }, [focusedIndex]);

  // Game status message
  let gameStatusText;
  if (status === "ongoing") {
    gameStatusText = `Current turn: ${xIsNext ? "X" : "O"}`;
  } else if (status === "draw") {
    gameStatusText = "Draw! Nobody wins.";
  } else {
    gameStatusText = `Winner: ${status}`;
  }

  // PUBLIC_INTERFACE
  return (
    <div className="App tic-tac-toe-root">
      <main>
        <h1 className="tic-title" tabIndex="0">
          Tic Tac Toe
        </h1>
        <div
          className="tic-status"
          role="status"
          aria-live="polite"
          tabIndex="0"
        >
          {gameStatusText}
        </div>
        <Board
          squares={squares}
          onMove={handleMove}
          status={status}
          focusedIndex={focusedIndex}
          setFocusedIndex={setFocusedIndex}
          onCellKeyDown={onCellKeyDown}
          cellRefs={cellRefs.current}
        />
        <button
          className="tic-reset-btn"
          onClick={resetGame}
          aria-label="Reset game"
          tabIndex="0"
        >
          Reset
        </button>
        <footer className="tic-footer" aria-label="Instructions">
          <span>
            Use <kbd>Tab</kbd>, <kbd>Arrow keys</kbd>, <kbd>Enter</kbd> or <kbd>Space</kbd> to play. All controls accessible.
          </span>
        </footer>
      </main>
    </div>
  );
}

// PUBLIC_INTERFACE
function Board({
  squares,
  onMove,
  status,
  focusedIndex,
  onCellKeyDown,
  cellRefs,
}) {
  // ARIA: grid
  return (
    <div
      className="tic-board"
      role="grid"
      aria-label="Tic Tac Toe board"
      tabIndex="-1"
    >
      {squares.map((val, idx) => (
        <Square
          key={idx}
          value={val}
          onClick={() => onMove(idx)}
          disabled={!!val || status !== "ongoing"}
          isFocused={focusedIndex === idx}
          ref={cellRefs[idx]}
          onKeyDown={(e) => onCellKeyDown(e, idx)}
          row={Math.floor(idx / 3)}
          col={idx % 3}
        />
      ))}
    </div>
  );
}

// PUBLIC_INTERFACE
const Square = React.forwardRef(
  (
    { value, onClick, disabled, isFocused, onKeyDown, row, col },
    ref
  ) => (
    <button
      className={`tic-square${isFocused ? " tic-focused" : ""}`}
      onClick={onClick}
      ref={ref}
      onKeyDown={onKeyDown}
      aria-label={`Row ${row + 1} column ${col + 1}${value ? ", " + value : ", empty"}`}
      aria-disabled={disabled}
      tabIndex={isFocused ? "0" : "-1"}
      style={{
        color: value === "X" ? "#E87A41" : value === "O" ? "#007bff" : "inherit",
      }}
    >
      {value}
    </button>
  )
);

// Calculate winner or draw
// PUBLIC_INTERFACE
function calculateWinner(squares) {
  // Returns "X", "O", "draw", or null
  const lines = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8], // rows
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8], // cols
    [0, 4, 8],
    [2, 4, 6], // diagonals
  ];
  for (let line of lines) {
    const [a, b, c] = line;
    if (squares[a] && squares[a] === squares[b] && squares[b] === squares[c]) {
      return squares[a];
    }
  }
  if (squares.every((sq) => sq)) {
    return "draw";
  }
  return null;
}

export default App;
