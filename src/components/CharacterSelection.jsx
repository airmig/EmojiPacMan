import React, { useState } from 'react';
import './CharacterSelection.css';

const EMOJIS = [
  '😊', '😎', '🤪', '😈', '👻', '🤡', '🤖', '👽',
  '🐱', '🐶', '🐼', '🐨', '🦊', '🐯', '🐸', '🐵'
];

const CharacterSelection = ({ onStartGame }) => {
  const [selectedPacman, setSelectedPacman] = useState(null);
  const [selectedGhosts, setSelectedGhosts] = useState([]);

  const handlePacmanSelect = (emoji) => {
    setSelectedPacman(emoji);
  };

  const handleGhostSelect = (emoji) => {
    if (selectedGhosts.length < 4 && !selectedGhosts.includes(emoji) && emoji !== selectedPacman) {
      setSelectedGhosts([...selectedGhosts, emoji]);
    }
  };

  const handleStartGame = () => {
    if (selectedPacman && selectedGhosts.length === 4) {
      onStartGame({ pacman: selectedPacman, ghosts: selectedGhosts });
    }
  };

  return (
    <div className="character-selection">
      <h2>Select Your Characters</h2>
      
      <div className="selection-section">
        <h3>Choose Pacman:</h3>
        <div className="emoji-grid">
          {EMOJIS.map((emoji) => (
            <button
              key={emoji}
              className={`emoji-button ${selectedPacman === emoji ? 'selected' : ''}`}
              onClick={() => handlePacmanSelect(emoji)}
            >
              {emoji}
            </button>
          ))}
        </div>
      </div>

      <div className="selection-section">
        <h3>Choose 4 Ghosts:</h3>
        <div className="emoji-grid">
          {EMOJIS.map((emoji) => (
            <button
              key={emoji}
              className={`emoji-button ${selectedGhosts.includes(emoji) ? 'selected' : ''}`}
              onClick={() => handleGhostSelect(emoji)}
              disabled={selectedPacman === emoji}
            >
              {emoji}
            </button>
          ))}
        </div>
      </div>

      <button 
        className="start-game-button"
        onClick={handleStartGame}
        disabled={!selectedPacman || selectedGhosts.length !== 4}
      >
        Start Game
      </button>
    </div>
  );
};

export default CharacterSelection; 