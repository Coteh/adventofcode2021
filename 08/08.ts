import { processDataFromStdin, toStringArray } from '../util/file_util';
import { createRange } from '../util/range_util';

type DigitObject = {
    input: string[],
    output: string[],
};

const uniqueDigits = [2,4,3,7];

const posArr = [
    [0,1,2,4,5,6],
    [2,5],
    [0,2,3,4,6],
    [0,2,3,5,6],
    [1,2,3,5],
    [0,1,3,5,6],
    [0,1,3,4,5,6],
    [0,2,5],
    [0,1,2,3,4,5,6],
    [0,1,2,3,5,6],
];

const toDigitArr = (buffer: Buffer) => toStringArray(buffer).map(line => line.split(" ")).reduce((acc, arr) => [...acc, {
    input: arr.slice(0, arr.indexOf("|")),
    output: arr.slice(arr.indexOf("|") + 1),
}], new Array<DigitObject>());

const permutateAnagramsForSegmentInner: (curr: string[], remaining: string[], results: string[][]) => any = (curr, remaining, results) => {
    if (remaining.length === 1) {
        return results.push([...curr, ...remaining]);
    }
    for (let i = 0; i < remaining.length; i++) {
        const letter = remaining[i];
        permutateAnagramsForSegmentInner([...curr, letter], [...remaining.slice(0, i), ...remaining.slice(i + 1)], results);
    }
    return results;
};

const permutateAnagramsForSegment: (segment: string) => string[] = (segment) => {
    const split = segment.split("");
    const results: string[][] = [];

    return permutateAnagramsForSegmentInner([], split, results).map((arr: any) => arr.join(''));
};

// Debugging only
const verifyUniqueAnagrams = (anagram: string[]) => {
    const map = new Map();

    for (let gram of anagram) {
        if (map.get(gram)) {
            return false;
        }
        map.set(gram, true);
    }

    return true;
}

const isAnagram = (first: string, second: string) => {
    const map = new Map();

    for (let chr of first) {
        const count = map.get(chr);
        if (!count) {
            map.set(chr, 1);
        } else {
            map.set(chr, count + 1);
        }
    }

    for (let chr of second) {
        const count = map.get(chr);
        if (!count) {
            return false;
        }
        map.set(chr, count - 1);
    }

    for (let count of map.values()) {
        if (count !== 0) {
            return false;
        }
    }
    return true;
}

const getSegmentFromAnagram = (anagram: string, digit: number) => {
    const positions = posArr[digit];
    return anagram.split('').filter((_, i) => positions.includes(i)).join('');
}

const determineWiring: (digitObj: DigitObject, anagrams: string[]) => string | undefined = (digitObj, anagrams) => {
    for (const gram of anagrams) {
        let matchesRemaining = 9;
        for (const input of digitObj.input) {
            if (input.length === 5) {
                if (isAnagram(input, getSegmentFromAnagram(gram, 2)) 
                || isAnagram(input, getSegmentFromAnagram(gram, 3)) 
                || isAnagram(input, getSegmentFromAnagram(gram, 5))) {
                    matchesRemaining--;
                }
            } else if (input.length === 6) {
                if (isAnagram(input, getSegmentFromAnagram(gram, 0)) 
                || isAnagram(input, getSegmentFromAnagram(gram, 6)) 
                || isAnagram(input, getSegmentFromAnagram(gram, 9))) {
                    matchesRemaining--;
                }
            } else if (input.length === 2) {
                if (isAnagram(input, getSegmentFromAnagram(gram, 1))) {
                    matchesRemaining--;
                }
            } else if (input.length === 4) {
                if (isAnagram(input, getSegmentFromAnagram(gram, 4))) {
                    matchesRemaining--;
                }
            } else if (input.length === 3) {
                if (isAnagram(input, getSegmentFromAnagram(gram, 7))) {
                    matchesRemaining--;
                }
            }
            // 8 will always match the segment
        }
        if (matchesRemaining === 0) {
            return gram;
        }
    }
    return undefined;
};

const getDigitFromSegment = (output: string, segment: string) => {
    for (const digit of createRange(0,9)) {
        if (isAnagram(output, getSegmentFromAnagram(segment, digit))) {
            return digit;
        }
    }
    return undefined;
}

const bruteForceWiringSegmentSum = (digitArr: DigitObject[], anagrams: string[]) => {
    let total = 0;
    for (const digitObj of digitArr) {
        const wiring = determineWiring(digitObj, anagrams);
        if (!wiring) {
            continue;
        }
        let num = '';
        for (const output of digitObj.output) {
            const digit = getDigitFromSegment(output, wiring);
            if (digit === undefined) {
                continue;
            }
            num += digit.toString();
        }
        total += parseInt(num);
    }
    return total;
};

const digitArr = processDataFromStdin(toDigitArr);
const numUniqueDigits = digitArr.reduce((acc, obj) => acc + obj.output.filter(digit => uniqueDigits.includes(digit.length)).length, 0)
console.log(numUniqueDigits);
const anagrams = permutateAnagramsForSegment("abcdefg");
console.log(bruteForceWiringSegmentSum(digitArr, anagrams));
