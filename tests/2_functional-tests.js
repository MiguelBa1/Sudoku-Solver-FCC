const chai = require("chai");
const chaiHttp = require('chai-http');
const assert = chai.assert;
const server = require('../server');

chai.use(chaiHttp);

suite('Functional Tests', () => {
    let puzzleString = "1.5..2.84..63.12.7.2..5.....9..1....8.2.3674.3.7.2..9.47...8..1..16....926914.37."
    let solutionString = "135762984946381257728459613694517832812936745357824196473298561581673429269145378"
    let invalidString = 'abc..2.84..63.12.7.2..5.....9..1....8.2.3674.3.7.2..9.47...8..1..16....926914.37.'
    let invalidLength = "1.5..2.84..63.12.7.2..5.....9..1....8.2.3674.3.7.2..9.47...8..1..16....926914.3"
    let invalidPuzzle = "1.55.2.84..63.12.7.2..5.....9..1....8.2.3674.3.7.2..9.47...8..1..16....926914.37."
    suite('Solve test', function () {
        test('Solve a puzzle with valid puzzle string: POST request to /api/solve', function () {
            chai
                .request(server)
                .post('/api/solve')
                .send({
                    puzzle: puzzleString
                })
                .end(function (err, res) {
                    assert.equal(res.status, 200);
                    assert.equal(res.body.solution, solutionString);
                })
        })
        test('Solve a puzzle with missing puzzle string: POST request to /api/solve', function () {
            chai
                .request(server)
                .post('/api/solve')
                .send({})
                .end(function (err, res) {
                    assert.equal(res.status, 200);
                    assert.equal(res.body.error, 'Required field missing');
                })
        })
        test('Solve a puzzle with invalid characters: POST request to /api/solve', function () {
            chai
                .request(server)
                .post('/api/solve')
                .send({
                    puzzle: invalidString 
                })
                .end(function (err, res) {
                    assert.equal(res.status, 200);
                    assert.equal(res.body.error, 'Invalid characters in puzzle');
                })
        })
        test('Solve a puzzle with incorrect length: POST request to /api/solve', function () {
            chai
                .request(server)
                .post('/api/solve')
                .send({
                    puzzle: invalidLength 
                })
                .end(function (err, res) {
                    assert.equal(res.status, 200);
                    assert.equal(res.body.error, 'Expected puzzle to be 81 characters long');
                })
        })
        test('Solve a puzzle that cannot be solved: POST request to /api/solve', function () {
            chai
                .request(server)
                .post('/api/solve')
                .send({
                    puzzle: invalidPuzzle 
                })
                .end(function (err, res) {
                    assert.equal(res.status, 200);
                    assert.equal(res.body.error, 'Puzzle cannot be solved');
                })
        })
    });
    suite("Check test", function () {
        test('Check a puzzle placement with all fields: POST request to /api/check', function () {
            chai
                .request(server)
                .post('/api/check')
                .send({
                    puzzle: puzzleString,
                    coordinate: 'A2',
                    value: '3' 
                })
                .end(function (err, res) {
                    assert.equal(res.status, 200);
                    assert.isTrue(res.body.valid);
                })
        })
        test('Check a puzzle placement with single placement conflict: POST request to /api/check', function () {
            chai
                .request(server)
                .post('/api/check')
                .send({
                    puzzle: puzzleString,
                    coordinate: 'A2',
                    value: '7' 
                })
                .end(function (err, res) {
                    assert.equal(res.status, 200);
                    assert.deepEqual(res.body, { "valid": false, "conflict": [ "column" ] });
                })
        })
        test('Check a puzzle placement with multiple placement conflicts: POST request to /api/check', function () {
            chai
                .request(server)
                .post('/api/check')
                .send({
                    puzzle: puzzleString,
                    coordinate: 'A2',
                    value: '6' 
                })
                .end(function (err, res) {
                    assert.equal(res.status, 200);
                    assert.deepEqual(res.body, { "valid": false, "conflict": [ "column", "region" ] });
                })
        })
        test('Check a puzzle placement with all placement conflicts: POST request to /api/check', function () {
            chai
                .request(server)
                .post('/api/check')
                .send({
                    puzzle: puzzleString,
                    coordinate: 'B2',
                    value: '6' 
                })
                .end(function (err, res) {
                    assert.equal(res.status, 200);
                    assert.deepEqual(res.body, { "valid": false, "conflict": [ "row", "column", "region" ] });
                })
        })
        test('Check a puzzle placement with missing required fields: POST request to /api/check', function () {
            chai
                .request(server)
                .post('/api/check')
                .send({
                    puzzle: puzzleString,
                })
                .end(function (err, res) {
                    assert.equal(res.status, 200);
                    assert.equal(res.body.error, 'Required field(s) missing');
                })
        })
        test('Check a puzzle placement with invalid characters: POST request to /api/check', function () {
            chai
                .request(server)
                .post('/api/check')
                .send({
                    puzzle: invalidString, 
                    coordinate: 'B2',
                    value: '6' 
                })
                .end(function (err, res) {
                    assert.equal(res.status, 200);
                    assert.equal(res.body.error, 'Invalid characters in puzzle');
                })
        })
        test('Check a puzzle placement with incorrect length: POST request to /api/check', function () {
            chai
                .request(server)
                .post('/api/check')
                .send({
                    puzzle: invalidLength, 
                    coordinate: 'B2',
                    value: '6' 
                })
                .end(function (err, res) {
                    assert.equal(res.status, 200);
                    assert.equal(res.body.error, 'Expected puzzle to be 81 characters long');
                })
        })
        test('Check a puzzle placement with invalid placement coordinate: POST request to /api/check', function () {
            chai
                .request(server)
                .post('/api/check')
                .send({
                    puzzle: puzzleString, 
                    coordinate: 'Z2',
                    value: '6' 
                })
                .end(function (err, res) {
                    assert.equal(res.status, 200);
                    assert.equal(res.body.error, 'Invalid coordinate');
                })
        })
        test('Check a puzzle placement with invalid placement value: POST request to /api/check', function () {
            chai
                .request(server)
                .post('/api/check')
                .send({
                    puzzle: puzzleString, 
                    coordinate: 'B2',
                    value: '36' 
                })
                .end(function (err, res) {
                    assert.equal(res.status, 200);
                    assert.equal(res.body.error, 'Invalid value');
                })
        })

    })
});

