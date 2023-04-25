import './App.css';
import * as React from 'react';
import { useLocalStorageState } from '../localStorageHook';

function Board({squares, onClick}) {
  function renderSquare(i) {
    return (
      <button className="square" onClick={() => onClick(i)}>
        {squares[i]}
      </button>
    )
  }

  return (
    <div>
      <div className="board-row">
        {renderSquare(0)}
        {renderSquare(1)}
        {renderSquare(2)}
      </div>
      <div className="board-row">
        {renderSquare(3)}
        {renderSquare(4)}
        {renderSquare(5)}
      </div>
      <div className="board-row">
        {renderSquare(6)}
        {renderSquare(7)}
        {renderSquare(8)}
      </div>
    </div>
  )
}

function Game() {
  const [currentSquareStep, setCurrentSquareStep] = useLocalStorageState(
    'game:step', 0
  );
  const [history, setHistory] = useLocalStorageState(
    'game:history', [Array(9).fill(null)]
  );
  
  const currentSquares = history[currentSquareStep]
  const nextValue = calculateNextValue(currentSquares);
  const winner = calculateWinner(currentSquares);
  const status = calculateStatus(winner, currentSquares, nextValue);
  
  function selectSquare(square) {
    if (currentSquares[square] !== null || winner){
      return
    }

    const newHistory = history.splice(0, currentSquareStep + 1);
    const copySquares = [...currentSquares];

    copySquares[square] = nextValue;
    setHistory([...newHistory, copySquares]);
    setCurrentSquareStep(newHistory.length);
  }

  function restart() {
    setCurrentSquareStep(0);
    setHistory([Array(9).fill(null)]);
  }

const moves = history.map((stepSquares, step) => {
  const desc = step ? `Return to move ${step}` : `Return to the start`;
  const isCurrentStep = step === currentSquareStep
  return (
    <li key={step}>
      <button disabled={isCurrentStep} onClick={() => setCurrentSquareStep(step)}>
        {desc} {isCurrentStep ? '(current)' : null}
      </button>
    </li>
  )
})

  return (
    <div className="pre-game">
      <h1>Tic Tac Toe</h1>
      <div className="game">
        <div className="game-board">
          <Board onClick={selectSquare} squares={currentSquares}/>
          <button onClick={restart}>
            restart
          </button>
        </div>
        <div className='game-info'>
          <div>{status}</div>
          <ol>{moves}</ol>
        </div>
      </div>
    </div>
    
  )
}

function calculateStatus(winner, squares, nextValue) {
  return winner
    ? `Winner: ${winner}`
    : squares.every(Boolean)
    ? `It's a tie!`
    : `Next player: ${nextValue}`
}

function calculateNextValue(squares) {
  return squares.filter(Boolean).length % 2 === 0 ? 'X' : 'O'
}

function calculateWinner(squares) {
  const lines = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6],
  ]
  for (let i = 0; i < lines.length; i++) {
    const [a, b, c] = lines[i]
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
      return squares[a]
    }
  }
  return null
}

function App() {
  return <Game />
}

export default App
