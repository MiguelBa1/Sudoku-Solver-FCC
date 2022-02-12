const chai = require('chai');
const assert = chai.assert;

const Solver = require('../controllers/sudoku-solver.js');
let solver = new Solver();

suite('UnitTests', () => {
    let puzzleArray = solver.formatPuzzle("1.5..2.84..63.12.7.2..5.....9..1....8.2.3674.3.7.2..9.47...8..1..16....926914.37.")
    let invalidArray = solver.formatPuzzle("1.55.2.84..63.12.7.2..5.....9..1....8.2.3674.3.7.2..9.47...8..1..16....926914.37.")
    test('Logic handles a valid puzzle string of 81 characters', function() {
        assert.isTrue(solver.validate('1.5..2.84..63.12.7.2..5.....9..1....8.2.3674.3.7.2..9.47...8..1..16....926914.37.'))
    })
    test('Logic handles a puzzle string with invalid characters (not 1-9 or .)', function() {
        assert.equal('Invalid characters in puzzle', solver.validate('abc..2.84..63.12.7.2..5.....9..1....8.2.3674.3.7.2..9.47...8..1..16....926914.37.'))
    })
    test('Logic handles a puzzle string that is not 81 characters in length', function() {
        assert.equal('Expected puzzle to be 81 characters long', solver.validate('1.5..2.84..63.12.7.2..5.....9..1....8.2.3674.3.7.2..9.47...8..1..16....926914.'))
    })
    test('Logic handles a valid row placement', function() {
        assert.isTrue(solver.checkRowPlacement(puzzleArray, 0, 1, 3))
    })
    test('Logic handles an invalid row placement', function() {
        assert.isFalse(solver.checkRowPlacement(puzzleArray, 0, 1, 2))
    })
    test('Logic handles a valid column placement', function() {
        assert.isTrue(solver.checkColPlacement(puzzleArray, 0, 1, 3))
    })
    test('Logic handles an invalid column placement', function() {
        assert.isFalse(solver.checkColPlacement(puzzleArray, 0, 1, 2))
    })
    test('Logic handles a valid region (3x3 grid) placement', function() {
        assert.isTrue(solver.checkRegionPlacement(puzzleArray, 0, 1, 3))
    })
    test('Logic handles a invalid region (3x3 grid) placement', function() {
        assert.isFalse(solver.checkRegionPlacement(puzzleArray, 0, 1, 2))
    })
    test('Valid puzzle strings pass the solver', function() {
        assert.isTrue(solver.fillSudoku(puzzleArray))
    })
    test('Invalid puzzle strings fail the solver', function() {
        assert.isFalse(solver.fillSudoku(invalidArray))
    })
    test('Solver returns the expected solution for an incomplete puzzle', function() {
        assert.equal(
            '135762984946381257728459613694517832812936745357824196473298561581673429269145378',
            solver.solve('1.5..2.84..63.12.7.2..5.....9..1....8.2.3674.3.7.2..9.47...8..1..16....926914.37.')
            )
    })
});
