import { processDataFromStdin, toStringArray } from "../util/file_util"
import { insertOrIncrementMapValue } from "../util/map_util";
import { createRange } from "../util/range_util";

type PolymerPair = string;

type PolymerPairCountMap = Map<PolymerPair, number>;

type PolymerRule = {
    requirementsPair: string[],
    elementToInsert: string,
};

type PolymerState = {
    polymerMap: PolymerPairCountMap;
    rules: PolymerRule[];
};

const toPolymerMap: (polymerTemplateStr: string) => PolymerPairCountMap = (polymerTemplateStr) => {
    const map = new Map<PolymerPair, number>();
    for (let i = 0; i < polymerTemplateStr.length - 1; i++) {
        const pair = polymerTemplateStr.slice(i, i + 2);
        insertOrIncrementMapValue(map, pair, 1);
    }
    return map;
};

const toRule = (ruleStr: string) => {
    const splitArr = ruleStr.split(" -> ");
    return {
        requirementsPair: splitArr[0].split(""),
        elementToInsert: splitArr[1],
    };
};

const createLetterOccurrencesMap = (polymerMap: PolymerPairCountMap) => {
    let occurrencesMap = new Map();
    for (const pair of polymerMap.keys()) {
        const count = polymerMap.get(pair) || 0;
        insertOrIncrementMapValue(occurrencesMap, pair[0], count);
        insertOrIncrementMapValue(occurrencesMap, pair[1], count);
    }
    for (const letter of occurrencesMap.keys()) {
        const count = occurrencesMap.get(letter) || 0;
        if (count % 2 === 0) {
            occurrencesMap.set(letter, count / 2);
        } else {
            occurrencesMap.set(letter, (count + 1) / 2);
        }
    }
    return occurrencesMap;
};

const getMostCommonElement = (polymerMap: PolymerPairCountMap) => {
    let occurrencesMap = createLetterOccurrencesMap(polymerMap);
    let mostCommon = '';
    let mostCommonCount = 0;
    for (const key of occurrencesMap.keys()) {
        if (occurrencesMap.get(key) > mostCommonCount) {
            mostCommonCount = occurrencesMap.get(key);
            mostCommon = key;
        }
    }
    return {
        label: mostCommon,
        count: mostCommonCount,
    };
};

const getLeastCommonElement = (polymerMap: PolymerPairCountMap) => {
    let occurrencesMap = createLetterOccurrencesMap(polymerMap);
    let leastCommon = '';
    let leastCommonCount = Number.MAX_SAFE_INTEGER;
    for (const key of occurrencesMap.keys()) {
        if (occurrencesMap.get(key) < leastCommonCount) {
            leastCommonCount = occurrencesMap.get(key);
            leastCommon = key;
        }
    }
    return {
        label: leastCommon,
        count: leastCommonCount,
    };
};

// Debug only
const printPolymerRules = (rules: PolymerRule[]) => {
    rules.forEach(rule => console.log(rule));
};

const toPolymerState = (buffer: Buffer) => {
    const arr = toStringArray(buffer);
    const polymerTemplateStr = arr[0];
    const ruleStrArr = arr.slice(2);
    return {
        polymerMap: toPolymerMap(polymerTemplateStr),
        rules: ruleStrArr.map(ruleStr => toRule(ruleStr)),
    };
};

const performStep = (state: PolymerState) => {
    const newMap = new Map<string, number>();
    for (const pair of state.polymerMap.keys()) {
        const count = state.polymerMap.get(pair) || 0;
        state.rules.forEach(rule => {
            if (pair[0] === rule.requirementsPair[0] && pair[1] === rule.requirementsPair[1]) {
                const newPair1 = pair[0] + rule.elementToInsert;
                const newPair2 = rule.elementToInsert + pair[1];
                insertOrIncrementMapValue(newMap, newPair1, count);
                insertOrIncrementMapValue(newMap, newPair2, count);
            }
        });
    }
    state.polymerMap = newMap;
};

const data = processDataFromStdin(toPolymerState);
for (let _ of createRange(1, 10)) {
    performStep(data);
}
const mostCommon = getMostCommonElement(data.polymerMap);
const leastCommon = getLeastCommonElement(data.polymerMap);
console.log(mostCommon.count - leastCommon.count);
for (let _ of createRange(11, 40)) {
    performStep(data);
}
const mostCommon2 = getMostCommonElement(data.polymerMap);
const leastCommon2 = getLeastCommonElement(data.polymerMap);
console.log(mostCommon2.count - leastCommon2.count);
