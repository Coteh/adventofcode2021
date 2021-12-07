# adventofcode 2021

These are my solutions for [Advent of Code (AoC) 2021](https://adventofcode.com/2021).

The solutions in this repo contain **spoilers**, so proceed at your own risk.

## Notes

If I have any interesting notes I want to share, I'll put them down below.

### Day 06
This was an interesting problem, as I seem to have reached the maximum array size allowed by Node.js runtime with the initial naive solution of adding each fish as a separate item to the array. Instead of fighting with Node.js memory constraints, I realized that I can simply re-express the problem as a fixed size array of 9, one for each of the possible days (or internal timers) a fish can have, and categorizing the fish amongst these buckets by their internal timer value. (each element is a count of the fish with that value)

There were two rules each state update:

1. Each timer value will contain the value of the next timer from the previous state. For the 8th timer, the value of the 0th timer is used, to signify the newborns from the 0th timer fish.
1. For the 6th timer value, the 0th timer value is added as well, to signify the timer reset for fish that have given birth.

This solution not only solves the memory problem, but also produces a relatively fast result.
