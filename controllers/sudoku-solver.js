class SudokuSolver {

  validate(puzzleString) {
    if (puzzleString.length != 81) {
      return 'Expected puzzle to be 81 characters long'
    }
    if (/[^\.|^0-9]/.test(puzzleString)) {
      return 'Invalid characters in puzzle'
    }
    return true
  }

  formatPuzzle(puzzleString) {
    let final = []
    for (let i = 0; i < 9; i++) {
      final.push(puzzleString.slice(0, 9))
      puzzleString = puzzleString.substr(9)
    }
    return final
      .map(row => row.split("")
        .map(num => num == '.' ? 0 : parseInt(num))
      )
  }

  checkRowPlacement(puzzleArray, row, column, value) {
    for (let i = 0; i < 9; i++) {
      if (puzzleArray[row][i] == value && column != i) {
        return false
      }
    }
    return true
  }

  checkColPlacement(puzzleArray, row, column, value) {
    for (let i = 0; i < 9; i++) {
      if (puzzleArray[i][column] == value && row != i) {
        return false
      }
    }
    return true
  }

  checkRegionPlacement(puzzleArray, row, column, value) {
    let box_x = Math.trunc(column/3)
    let box_y = Math.trunc(row/3)

    for (let i = box_y * 3; i < box_y * 3 + 3; i++) {
      for (let j = box_x * 3; j < box_x * 3 + 3; j++) {
        if (puzzleArray[i][j] == value && i != row && j != column) {
          return false
        }
      }
    }
    return true
  }

  findZeros(puzzleArray) {
    for (let i = 0; i < 9; i++) {
      for (let j = 0; j < 9; j++) {
        if (puzzleArray[i][j] == 0) {
          return [i, j]
        }
      }
    }
    return [] //no more spaces to fill
  }

  solve(puzzleString) {
    let puzzleArray = this.formatPuzzle(puzzleString)
    this.fillSudoku(puzzleArray)
    return puzzleArray.flat().join('')
  }

  fillSudoku(puzzleArray) {
    let zerosCrd = this.findZeros(puzzleArray)

    let row = 0
    let col = 0
    if (!zerosCrd.length) {
      return true
    } else {
      row = zerosCrd[0]
      col = zerosCrd[1]
    }

    for (let i = 1; i < 10; i++) {
      if (
        this.checkRowPlacement(puzzleArray, row, col, i) &&
        this.checkColPlacement(puzzleArray, row, col, i) &&
        this.checkRegionPlacement(puzzleArray, row, col, i)
      ) {
        puzzleArray[row][col] = i

        if (this.fillSudoku(puzzleArray)) {
          return true
        }
        puzzleArray[row][col] = 0
      }
    }
    return false
  }
}
module.exports = SudokuSolver;