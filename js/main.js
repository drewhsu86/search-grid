
// pathfinding on a grid
// 1. create a grid
// 2. create data structure (array of objects?)
// 3. create way to assign start, stop and solid blocks
// 4. create way to start with starting block
//    then iterate through other blocks
//    and then either find ending block or fail and stop
// 5. visually show result of algorithm

// DOM bindings
const mainGrid = document.getElementById('mainGrid')
const gridWidth = document.getElementById('gridWidth')
const gridHeight = document.getElementById('gridHeight')
const createGridButton = document.getElementById('createGrid')

// variables for data
let boxes = [] // will be reassigned to hold all boxes
let boxObjs = [] // will hold box objects with calculation data
// multiple modes
// wall, start, stop, run
let mode = 'wall'
let start = null
let stop = null
let hoverColor = 'lightblue'


// event listener

createGridButton.addEventListener("click", () => {
  if (takeGridDim()) {
    createGridElem()
    bindGridBoxes()
  }
})


// process and possibly correct input
function takeGridDim() {
  console.log('takeGridDim')
  let changesNeeded = false

  for (inputBox of [gridWidth, gridHeight]) {

    // console.log(inputBox.value)
    let num = parseInt(inputBox.value)
    console.log('Parsed value: ' + num)
    inputBox.value = num
    if (typeof num !== 'number') {
      inputBox.value = 10
      changesNeeded = true
    } else if (num % 1 !== 0) {
      inputBox.value = Math.floor(inputBox.value)
      changesNeeded = true
    } else if (num > 30) {
      inputBox.value = 30
      changesNeeded = true
    } else if (num < 1) {
      inputBox.value = 1
      changesNeeded = true
    }
    // end of for loop over both width and height grid inputs
  }

  if (changesNeeded) {
    createGridButton.innerHTML = 'Please correct values and resubmit'
    return false
  } else {
    return true
  }


}


// function create grid elements, as tr, and td in the table
function createGridElem() {

  const x = parseInt(gridWidth.value)
  const y = parseInt(gridHeight.value)

  let gridHTML = ''

  // x is the number of td's in a tr
  // y is the number of tr's

  for (let iy = 1; iy <= y; iy++) {

    gridHTML += '<tr>'
    for (let ix = 1; ix <= x; ix++) {
      // make some variables to help identify the
      // grid boxes later using data-key
      let dataKey = `box-${ix}-${iy}` // x then y

      gridHTML += `<td class="boxOfGrid" data-key="${dataKey}">`

      gridHTML += '</td>'
    }
    gridHTML += '</tr>'
  }

  mainGrid.innerHTML = gridHTML
}

// function to bind functionality to each .boxOfGrid
// by using getElementsByClassName
function bindGridBoxes() {
  boxes = document.getElementsByClassName('boxOfGrid')
  // console.log(boxes)

  for (let i = 0; i < boxes.length; i++) {
    // console.log(i)

    // parse the datakey
    let [n, x, y] = boxes[i].dataset.key.split('-')
    x = parseInt(x)
    y = parseInt(y)

    // create an object for each box and add it to boxObjs
    boxObjs.push(new BoxObj(x, y, i))

    // store a second data called index
    boxes[i].setAttribute('data-index', i)

    // add event listeners to each box
    boxes[i].addEventListener("mouseover", () => {
      boxes[i].style.backgroundColor = hoverColor

    })
    boxes[i].addEventListener("mouseout", () => {
      boxes[i].style.backgroundColor = null

    })

    boxes[i].addEventListener("click", () => {
      console.log(boxes[i].dataset.key)

      switch (mode) {
        case 'wall':
          // if mode is wall, either add or remove a wall
          // reflect change in both element and object array
          break
      }
    })
  } // for loop over each box of grid
  // console.log(boxObjs)
}

// constructor for box objects
const BoxObj = function (x, y, i) {
  this.i = i
  this.x = x
  this.y = y
  this.state = 'empty'  // 'empty', 'wall', 'start', 'stop'
}

