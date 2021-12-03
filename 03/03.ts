import { processDataFromStdin, toStringArray } from "../util/file_util";

const getBitCounts = (binaries: string[], index: number) => binaries.reduce((acc, binary) => ({
    numZeros: binary[index] === "0" ? acc.numZeros + 1 : acc.numZeros,
    numOnes: binary[index] === "1" ? acc.numOnes + 1 : acc.numOnes,
}), { numZeros: 0, numOnes: 0 });

const getBitCountsAll = (binaries: string[]) => new Array(binaries[0].length).fill(0).map((_, i) => getBitCounts(binaries, i));

const getGammaRate = (binaries: string[]) => parseInt(getBitCountsAll(binaries).map(bitCounts => bitCounts.numZeros > bitCounts.numOnes ? "0" : "1").join(''), 2);

const getEpsilonRate = (binaries: string[]) => getGammaRate(binaries) ^ parseInt(new Array(binaries[0].length).fill("1").join(""), 2);

const getRating = (binaries: string[], comparator: (numOnes: number, numZeros: number) => boolean) => {
    for (let i = 0; binaries.length > 1 && i < binaries[0].length; i++) {
        const bitCounts = getBitCounts(binaries, i);
        binaries = binaries.filter(binary => comparator(bitCounts.numOnes, bitCounts.numZeros) ? binary[i] === "1" : binary[i] === "0");
    }
    return parseInt(binaries[0], 2);
};

const getOxygenGeneratorRating = (binaries: string[]) => getRating(binaries, (numOnes, numZeros) => numOnes >= numZeros);

const getCO2ScrubberRating = (binaries: string[]) => getRating(binaries, (numOnes, numZeros) => numOnes < numZeros);

const binaries = processDataFromStdin(toStringArray);
console.log(getGammaRate(binaries) * getEpsilonRate(binaries));
console.log(getOxygenGeneratorRating(binaries) * getCO2ScrubberRating(binaries));
