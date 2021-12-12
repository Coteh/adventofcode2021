import { copyGrid } from "../util/copy_util";
import { processDataFromStdin, toNumberGrid } from "../util/file_util";
import { createRange } from "../util/range_util";

// TODO put in separate type definition file
// Remove the one in day 09 as well
type Position = {
    x: number;
    y: number;
};

// Debug only
function printGrid(grid: number[][]) {
    for (let i = 0; i < grid.length; i++) {
        console.log(grid[i].map(val => val.toString()).join(""));
    }
}

function flash(pos: Position, grid: number[][], flashed: Position[]) {
    grid[pos.x][pos.y] = 0;
    const adjacent: Position[] = [
        {x: pos.x - 1, y: pos.y - 1},
        {x: pos.x + 1, y: pos.y - 1},
        {x: pos.x - 1, y: pos.y + 1},
        {x: pos.x + 1, y: pos.y + 1},
        {x: pos.x - 1, y: pos.y},
        {x: pos.x + 1, y: pos.y},
        {x: pos.x, y: pos.y - 1},
        {x: pos.x, y: pos.y + 1},
    ];
    for (const adjacentPos of adjacent) {
        if (grid[adjacentPos.x] === undefined || grid[adjacentPos.x][adjacentPos.y] === undefined) continue;
        grid[adjacentPos.x][adjacentPos.y] += 1;
        if (grid[adjacentPos.x][adjacentPos.y] > 9) {
            flashed.push(adjacentPos);
            flash(adjacentPos, grid, flashed);
        }
    }
}

function iterateOctopi(grid: number[][]) {
    for (let i = 0; i < grid.length; i++) {
        for (let j = 0; j < grid[i].length; j++) {
            grid[i][j] += 1;
        }
    }
    const flashed = [];
    for (let i = 0; i < grid.length; i++) {
        for (let j = 0; j < grid[i].length; j++) {
            if (grid[i][j] > 9) {
                flashed.push({
                    x: i,
                    y: j
                });
                flash({
                    x: i,
                    y: j
                }, grid, flashed);
            }
        }
    }
    for (const flashedPos of flashed) {
        grid[flashedPos.x][flashedPos.y] = 0;
    }
    return flashed.length;
}

function determineNumberOfFlashes(grid: number[][], steps: number) {
    let flashedCount = 0;
    for (const _ of createRange(1, steps)) {
        flashedCount += iterateOctopi(grid);
    }
    return flashedCount;
}

function determineFirstSyncedStep(grid: number[][]) {
    let found = false;
    let step = 0;
    while (!found) {
        iterateOctopi(grid);
        found = true;
        for (let i = 0; i < grid.length; i++) {
            for (let j = 0; j < grid.length; j++) {
                if (grid[i][j] !== 0) {
                    found = false;
                    break;
                }
            }
            if (!found) {
                break;
            }
        }
        step++;
    }
    return step;
}

const grid = processDataFromStdin(toNumberGrid);
const grid2 = copyGrid(grid);
console.log(determineNumberOfFlashes(grid, 100));
console.log(determineFirstSyncedStep(grid2))
