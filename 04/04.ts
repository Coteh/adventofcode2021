import { processDataFromStdin, toStringArray } from "../util/file_util";

type BingoState = {
    bingoNumbers: string[],
    bingoCardLines: string[][],
    numBingoCards: number;
}

const toBingoState = (buffer: Buffer) => {
    const inputArr = toStringArray(buffer);
    const bingoCardLines = inputArr.filter((line, i) => i > 0 && line.length > 0).map(line => line.split(" ").filter(item => item !== ""));
    return {
        bingoNumbers: inputArr[0].split(","),
        bingoCardLines,
        numBingoCards: bingoCardLines.length / 5,
    } as BingoState;
};

const getNextWinner = (bingoState: BingoState, winningCards: number[]) => {
    let winnerIndex = 0;
    const nextWinnerPoints = bingoState.bingoNumbers.reduce((acc, num) => {
        if (acc >= 0) return acc;
        bingoState.bingoCardLines = bingoState.bingoCardLines.map(line => line.map(item => item === num ? "*" : item));
        for (let i = 0; i < bingoState.numBingoCards; i++) {
            if (winningCards.includes(i)) continue;
            const bingoCard = bingoState.bingoCardLines.slice(i * 5, (i + 1) * 5);
            const isHorizontalMatch = bingoCard.filter(line => line.every(val => val === "*")).length === 1;
            const isVerticalMatch = new Array(5).fill(0).filter((_, i) => bingoCard.every(line => line[i] === "*")).length === 1;
            if (isHorizontalMatch || isVerticalMatch) {
                winnerIndex = i;
                return parseInt(num) * bingoCard.reduce((sum, line) => sum + line.reduce((innerSum, val) => val !== "*" ? innerSum + parseInt(val) : innerSum, 0), 0);
            }
        }
        return acc;
    }, -1);
    return [nextWinnerPoints, winnerIndex]
};

const bingoState = processDataFromStdin(toBingoState);
const [firstWinnerPoints, firstWinnerIndex] = getNextWinner(bingoState, []);
console.log(firstWinnerPoints);
const winners = [firstWinnerIndex];
let lastWinnerPoints;
while (winners.length < bingoState.numBingoCards) {
    const [nextWinnerPoints, nextWinner] = getNextWinner(bingoState, winners);
    winners.push(nextWinner);
    if (winners.length === bingoState.numBingoCards) {
        lastWinnerPoints = nextWinnerPoints;
    }
}
console.log(lastWinnerPoints);
