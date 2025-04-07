import React, { useState } from 'react'
import CharacterSelection from './components/CharacterSelection'
import Game from './components/Game'
import './App.css'

function App() {
  const [gameStarted, setGameStarted] = useState(false)
  const [characters, setCharacters] = useState(null)

  const handleStartGame = (selectedCharacters) => {
    setCharacters(selectedCharacters)
    setGameStarted(true)
  }

  const handleGameOver = (finalScore) => {
    console.log('Game Over! Final Score:', finalScore)
  }

  return (
    <div className="app">
      <h1>Emoji Pacman</h1>
      {!gameStarted ? (
        <CharacterSelection onStartGame={handleStartGame} />
      ) : (
        <Game characters={characters} onGameOver={handleGameOver} />
      )}
    </div>
  )
}

export default App
