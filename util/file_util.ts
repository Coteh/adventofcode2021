const fs = require("fs");

type TransformFunc<T> = (buffer: Buffer) => T;

export function processDataFromStdin<T>(transformFunc: TransformFunc<T>): T {
    if (!transformFunc) {
        throw new Error("Transform func must be provided");
    }
    return transformFunc(fs.readFileSync(process.stdin.fd));
}

export function toNumberArray(buffer: Buffer): number[] {
    return toStringArray(buffer).map(item => parseInt(item));
}

export function toParsedBasicCommands(buffer: Buffer): [string, number][] {
    return toStringArray(buffer).map(item => {
        const split = item.split(" ");
        return [split[0], parseInt(split[1])];
    });
}

export function toStringArray(buffer: Buffer): string[] {
    return buffer.toString().trimEnd().split("\n");
};

export function toNumberGrid(buffer: Buffer): number[][] {
    return toStringArray(buffer).map(line => line.split("").map(val => parseInt(val)));
};
