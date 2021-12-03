import { processDataFromStdin, toNumberArray } from "../util/file_util";

const SLIDING_WINDOW_LENGTH = 3;

const getNumIncreases = (vals: number[]) => vals.reduce((acc, val, i, arr) => {
    return i > 0 && val - arr[i - 1] > 0 ? acc + 1 : acc;
}, 0);

const getSlidingWindows = (vals: number[]) => vals.reduce((acc, val, i) => {
    return i >= SLIDING_WINDOW_LENGTH - 1 ? [...acc, val + vals[i - 1] + vals[i - 2]] : acc;
}, new Array<number>());

const depths = processDataFromStdin(toNumberArray);
console.log(getNumIncreases(depths));
console.log(getNumIncreases(getSlidingWindows(depths)));
