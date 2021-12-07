import { processDataFromStdin, toStringArray } from "../util/file_util";
import { createRange } from "../util/range_util";

const toFishArray = (buffer: Buffer) => toStringArray(buffer).flatMap(line => line.split(",").map(val => parseInt(val)));

const createFishState = (fishArr: number[]) => fishArr.reduce((arr, fish) => {
    arr[fish]++;
    return arr;
}, new Array(9).fill(0));

const simulateFish = (fishState: number[], days: number) => { 
    let nextState = fishState;
    for (let _ of createRange(1, days)) {
        nextState = nextState.map((_, i, arr) => {
            let newVal = i === arr.length - 1 ? arr[0] : arr[i + 1];
            if (i === 6) {
                newVal += arr[0];
            }
            return newVal;
        });
    }
    return nextState;
};

const getNumberOfFish = (fishState: number[]) => fishState.reduce((totalCount, currCount) => totalCount + currCount, 0);

const fishArr = processDataFromStdin(toFishArray);
const fishState = createFishState(fishArr);

let newState = simulateFish(fishState, 80);
console.log(getNumberOfFish(newState));
newState = simulateFish(fishState, 256);
console.log(getNumberOfFish(newState));
