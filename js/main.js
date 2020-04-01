
window.onload = () => {
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
  const modeButton = document.getElementById('mode')
  const runSearchButton = document.getElementById('runSearch')
  const clearButton = document.getElementById('clearMsg')
  const systemMsg = document.getElementById('systemMsg')


  // variables for data
  let boxes = [] // will be reassigned to hold all boxes
  let boxObjs = [] // will hold box objects with calculation data
  // multiple modes
  // wall, start, stop, run
  let mode = 'wall'
  let start = null
  let stop = null
  let gridWidthNum = 0;
  let gridHeightNum = 0;
  const maxDim = 20
  const hoverColor = 'lightblue'
  const wallColor = 'blue'
  const startColor = 'green'
  const stopColor = 'red'
  const searchedColor = 'lightyellow'
  const pathColor = 'maroon'




  // event listener

  createGridButton.addEventListener("click", () => {
    if (takeGridDim()) {
      resetGrid()
      createGridElem()
      bindGridBoxes()
    }
  })

  modeButton.addEventListener("click", () => {
    switch (mode) {
      case 'wall':
        mode = 'start'
        modeButton.innerText = 'Mode = Start'
        break
      case 'start':
        mode = 'stop'
        modeButton.innerText = 'Mode = Stop'
        break
      case 'stop':
        mode = 'wall'
        modeButton.innerText = 'Mode = Walls'
        break
      default:
        console.log('Mode button pressed, but mode is ' + mode)
    }
  })

  runSearchButton.addEventListener("click", () => {
    runSearch()
  })

  clearButton.addEventListener("click", () => {
    clearMsg()
  })




  // process and possibly correct input
  function takeGridDim() {
    // console.log('takeGridDim')
    let changesNeeded = false

    for (inputBox of [gridWidth, gridHeight]) {

      // console.log(inputBox.value)
      let num = parseInt(inputBox.value)
      // console.log('Parsed value: ' + num)
      inputBox.value = num
      if (typeof num !== 'number') {
        inputBox.value = 10
        changesNeeded = true
      } else if (num % 1 !== 0) {
        inputBox.value = Math.floor(inputBox.value)
        changesNeeded = true
      } else if (num > maxDim) {
        inputBox.value = maxDim
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
      createGridButton.innerHTML = 'Create Grid'
      return true
    }


  }


  // function create grid elements, as tr, and td in the table
  function createGridElem() {

    const x = parseInt(gridWidth.value)
    const y = parseInt(gridHeight.value)

    gridWidthNum = x
    gridHeightNum = y

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
        if (boxObjs[i].state === 'empty' &&
          !boxes[i].style.backgroundColor) {
          boxes[i].style.backgroundColor = hoverColor
        }

      })
      boxes[i].addEventListener("mouseout", () => {

        if (boxes[i].style.backgroundColor === hoverColor) {
          boxes[i].style.backgroundColor = null
        }

      })

      boxes[i].addEventListener("click", () => {
        // console.log(boxes[i].dataset.key)
        let thisBox = boxObjs[i]
        switch (mode) {
          case 'wall':
            // if mode is wall, either add or remove a wall
            // reflect change in both element and object array


            if (thisBox.state === 'empty') {
              thisBox.state = 'wall'
              boxes[i].style.backgroundColor = wallColor
            } else if (thisBox.state === 'wall') {
              thisBox.state = 'empty'
              boxes[i].style.backgroundColor = null;
            }
            break
          case 'start':
            // if mode is start, either add or remove a start
            // reflect change in both element and object array
            // but only add if no start available

            if (thisBox.state === 'empty' && start === null) {
              thisBox.state = 'start'
              boxes[i].style.backgroundColor = startColor
              start = thisBox
            } else if (thisBox.state === 'start') {
              thisBox.state = 'empty'
              boxes[i].style.backgroundColor = null;
              start = null
            }
            break
          case 'stop':
            // if mode is wall, either add or remove a wall
            // reflect change in both element and object array

            if (thisBox.state === 'empty' && stop === null) {
              thisBox.state = 'stop'
              boxes[i].style.backgroundColor = stopColor
              stop = thisBox
            } else if (thisBox.state === 'stop') {
              thisBox.state = 'empty'
              boxes[i].style.backgroundColor = null;
              stop = null
            }
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
    this.addBGColor = function (newColor) {
      boxes[this.i].style.backgroundColor = newColor
    }
  }

  // if the button is hit, reset the grid before doing everything 
  function resetGrid() {
    // variables for data
    boxes = [] // will be reassigned to hold all boxes
    boxObjs = [] // will hold box objects with calculation data
    // multiple modes
    // wall, start, stop, run
    mode = 'wall'
    start = null
    stop = null
    gridWidthNum = 0;
    gridHeightNum = 0;
  }

  // function runSearch which will start the algorithm
  // called by a particular function written outside
  function runSearch() {
    // check if search is feasible
    // start and stop need to be not null
    if (start === null || stop === null) {
      console.log('either no start or stop')
      printToMsg('Either stop or start not assigned.')
    } else {
      console.log('run search ready')
      printToMsg('Ready to run search.')
      depthFirstSearch(start)
    }




  }

  // function to print to the system message box, systemMsg
  function printToMsg(str) {
    systemMsg.innerHTML += ('>' + str + '<br>')
  }

  // function to clear system message box
  function clearMsg() {
    systemMsg.innerHTML = '> System messages cleared. <br>'
  }

  // assume that the array was made in the same order as the boxes
  // going left to right then up to down
  // (not sure this was the case when data structure was designed)
  // can convert x,y to i and vice versa
  function conv2to1(x, y) {
    return (gridWidthNum * (y - 1)) + x - 1
  }

  function conv1to2(i) {
    let x = (i + 1) % gridWidthNum
    let y = Math.floor((i + 1) / gridWidthNum) + 1
    return [x, y]
  }


  // depth first search algorithm
  // put starting node into a stack
  // while the stack is not empty
  // take the top node, add all branch nodes to the stack
  // (also do not add if already visited)
  // then remove the top node (branch nodes saved to temp then added)
  // also, paint visited nodes
  // also, make a data structure that saves the path
  // when the stop is on the top of the stack, add it to the path then end
  // paint visited paths a light orange
  // paint chosen path a maroon (darkish desaturated color)

  function depthFirstSearch(start) {

    // store visited on a new array
    let visited = new Array(gridWidthNum * gridHeightNum)
    let finalPath = [] // will hold the path when goal is reached
    // console.log(start.i)
    // console.log(visited[start.i])

    // assume stop and start are not null 
    let stack = [
      {
        node: start,
        path: [start.i]
      }
    ]
    visited[start.i] = true

    // we treat the front (index = 0) as the top of stack
    while (stack.length > 0) {

      // we must determine what the neighbors are
      // we will only check one step in 4 cardinal directions
      // and obviously not below 0 or above gridWidthNßum-1 or gridHeightNum-1
      // we can convert i into x and y or grab x or y from the object
      // then do math on x and y 
      let currItem = stack.shift()
      let currNode = currItem.node
      let currPath = currItem.path
      console.log('currPath: ')
      console.log(currPath)

      let x = currNode.x
      let y = currNode.y

      // if we reach the stop or goal, we return or break this loop
      if (currNode.i === stop.i) {
        let ii = conv2to1(x, y)
        finalPath = currPath
        boxObjs[ii].addBGColor(stopColor)
        visited[ii] = true
        console.log('stop reached')
        break
      }

      // we will use the 2 to 1 converter to grab the objects corresponding to x and y using i

      // will use ternaries to filter out if out of bounds
      for (let xx = (x - 1 > 0 ? x - 1 : x); xx <= (x + 1 <= gridWidthNum ? x + 1 : x); xx++) {

        console.log('xx: ' + xx + ', y: ' + y)
        let ind = conv2to1(xx, y)
        console.log('x search: ' + ind)
        if (ind !== currNode.i && !visited[ind] && boxObjs[ind].state !== 'wall') {
          let newPath = currPath.slice()
          newPath.push(ind)
          newItem = {
            node: boxObjs[ind],
            path: newPath
          }
          stack.unshift(newItem)
          boxObjs[ind].addBGColor(searchedColor)
          visited[ind] = true
          console.log('new path added')
        }

      } // end of for loop checking neighbors x

      for (let yy = (y - 1 > 0 ? y - 1 : y); yy <= (y + 1 <= gridHeightNum ? y + 1 : y); yy++) {

        console.log('x: ' + x + ', yy: ' + yy)
        let ind = conv2to1(x, yy)
        console.log('y search: ' + ind)


        if (ind !== currNode.i && !visited[ind] && boxObjs[ind].state !== 'wall') {
          let newPath = currPath.slice()
          newPath.push(ind)
          newItem = {
            node: boxObjs[ind],
            path: newPath
          }
          stack.unshift(newItem)
          boxObjs[ind].addBGColor(searchedColor)
          visited[ind] = true
          console.log('new path added')
        }

      } // end of for loop checking neighbors y

      console.log('stack still has: ' + stack.length)

    } // end of while loop going through stack

    // try to color the path from start to finish (not optimal)
    // i want to exclude the first and last to save their color

    for (let nodeIndex = 1; nodeIndex < finalPath.length - 1; nodeIndex++) {
      // using boxObjs[nodeIndex].addBGColor
      boxObjs[finalPath[nodeIndex]].addBGColor(pathColor)
    }

  }







}// end of window.onload


