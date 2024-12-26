# adventofcode2021

[![Test AoC 2021](https://github.com/Coteh/adventofcode2021/actions/workflows/run_aoc_test.yml/badge.svg)](https://github.com/Coteh/adventofcode2021/actions/workflows/run_aoc_test.yml)

These are my solutions for [Advent of Code (AoC) 2021](https://adventofcode.com/2021).

The solutions in this repo contain **spoilers**, so proceed at your own risk.

## Notes

If I have any interesting notes I want to share, I'll put them down below.

### Day 06
This was an interesting problem, as I seem to have reached the maximum array size allowed by Node.js runtime with the initial naive solution of adding each fish as a separate item to the array. Instead of fighting with Node.js memory constraints, I realized that since the order does not matter for the fish in this particular scenario, I can simply re-express the problem as a fixed size array of 9, one for each of the possible days &mdash; or internal timers &mdash; a fish can have. (each element being a count of the fish with that value) Each fish was then categorized amongst these buckets by their internal timer value.

There were two rules each state update:

1. Each timer value will contain the value of the next timer from the previous state. For the 8th timer, the value of the 0th timer is used, to signify the newborns from the 0th timer fish.
1. For the 6th timer value, the 0th timer value is added as well, to signify the timer reset for fish that have given birth.

This solution not only solves the memory problem, but also produces a relatively fast result.

Another note: This solution would not work with 32 bit integers, but since Node.js [uses 64-bit floating point](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#number_type) with a max value of 2<sup>53</sup> - 1, this solution is sufficient. If the counts were larger, I would need to look into something else, such as BigInt, [which has no size limit](https://tc39.es/ecma262/#sec-ecmascript-language-types-bigint-type).

### Day 14
I initially started Day 14 with a linear approach, storing all polymer letters. I realized by part 2 that this solution would not hold up at all for large polymers. The polymer grows exponentially each step, so I needed to look into a way to get the memory usage down to something more manageable.

Since the problem statement doesn't explicitly state that the order of the polymer matters (just the letter counts matter), I realized that I can store the counts of each pair into something like a map data structure. Because the order is no longer maintained, this makes it a bit harder to verify that the algorithm is correct, but I should be good as long as I can at least verify manually that the letters produced is correct for the first two steps, then check the counts after the 10th step as well.

I also need to make sure, since order is no longer maintained, duplicate letters aren't counted (nor are there any letters not accounted for) when I get the most common and least common elements.

I observed after counting each occurrence of each letter in each pair (this includes duplicates), letters in the middle of the polymer have an even amount, and letters at the start and end of the polymer have an odd amount. This is because the letters at the start and end of the polymer are only counted once, while all letters in the middle of the polymer are counted twice.

Using this realization, I determined that to find the unique count of letters in the polymer, I simply divide the current count (with the duplicates) by 2 if it's even, and if it's odd, add 1 to the count then divide by 2.
