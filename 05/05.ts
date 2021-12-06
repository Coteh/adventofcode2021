import { processDataFromStdin, toStringArray } from "../util/file_util";

const toLinePairs = (buffer: Buffer) => toStringArray(buffer).map(line => line.split(" -> ").map(coordStr => coordStr.split(",").map(val => parseInt(val)) as [number, number]));

const isHorizontal = (linePair: [number, number][]) => linePair[0][1] === linePair[1][1];

const isVertical = (linePair: [number, number][]) => linePair[0][0] === linePair[1][0];

const initGrid = (linePairs: [number, number][][]) => (coords => new Array(coords.reduce((acc, curr) => Math.max(acc, curr[0]),0) + 1).fill(0).map(_ => new Array(coords.reduce((acc, curr) => Math.max(acc, curr[1]),0) + 1).fill(0)))(linePairs.flatMap(linePair => linePair));

// Debug only
const printGrid = (grid: number[][]) => {
    console.log("--------------");
    grid.forEach(row => console.log(row.join(' ')))
    console.log("--------------");
};

const determineOverlappingLines = (grid: number[][], linePairs: [number, number][][], ignoreDiagonal: boolean) => linePairs.reduce((accGrid, linePair) => {
    if (!isHorizontal(linePair) && !isVertical(linePair) && ignoreDiagonal) {
        return accGrid;
    }
    if (isVertical(linePair)) {
        const min = Math.min(linePair[0][1], linePair[1][1]);
        const max = Math.max(linePair[0][1], linePair[1][1]);
        for (let y = min; y <= max; y++) {
            accGrid[linePair[0][0]][y] += 1; 
        }
        return accGrid;
    }
    if (isHorizontal(linePair)) {
        const min = Math.min(linePair[0][0], linePair[1][0]);
        const max = Math.max(linePair[0][0], linePair[1][0]);
        for (let x = min; x <= max; x++) {
            accGrid[x][linePair[0][1]] += 1;
        }
        return accGrid;
    }
    const xDir = Math.sign(linePair[1][0] - linePair[0][0]);
    const yDir = Math.sign(linePair[1][1] - linePair[0][1]);
    let x = linePair[0][0], y = linePair[0][1];
    accGrid[x][y] += 1;
    while (x !== linePair[1][0] || y !== linePair[1][1]) {
        x += xDir;
        y += yDir;
        accGrid[x][y] += 1;
    }
    return accGrid;
}, grid).reduce((acc1, row) => acc1 + row.reduce((acc2, val) => val > 1 ? acc2 + 1 : acc2, 0), 0);

const linePairs = processDataFromStdin(toLinePairs);
console.log(determineOverlappingLines(initGrid(linePairs), linePairs, true));
console.log(determineOverlappingLines(initGrid(linePairs), linePairs, false));
