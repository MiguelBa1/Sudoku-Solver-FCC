'use strict';

const SudokuSolver = require('../controllers/sudoku-solver.js');

module.exports = function (app) {
  
  let solver = new SudokuSolver();

  app.route('/api/check')
    .post((req, res) => {
      if (
        !req.body.hasOwnProperty('puzzle') ||
        !req.body.hasOwnProperty('coordinate') ||
        !req.body.hasOwnProperty('value')
      ){
        res.json({error: 'Required field(s) missing'})
        return
      }
      let {puzzle, coordinate, value} = req.body
      let validateMsg = solver.validate(puzzle)
      if (validateMsg != true) { // puzzleString is invalid
        res.json({error: validateMsg})
        return
      }
      if (!coordinate.match(/(^[a-i][1-9]$)/i)){ // coordinate is invalid
        res.json({error: 'Invalid coordinate'})
        return
      }
      if (!value.match(/(^[1-9]$)/i)){ // value is invalid
        res.json({error: 'Invalid value'})
        return
      }
      let defs = 'abcdefghi'.split('')
      let row  = defs.indexOf(coordinate[0].toLowerCase())
      let column = coordinate[1] - 1
      let valid = true
      let conflict = []
      let puzzleArray = solver.formatPuzzle(puzzle)
      if (!solver.checkRowPlacement(puzzleArray, row, column, value)) {
        valid = false
        conflict.push('row')
      }
      if (!solver.checkColPlacement(puzzleArray, row, column, value)) {
        valid = false
        conflict.push('column')
      }
      if (!solver.checkRegionPlacement(puzzleArray, row, column, value)) {
        valid = false
        conflict.push('region')
      }
      if (valid) res.json({valid})
      if (!valid) res.json({valid, conflict})
    });
    
  app.route('/api/solve')
    .post((req, res) => {
      if (!req.body.hasOwnProperty('puzzle')){
        res.json({error: 'Required field missing'})
        return
      }
      let puzzleString = req.body.puzzle
      let validateMsg = solver.validate(puzzleString)
      if (validateMsg == true) { //puzzleString is valid
        let solution = solver.solve(puzzleString)
        if (solution == req.body.puzzle) {
          res.json({error: 'Puzzle cannot be solved' })
          return
        }
        res.json({solution})
      } else {
        res.json({error: validateMsg})
      }
    });
};
