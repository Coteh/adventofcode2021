import { processDataFromStdin, toStringArray } from '../util/file_util';
import { createRange } from '../util/range_util';

const toCrabArray = (buffer: Buffer) => toStringArray(buffer).flatMap(line => line.split(",").map(val => parseInt(val)));

const calculateShortestConstantDistance = (crabArr: number[]) => {
    let minPosCount = crabArr.reduce((acc, crab) => Math.min(crab, acc), Number.MAX_SAFE_INTEGER);
    let maxPosCount = crabArr.reduce((acc, crab) => Math.max(crab, acc), 0);

    let lowestDist = Number.MAX_SAFE_INTEGER;
    for (const pos of createRange(minPosCount, maxPosCount)) {
        lowestDist = Math.min(lowestDist, crabArr.reduce((acc, currPos) => acc + Math.abs(currPos - pos), 0));
    }
    return lowestDist;
};

const fuelDistCache = new Map<number, number | undefined>();

const calculateFuelDistance: (dist: number) => number = (dist) => {
    if (dist === 0) {
        return 0;
    }
    let fuelDist = fuelDistCache.get(dist);
    if (!fuelDist) {
        fuelDist = dist + calculateFuelDistance(dist - 1);
        fuelDistCache.set(dist, fuelDist);
    }
    return fuelDist;
};

const calculateShortestFuelDistance = (crabArr: number[]) => {
    let minPosCount = crabArr.reduce((acc, crab) => Math.min(crab, acc), Number.MAX_SAFE_INTEGER);
    let maxPosCount = crabArr.reduce((acc, crab) => Math.max(crab, acc), 0);

    let lowestDist = Number.MAX_SAFE_INTEGER;
    for (const pos of createRange(minPosCount, maxPosCount)) {
        lowestDist = Math.min(lowestDist, crabArr.reduce((acc, currPos) => acc + calculateFuelDistance(Math.abs(currPos - pos)), 0));
    }
    return lowestDist;
};

const crabArr = processDataFromStdin(toCrabArray);
console.log(calculateShortestConstantDistance(crabArr));
console.log(calculateShortestFuelDistance(crabArr));
