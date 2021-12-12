export const copyGrid = (grid: any[][]) => {
    const arr = new Array(grid.length);

    for (let i = 0; i < grid.length; i++) {
        arr[i] = Array.from(grid[i]);
    }

    return arr;
};
