import React, { useState, useEffect, useCallback } from 'react';
import './Game.css';

const GRID_SIZE = 28;
const CELL_SIZE = 20;
const GAME_SPEED = 150;
const GHOST_SPEED = 300;
const POWER_PELLET_DURATION = 10000; // 10 seconds in milliseconds
const GHOST_RELEASE_INTERVAL = 30; // Reduced from 100 to release ghosts faster

const Game = ({ characters, onGameOver }) => {
  const [pacman, setPacman] = useState({ x: 14, y: 23, direction: 'right' });
  const [ghosts, setGhosts] = useState([
    { x: 13, y: 14, direction: 'right', emoji: characters.ghosts[0], state: 'inHouse' },
    { x: 14, y: 14, direction: 'left', emoji: characters.ghosts[1], state: 'inHouse' },
    { x: 13, y: 15, direction: 'up', emoji: characters.ghosts[2], state: 'inHouse' },
    { x: 14, y: 15, direction: 'down', emoji: characters.ghosts[3], state: 'inHouse' }
  ]);
  const [dots, setDots] = useState([]);
  const [powerPellets, setPowerPellets] = useState([
    { x: 1, y: 1 },
    { x: GRID_SIZE - 2, y: 1 },
    { x: 1, y: GRID_SIZE - 2 },
    { x: GRID_SIZE - 2, y: GRID_SIZE - 2 }
  ]);
  const [isPowered, setIsPowered] = useState(false);
  const [powerTimer, setPowerTimer] = useState(null);
  const [score, setScore] = useState(0);
  const [isGameOver, setIsGameOver] = useState(false);
  const [isVictory, setIsVictory] = useState(false);
  const [ghostReleaseTimer, setGhostReleaseTimer] = useState(0);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [useMouse, setUseMouse] = useState(true);

  // Initialize dots
  useEffect(() => {
    const newDots = [];
    for (let x = 0; x < GRID_SIZE; x++) {
      for (let y = 0; y < GRID_SIZE; y++) {
        if (!isWall(x, y) && !isPowerPelletLocation(x, y)) {
          newDots.push({ x, y });
        }
      }
    }
    setDots(newDots);
  }, []);

  const isPowerPelletLocation = (x, y) => {
    return powerPellets.some(pellet => pellet.x === x && pellet.y === y);
  };

  // Handle mouse movement
  useEffect(() => {
    const handleMouseMove = (e) => {
      if (isGameOver || !useMouse) return;

      const boardElement = document.querySelector('.game-board');
      if (!boardElement) return;

      const rect = boardElement.getBoundingClientRect();
      const mouseX = e.clientX - rect.left;
      const mouseY = e.clientY - rect.top;
      
      setMousePosition({ x: mouseX, y: mouseY });

      // Calculate target cell based on mouse position
      const targetX = Math.floor(mouseX / CELL_SIZE);
      const targetY = Math.floor(mouseY / CELL_SIZE);

      // Determine direction based on current position and target
      const dx = targetX - pacman.x;
      const dy = targetY - pacman.y;

      if (Math.abs(dx) > Math.abs(dy)) {
        setPacman(prev => ({ ...prev, direction: dx > 0 ? 'right' : 'left' }));
      } else if (dy !== 0) {
        setPacman(prev => ({ ...prev, direction: dy > 0 ? 'down' : 'up' }));
      }
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, [pacman.x, pacman.y, isGameOver, useMouse]);

  // Handle keyboard input
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (isGameOver) return;

      setUseMouse(false);
      let newDirection = null;

      switch (e.key) {
        case 'ArrowUp':
          e.preventDefault(); // Prevent scrolling
          newDirection = 'up';
          break;
        case 'ArrowDown':
          e.preventDefault(); // Prevent scrolling
          newDirection = 'down';
          break;
        case 'ArrowLeft':
          e.preventDefault(); // Prevent scrolling
          newDirection = 'left';
          break;
        case 'ArrowRight':
          e.preventDefault(); // Prevent scrolling
          newDirection = 'right';
          break;
        default:
          return;
      }

      if (newDirection) {
        setPacman(prev => ({ ...prev, direction: newDirection }));
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isGameOver]);

  // Handle mouse click to switch to mouse controls
  useEffect(() => {
    const handleMouseClick = () => {
      setUseMouse(true);
    };

    window.addEventListener('click', handleMouseClick);
    return () => window.removeEventListener('click', handleMouseClick);
  }, []);

  // Game loop
  useEffect(() => {
    if (isGameOver) return;

    const gameLoop = setInterval(() => {
      movePacman();
      moveGhosts();
      checkCollisions();
      setGhostReleaseTimer(prev => prev + 1);
    }, GAME_SPEED);

    return () => clearInterval(gameLoop);
  }, [pacman, ghosts, dots, isGameOver]);

  // Power pellet timer
  useEffect(() => {
    if (isPowered) {
      const timer = setTimeout(() => {
        setIsPowered(false);
        // Reset all ghosts to normal state when power pellet expires
        setGhosts(prev => prev.map(ghost => ({
          ...ghost,
          isVulnerable: false
        })));
      }, POWER_PELLET_DURATION);
      setPowerTimer(timer);
      return () => clearTimeout(timer);
    }
  }, [isPowered]);

  const movePacman = useCallback(() => {
    setPacman(prev => {
      const newPos = { ...prev };
      const direction = prev.direction;

      // Move towards mouse position
      switch (direction) {
        case 'up':
          newPos.y = Math.max(0, prev.y - 1);
          break;
        case 'down':
          newPos.y = Math.min(GRID_SIZE - 1, prev.y + 1);
          break;
        case 'left':
          newPos.x = Math.max(0, prev.x - 1);
          break;
        case 'right':
          newPos.x = Math.min(GRID_SIZE - 1, prev.x + 1);
          break;
        default:
          break;
      }

      if (!isWall(newPos.x, newPos.y)) {
        // Check for power pellet collection
        if (isPowerPelletLocation(newPos.x, newPos.y)) {
          setPowerPellets(prev => prev.filter(
            pellet => pellet.x !== newPos.x || pellet.y !== newPos.y
          ));
          setIsPowered(true);
          setScore(prev => prev + 50);
          if (powerTimer) clearTimeout(powerTimer);
        }

        // Collect dots
        setDots(prevDots => {
          const remainingDots = prevDots.filter(
            dot => dot.x !== newPos.x || dot.y !== newPos.y
          );
          if (remainingDots.length < prevDots.length) {
            setScore(prev => prev + 10);
          }
          return remainingDots;
        });

        return newPos;
      }
      return prev;
    });
  }, [powerTimer]);

  const moveGhosts = useCallback(() => {
    setGhosts(prevGhosts => {
      return prevGhosts.map((ghost, index) => {
        if (ghost.state === 'inHouse') {
          if (ghostReleaseTimer > index * GHOST_RELEASE_INTERVAL) {
            return { ...ghost, state: 'active', x: 13, y: 12 };
          }
          return ghost;
        }

        const newPos = { ...ghost };
        const directions = ['up', 'down', 'left', 'right'];
        
        // If powered, try to move away from Pacman
        if (isPowered) {
          const dx = pacman.x - ghost.x;
          const dy = pacman.y - ghost.y;
          
          if (Math.abs(dx) > Math.abs(dy)) {
            if (dx > 0) directions.unshift('left');
            else directions.unshift('right');
          } else {
            if (dy > 0) directions.unshift('up');
            else directions.unshift('down');
          }
        }
        
        const randomDirection = directions[Math.floor(Math.random() * directions.length)];
        
        switch (randomDirection) {
          case 'up':
            newPos.y = Math.max(0, ghost.y - 1);
            break;
          case 'down':
            newPos.y = Math.min(GRID_SIZE - 1, ghost.y + 1);
            break;
          case 'left':
            newPos.x = Math.max(0, ghost.x - 1);
            break;
          case 'right':
            newPos.x = Math.min(GRID_SIZE - 1, ghost.x + 1);
            break;
          default:
            break;
        }

        if (!isWall(newPos.x, newPos.y)) {
          return { ...newPos, direction: randomDirection };
        }
        return ghost;
      });
    });
  }, [ghostReleaseTimer, isPowered, pacman.x, pacman.y]);

  const checkCollisions = useCallback(() => {
    // Check ghost collisions
    const collidedGhost = ghosts.find(
      ghost => ghost.state === 'active' && ghost.x === pacman.x && ghost.y === pacman.y
    );

    if (collidedGhost) {
      if (isPowered) {
        // Reset ghost to its initial position in the ghost house
        setGhosts(prev => prev.map(g => 
          g === collidedGhost 
            ? { 
                ...g, 
                state: 'inHouse',
                x: g === ghosts[0] ? 13 : 
                   g === ghosts[1] ? 14 : 
                   g === ghosts[2] ? 13 : 14,
                y: g === ghosts[0] || g === ghosts[1] ? 14 : 15,
                direction: g === ghosts[0] ? 'right' : 
                          g === ghosts[1] ? 'left' : 
                          g === ghosts[2] ? 'up' : 'down',
                isVulnerable: false
              }
            : g
        ));
        setGhostReleaseTimer(prev => Math.max(0, prev - GHOST_RELEASE_INTERVAL));
        setScore(prev => prev + 100000);
      } else {
        setIsGameOver(true);
        setIsVictory(false);
        onGameOver(score);
      }
    }

    // Check if all dots and power pellets are collected
    if (dots.length === 0 && powerPellets.length === 0) {
      setIsGameOver(true);
      setIsVictory(true);
      onGameOver(score);
    }
  }, [pacman, ghosts, dots, powerPellets, score, isPowered, onGameOver]);

  const isWall = (x, y) => {
    // Border walls
    if (x === 0 || x === GRID_SIZE - 1 || y === 0 || y === GRID_SIZE - 1) return true;

    // Ghost house
    if (x >= 12 && x <= 15 && y >= 13 && y <= 15) {
      // Create opening at the top
      if (x >= 13 && x <= 14 && y === 13) return false;
      return true;
    }

    // Clear path above ghost house
    if (y === 12 && x >= 11 && x <= 16) return false;

    // Top rows
    if (y === 2) {
      return (x >= 2 && x <= 5) || (x >= 8 && x <= 19) || (x >= 22 && x <= 25);
    }

    if (y === 4) {
      return (x >= 2 && x <= 5) || (x >= 8 && x <= 11) || (x >= 16 && x <= 19) || (x >= 22 && x <= 25);
    }

    // Upper middle rows
    if (y === 7) {
      return (x >= 2 && x <= 5) || (x >= 8 && x <= 11) || (x >= 16 && x <= 19) || (x >= 22 && x <= 25);
    }

    // Vertical connectors in upper section
    if (y >= 2 && y <= 7) {
      return x === 2 || x === 25;
    }

    // Middle rows
    if (y === 10 || y === 17) {
      return (x >= 2 && x <= 11) || (x >= 16 && x <= 25);
    }

    // Lower middle rows
    if (y === 19) {
      return (x >= 2 && x <= 5) || (x >= 8 && x <= 19) || (x >= 22 && x <= 25);
    }

    // Bottom rows
    if (y === 22) {
      return (x >= 2 && x <= 5) || (x >= 8 && x <= 11) || (x >= 16 && x <= 19) || (x >= 22 && x <= 25);
    }

    if (y === 24) {
      return (x >= 2 && x <= 11) || (x >= 16 && x <= 25);
    }

    // Vertical connectors in bottom section
    if (y >= 22 && y <= 24) {
      return x === 2 || x === 11 || x === 16 || x === 25;
    }

    return false;
  };

  return (
    <div className={`game-container ${isPowered ? 'powered' : ''}`}>
      <div className="score">Score: {score}</div>
      <div 
        className="game-board"
        style={{
          display: 'grid',
          gridTemplate: `repeat(${GRID_SIZE}, ${CELL_SIZE}px) / repeat(${GRID_SIZE}, ${CELL_SIZE}px)`,
          gap: '1px',
          backgroundColor: '#000',
          padding: '10px',
          borderRadius: '8px'
        }}
      >
        {Array.from({ length: GRID_SIZE * GRID_SIZE }).map((_, index) => {
          const x = index % GRID_SIZE;
          const y = Math.floor(index / GRID_SIZE);
          const isDot = dots.some(dot => dot.x === x && dot.y === y);
          const isPowerPellet = powerPellets.some(pellet => pellet.x === x && pellet.y === y);
          const isPacman = pacman.x === x && pacman.y === y;
          const ghost = ghosts.find(g => g.x === x && g.y === y);
          const isWallCell = isWall(x, y);

          return (
            <div
              key={index}
              className={`cell ${isWallCell ? 'wall' : ''}`}
              style={{
                width: CELL_SIZE,
                height: CELL_SIZE,
                backgroundColor: isWallCell ? '#0000FF' : '#000',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                fontSize: '20px'
              }}
            >
              {isDot && !isWallCell && <div className="dot" />}
              {isPowerPellet && !isWallCell && <div className="power-pellet" />}
              {isPacman && <div className="pacman">{characters.pacman}</div>}
              {ghost && <div className={`ghost ${isPowered ? 'vulnerable' : ''}`}>{ghost.emoji}</div>}
            </div>
          );
        })}
      </div>
      {isGameOver && (
        <div className="game-over">
          <h2>{isVictory ? 'Victory!' : 'Game Over!'}</h2>
          <p>Final Score: {score}</p>
          <button onClick={() => window.location.reload()}>Play Again</button>
        </div>
      )}
    </div>
  );
};

export default Game; 