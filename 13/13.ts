import { processDataFromStdin, toStringArray } from "../util/file_util";

type Coord = {x: number, y: number};
type Fold = {direction: string, value: number};

function toInstructions(buffer: Buffer) {
    const arr = toStringArray(buffer);
    const coords = arr.slice(0,arr.indexOf("")).map(elem => elem.split(",").map(elem => parseInt(elem))).map(coord => ({
        x: coord[0],
        y: coord[1],
    }));
    const folds = arr.slice(arr.indexOf("") + 1).map(elem => elem.split("=")).map(items => ({
        direction: items[0].charAt(items[0].length - 1),
        value: parseInt(items[1]),
    }));
    return {
        coords,
        folds,
    };
}

function createGrid(coords: Coord[]) {
    const maxCols = coords.reduce((currMax, currCoord) => currCoord.x > currMax ? currCoord.x : currMax, 0) + 1;
    const maxRows = coords.reduce((currMax, currCoord) => currCoord.y > currMax ? currCoord.y : currMax, 0) + 1;
    const grid = new Array(maxRows).fill(0).map(() => new Array(maxCols).fill("."));
    coords.forEach(coord => {
        grid[coord.y][coord.x] = "#";
    });
    return grid;
}

function fold(coords: Coord[], fold: Fold) {
    return coords.map(coord => ({
        x: fold.direction === "x" && coord.x > fold.value ? fold.value - (coord.x - fold.value) : coord.x,
        y: fold.direction === "y" && coord.y > fold.value ? fold.value - (coord.y - fold.value) : coord.y,
    }));
}

function countPlacements(grid: string[][]) {
    let count = 0;
    grid.forEach(row => row.forEach(val => {
        if (val === "#") {
            count++;
        }
    }));
    return count;
}

const printGrid = (grid: string[][]) => {
    grid.forEach(row => console.log(row.join('')));
};

const instructions = processDataFromStdin(toInstructions);
// Part 1: One Fold
const foldedCoords = fold(instructions.coords, instructions.folds[0]);
const foldedGrid = createGrid(foldedCoords);
console.log(countPlacements(foldedGrid));
// Part 2: All Folds
const foldedCoords2 = instructions.folds.reduce((coords, foldInstructions) => fold(coords, foldInstructions), instructions.coords);
const foldedGrid2 = createGrid(foldedCoords2);
printGrid(foldedGrid2);
