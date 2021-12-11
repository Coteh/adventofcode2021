import { processDataFromStdin, toStringArray } from "../util/file_util";

type CorruptResult = {
    found: boolean;
    symbol: string;
    stack: string[];
}

const bracketMap: {[key: string]: string} = {
    ')': "(",
    ']': "[",
    '}': "{",
    '>': "<",
};

const reverseBracketMap: {[key: string]: string} = {
    "(": ')',
    "[": ']',
    "{": '}',
    "<": '>',
};

const bracketCorruptPointMap: {[key: string]: number} = {
    ')': 3,
    ']': 57,
    '}': 1197,
    '>': 25137,
};

const bracketCompletionPointMap: {[key: string]: number} = {
    ')': 1,
    ']': 2,
    '}': 3,
    '>': 4,
};

const toSubsystem = (buffer: Buffer) => toStringArray(buffer).map(line => line.split(""));

const determineFirstCorruptedSymbol = (subsystemLine: string[]) => subsystemLine.reduce((acc: CorruptResult, curr) => {
    if (acc.found) return acc;
    if (Object.keys(bracketMap).includes(curr)) {
        if (acc.stack[acc.stack.length - 1] !== bracketMap[curr]) {
            return {
                found: true,
                symbol: curr,
                stack: acc.stack,
            }
        } else {
            acc.stack = acc.stack.slice(0, acc.stack.length - 1);
            return acc;
        }
    }
    
    acc.stack = [...acc.stack, curr];
    
    return acc;
}, {
    found: false,
    symbol: '',
    stack: [],
});

const determineCorruptedPoints = (subsystem: string[][]) => {
    const corruptedSymbolCounts = subsystem.map(determineFirstCorruptedSymbol).filter(obj => obj.found).reduce((countObj: {[key: string]: number}, obj) => {
        countObj[obj.symbol]++;
        return countObj;
    }, {
        ')': 0,
        ']': 0,
        '}': 0,
        '>': 0,
    });
    return Object.keys(corruptedSymbolCounts).reduce((totalCount, key) => totalCount + corruptedSymbolCounts[key] * bracketCorruptPointMap[key], 0)
};

const getMiddleIncompleteLinePoints = (subsystem: string[][]) => {
    const incompleteLines = subsystem.map(determineFirstCorruptedSymbol).filter(obj => !obj.found);
    const incompleteLinePoints = incompleteLines.map((lineObj) => lineObj.stack.reduceRight((totalCount, chr) => totalCount * 5 + bracketCompletionPointMap[reverseBracketMap[chr]], 0)).sort((a, b) => b - a);
    return incompleteLinePoints[Math.floor(incompleteLinePoints.length / 2)];
};

const subsystem = processDataFromStdin(toSubsystem);
console.log(determineCorruptedPoints(subsystem));
console.log(getMiddleIncompleteLinePoints(subsystem));
