const displayEquation = document.querySelector('.display-equation')
const displayPreview = document.querySelector('.display-preview')
const numberBtn = document.querySelectorAll('.number-btn')
const operationBtn = document.querySelectorAll('.operation-btn')
const historyDisplay = document.querySelector('.history')
const clearBtn = document.querySelector('#clear')
const equalsBtn = document.querySelector('#equals')
const deleteBtn = document.querySelector('#delete')
const bracketBtn = document.querySelector('#bracket')
const historyBtn = document.querySelector('#history')
const historyClearBtn = document.querySelector('#clear-history')
const negativeBtn = document.querySelector('#negative')
const ulEl = document.querySelector('ul')
const equationsFromLocalStorage = JSON.parse(
  localStorage.getItem('prevEquations')
)

let prevEquations = []
if (equationsFromLocalStorage) {
  prevEquations = equationsFromLocalStorage
}

//  FUNCTIONS

function clearAll(e) {
  e.textContent = ''
}

function deleteChar() {
  displayEquation.textContent = displayEquation.textContent.slice(0, -1)
}

function appendChar(char) {
  displayEquation.textContent += char.textContent
}

function resultValidator(operation) {
  if (
    displayEquation.textContent.endsWith(0) &&
    displayEquation.textContent[displayEquation.textContent.length - 2] ===
      operation
  ) {
    deleteChar()
  }
}

function numFormatValidator(num) {
  if (displayEquation.textContent.endsWith(0) && num.textContent === '.')
    displayEquation.textContent += ''
  else if (displayEquation.textContent === '0' && num.textContent)
    displayEquation.textContent = ''
  else {
    resultValidator('/')
    resultValidator('*')
    resultValidator('-')
    resultValidator('+')
  }
}

function compute(e) {
  let expression = displayEquation.textContent
    .replace(/÷/g, '/')
    .replace(/×/g, '*')
    .replace(/%/g, '/100')
  e.textContent = Number(eval(expression).toFixed(10))
}

function placeBracket() {
  if (displayEquation.textContent === '') displayEquation.textContent += '('
  else if (
    displayEquation.textContent.lastIndexOf('(') > -1 &&
    displayEquation.textContent[displayEquation.textContent.length - 1] === '%'
  ) {
    displayEquation.textContent += ')'
    try {
      compute(displayPreview)
    } catch (error) {
      displayPreview.textContent = ''
    }
  } else if (
    displayEquation.textContent.lastIndexOf('(') > -1 &&
    displayEquation.textContent[displayEquation.textContent.length - 1] - 1
  ) {
    displayEquation.textContent += ')'
    try {
      compute(displayPreview)
    } catch (error) {
      displayPreview.textContent = ''
    }
  } else if (
    displayEquation.textContent[displayEquation.textContent.length - 1].match(
      /\d/
    ) ||
    displayEquation.textContent[displayEquation.textContent.length - 1] === ')'
  ) {
    displayEquation.textContent += '×('
  } else displayEquation.textContent += '('
}

//  EVENT LISTENERS

clearBtn.addEventListener('click', function () {
  clearAll(displayEquation)
  clearAll(displayPreview)
})

deleteBtn.addEventListener('click', function () {
  deleteChar()
  if (
    isNaN(
      displayEquation.textContent[displayEquation.textContent.length - 1] / 1
    )
  )
    displayPreview.textContent = ''

  if (displayEquation.textContent === '') displayPreview.textContent = ''
  else {
    try {
      compute(displayPreview)
    } catch (error) {
      displayPreview.textContent = ''
    }
  }
})

equalsBtn.addEventListener('click', function () {
  if (displayPreview.textContent !== '') {
    prevEquations.push({
      expression: displayEquation.textContent,
      result: displayPreview.textContent,
    })
    localStorage.setItem('prevEquations', JSON.stringify(prevEquations))

    try {
      compute(displayEquation)
    } catch (error) {
      displayEquation.textContent = 'Syntax Error'
    }
  }

  clearAll(displayPreview)
})

operationBtn.forEach((button) => {
  button.addEventListener('click', function () {
    switch (
      displayEquation.textContent.charAt(displayEquation.textContent.length - 1)
    ) {
      case '÷':
        deleteChar()
        break
      case '×':
        deleteChar()
        break
      case '+':
        deleteChar()
        break
      case '-':
        deleteChar()
        break
      case '%':
        deleteChar()
        break
    }

    if (
      displayEquation.textContent !== '' &&
      displayEquation.textContent[displayEquation.textContent.length - 1].match(
        /\d/
      )
    ) {
      appendChar(button)
      displayPreview.textContent = ''
      if (button.textContent === '%') {
        try {
          compute(displayPreview)
        } catch (e) {
          displayPreview.textContent = ''
        }
      }
    } else if (
      displayEquation.textContent !== '' &&
      displayEquation.textContent[displayEquation.textContent.length - 1] ===
        ')'
    ) {
      appendChar(button)
      displayPreview.textContent = ''
      if (button.textContent === '%') {
        try {
          compute(displayPreview)
        } catch (e) {
          displayPreview.textContent = ''
        }
      }
    }
  })
})

numberBtn.forEach((button) => {
  button.addEventListener('click', function () {
    numFormatValidator(button)
    appendChar(button)
    try {
      compute(displayPreview)
    } catch (error) {
      displayPreview.textContent = ''
    }
  })
})

bracketBtn.addEventListener('click', function () {
  if (displayEquation.textContent === '0' && this.textContent)
    displayEquation.textContent = ''
  placeBracket()
})

negativeBtn.addEventListener('click', function () {
  placeBracket()
  displayEquation.textContent += '-'
})

//  History Stuff

historyDisplay.setAttribute('data-state', 'hidden')
historyClearBtn.addEventListener('click', function () {
  localStorage.clear()
  prevEquations = []
  ulEl.innerHTML = ''
})

historyBtn.addEventListener('click', function () {
  if (historyDisplay.getAttribute('data-state') === 'visible') {
    historyDisplay.setAttribute('data-state', 'hidden')
  } else {
    historyDisplay.setAttribute('data-state', 'visible')
    renderEquation(prevEquations)
  }
})

function listItem(e) {
  if (e.textContent.trim()[0] === '=') {
    displayEquation.textContent += e.textContent.trim().slice(1)
  } else {
    displayEquation.textContent += e.textContent.trim()
  }
  compute(displayPreview)
}

function renderEquation(equation) {
  let prevEquationsList = ''
  for (let i = 0; i < equation.length; i++) {
    prevEquationsList += `
            <li onclick="listItem(this)">
              ${equation[i].expression}
            </li>
            <li onclick="listItem(this)">
              =${equation[i].result}
            </li>
            <hr>
        `
  }
  ulEl.innerHTML = prevEquationsList
}

// .toLocaleString('en',{ maximumFractionDigits: 0 })

// let z = /\d{15}/g
// let num = '234566789876544+385744372387564'

// if (num.match(z)) {
//   console.log('no more 15')
// }
// console.log(num.match(z))
