type RangeIterable = {
    from: number,
    to: number,
} & Iterable<number>;

// createRange creates an iterable that iterates from `from` value to `to` value. If `from` > `to`, no iteration will occur.
// An Iterable is an object that, when its iterator function is called, produces an object with a next() function that iterates until its end condition is met.
// For more information on iterables - https://javascript.info/iterable
// Adapted example from this page and converted it to TypeScript
export const createRange = (from: number, to: number) => {
    const range: any = {
        from,
        to,
    };
    range[Symbol.iterator] = function() {
        return {
            current: this.from,
            last: this.to,
            next() {
                if (this.current <= this.last) {
                    return {
                        done: false,
                        value: this.current++,
                    }
                } else {
                    return {
                        done: true,
                    }
                }
            }
        }
    }
    return range as RangeIterable;
}
