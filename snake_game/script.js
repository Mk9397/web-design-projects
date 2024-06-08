const board = document.getElementById('game-board')
const instructionText = document.getElementById('instruction-text')
const logo = document.getElementById('logo')
const score = document.getElementById('score')
const highScore = document.getElementById('highScore')
const settingsPage = document.getElementById('settings')
const lvlBtn = document.querySelectorAll('.lvl-btn')

const gridSize = 20
let snake = [{ x: 10, y: 10 }]
let food = generateFood()
let direction = ''
let gameInterval
let gameSpeedDelay = 200
let gameStarted = false
let prevDirection
let settingsOpen = false

// Draw the food
function generateFood() {
  const x = Math.floor(Math.random() * gridSize) + 1
  const y = Math.floor(Math.random() * gridSize) + 1
  return { x, y }
}

function drawFood() {
  if (gameStarted) {
    const foodElement = createGameElement('div', 'food')
    setPosition(foodElement, food)
    board.appendChild(foodElement)
  }
}

// Create a snake or food cube/div
function createGameElement(tag, className) {
  const element = document.createElement(tag)
  element.className = className
  return element
}

// Set the position of snake or food
function setPosition(element, position) {
  element.style.gridColumn = position.x
  element.style.gridRow = position.y
}

function drawSnake() {
  if (gameStarted) {
    snake.forEach((segment, i) => {
      const snakeElement = createGameElement('div', 'snake')
      setPosition(snakeElement, segment)
      if (i === 0) {
        snakeElement.style.backgroundColor = '#2c2b2b'
        if (direction === 'up') {
          snakeElement.style.borderTop = '9px solid #414141'
          snakeElement.style.borderBottom = '4px solid #414141'
          snakeElement.style.borderLeft = '4px solid #414141'
          snakeElement.style.borderRight = '9px solid #414141'
        }
        if (direction === 'down') {
          snakeElement.style.borderTop = '4px solid #414141'
          snakeElement.style.borderBottom = '9px solid #414141'
          snakeElement.style.borderLeft = '9px solid #414141'
          snakeElement.style.borderRight = '4px solid #414141'
        }
        if (direction === 'left') {
          snakeElement.style.borderTop = '4px solid #414141'
          snakeElement.style.borderBottom = '9px solid #414141'
          snakeElement.style.borderLeft = '9px solid #414141'
          snakeElement.style.borderRight = '4px solid #414141'
        }
        if (direction === 'right') {
          snakeElement.style.borderTop = '4px solid #414141'
          snakeElement.style.borderBottom = '9px solid #414141'
          snakeElement.style.borderLeft = '4px solid #414141'
          snakeElement.style.borderRight = '9px solid #414141'
        }
        snakeElement.style.borderRadius = '3px'
      }
      board.appendChild(snakeElement)
    })
  }
}

// It's gonna draw the snake and food
function draw() {
  board.innerHTML = ''
  drawSnake()
  drawFood()
  updateScore()
}

// Moving the snake
function move() {
  const head = { ...snake[0] }
  switch (direction) {
    case 'up':
      head.y--
      break
    case 'down':
      head.y++
      break
    case 'left':
      head.x--
      break
    case 'right':
      head.x++
      break
  }

  if (gameStarted === 'paused') {
    pauseGame()
  } else {
    instructionText.style.display = 'none'
    snake.unshift(head)

    if (head.x === food.x && head.y === food.y) {
      food = generateFood()
      increaseSpeed()
      clearInterval(gameInterval) // Clear past interval
      gameInterval = setInterval(() => {
        move()
        checkCollision()
        draw()
      }, gameSpeedDelay)
    } else {
      snake.pop()
    }
  }
}

function startGame() {
  gameStarted = 'true'
  instructionText.style.display = 'none'
  logo.style.display = 'none'
  gameInterval = setInterval(() => {
    move()
    checkCollision()
    draw()
  }, gameSpeedDelay)
}

