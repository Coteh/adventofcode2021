const fs = require("fs");

type TransformFunc<T> = (buffer: Buffer) => T;

export function processDataFromStdin<T>(transformFunc: TransformFunc<T>): T {
    if (!transformFunc) {
        throw new Error("Transform func must be provided");
    }
    return transformFunc(fs.readFileSync(process.stdin.fd));
}

export function toNumberArray(buffer: Buffer): number[] {
    return buffer.toString().trimEnd().split("\n").map(item => parseInt(item));
}

export function toParsedBasicCommands(buffer: Buffer): [string, number][] {
    return buffer.toString().trimEnd().split("\n").map(item => {
        const split = item.split(" ");

        return [split[0], parseInt(split[1])];
    });
}
