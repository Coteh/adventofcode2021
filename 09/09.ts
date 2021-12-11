import { processDataFromStdin, toStringArray } from '../util/file_util';

const toGrid = (buffer: Buffer) => toStringArray(buffer).map(line => line.split("").map(val => parseInt(val)));

type LowPointsResult = {
    points: Position[],
    sum: number;
};

const findLowPoints = (grid: number[][]) => grid.reduce((acc: LowPointsResult, line, i) => {
    const result = line.reduce((inner: LowPointsResult, val, j) => {
        const up = grid[i - 1] ? grid[i - 1][j] : undefined;
        const down = grid[i + 1] ? grid[i + 1][j] : undefined;
        const left = grid[i][j - 1];
        const right = grid[i][j + 1];
        const risk = (up === undefined || val < up) && (down === undefined || val < down) && (left === undefined || val < left) && (right === undefined || val < right) ? val + 1 : 0;
        return {
            points: risk > 0 ? [...inner.points, {x: j, y: i}] : inner.points,
            sum: inner.sum + risk,
        }
    }, {
        points: [],
        sum: 0,
    });
    return {
        points: [...acc.points, ...result.points],
        sum: acc.sum + result.sum,
    }
}, {
    points: [],
    sum: 0,
});

type Position = {
    x: number;
    y: number;
};

const findBasinSize: (currPos: Position, grid: number[][], visitedPosArr: Position[]) => number = (currPos, grid, visitedPosArr) => {
    if (visitedPosArr.some(pos => pos.x === currPos.x && pos.y === currPos.y) || grid[currPos.y] === undefined || grid[currPos.y][currPos.x] === undefined || grid[currPos.y][currPos.x] === 9) {
        return 0;
    }

    visitedPosArr.push(currPos);

    return 1 + findBasinSize({x: currPos.x - 1, y: currPos.y}, grid, visitedPosArr)
    + findBasinSize({x: currPos.x + 1, y: currPos.y}, grid, visitedPosArr)
    + findBasinSize({x: currPos.x, y: currPos.y - 1}, grid, visitedPosArr)
    + findBasinSize({x: currPos.x, y: currPos.y + 1}, grid, visitedPosArr);
};

const grid = processDataFromStdin(toGrid);
const lowPointsResult = findLowPoints(grid);
console.log(lowPointsResult.sum);
console.log(lowPointsResult.points.map(point => findBasinSize(point, grid, [])).sort((a,b) => b - a).slice(0,3).reduce((acc, curr) => acc * curr, 1))