// keypress event llistener
function handleKeyPress(event) {
  if (
    (!gameStarted && event.code === 'Space') ||
    (!gameStarted && event.key === ' ')
  ) {
    startGame()
  }
  if (
    (!gameStarted && event.code === 'KeyS' && !settingsOpen) ||
    (!gameStarted && event.key === 'KeyS' && !settingsOpen)
  ) {
    openSettings()
    settingsOpen = true
  } else if (
    (!gameStarted && event.code === 'KeyS' && settingsOpen) ||
    (!gameStarted && event.key === 'KeyS' && settingsOpen)
  ) {
    closeSettings()
    settingsOpen = false
  } else if (
    (gameStarted === 'true' && event.code === 'Enter') ||
    (gameStarted === 'true' && event.key === 'Enter')
  ) {
    prevDirection = direction
    direction = ''
    gameStarted = 'paused'
  } else if (
    (gameStarted === 'paused' && event.code === 'Enter') ||
    (gameStarted === 'paused' && event.key === 'Enter')
  ) {
    direction = prevDirection
    gameStarted = 'true'
  } else {
    switch (event.key) {
      case 'ArrowUp':
        direction = 'up'
        break
      case 'ArrowDown':
        direction = 'down'
        break
      case 'ArrowLeft':
        direction = 'left'
        break
      case 'ArrowRight':
        direction = 'right'
        break
    }
  }
}

document.addEventListener('keydown', handleKeyPress)

function increaseSpeed() {
  if (gameSpeedDelay > 150) {
    gameSpeedDelay -= 5
  } else if (gameSpeedDelay > 100) {
    gameSpeedDelay -= 3
  } else if (gameSpeedDelay > 50) {
    gameSpeedDelay -= 2
  } else if (gameSpeedDelay > 25) {
    gameSpeedDelay -= 1
  }
}

function checkCollision() {
  const head = snake[0]
  const neck = snake[1]

  if (head.x < 1 || head.x > gridSize || head.y < 1 || head.y > gridSize) {
    resetGame()
  }

  for (let i = 1; i < snake.length; i++) {
    if (head.x === snake[i].x && head.y === snake[i].y) {
      resetGame()
    }
  }
}

function resetGame() {
  updateHighScore()
  stopGame()
  snake = [{ x: 10, y: 10 }]
  food = generateFood()
  direction = ''
  gameSpeedDelay = 200
  updateScore()
}

function updateHighScore() {
  const currentScore = snake.length - 1
  if (highScore.textContent < currentScore) {
    highScore.style.display = 'block'
    highScore.textContent = currentScore.toString().padStart(3, '0')
  }
}

function updateScore() {
  const currentScore = snake.length - 1
  score.textContent = currentScore.toString().padStart(3, '0')
}

function stopGame() {
  clearInterval(gameInterval)
  gameStarted = false
  instructionText.style.display = 'flex'
  instructionText.style.height = '100%'
  instructionText.innerHTML = `<h1>GAME OVER!</h1><h1>Press Spacebar to Restart</h1>`
}

function pauseGame() {
  instructionText.style.display = 'flex'
  instructionText.style.height = '100%'
  instructionText.style.backgroundColor = 'rgba(197, 207, 166, 0.7)'
  instructionText.innerHTML = `<h1>||</h1><h1>Game Paused</h1>`
}

function openSettings() {
  settingsPage.style.display = 'grid'
}

function closeSettings() {
  settingsPage.style.display = 'none'
}

lvlBtn.forEach((button, i) => {
  button.addEventListener('click', () => {
    lvlBtn.forEach((btn) => {
      btn.id = ''
    })
    button.id = 'active'
    toggleDifficulty(button, i)
  })
})

function toggleDifficulty(button, i) {
  if (button.id === 'active' && i === 0) {
    gameSpeedDelay = 250
  } else if (button.id === 'active' && i === 1) {
    gameSpeedDelay = 200
  } else if (button.id === 'active' && i === 2) {
    gameSpeedDelay = 150
  }
}
