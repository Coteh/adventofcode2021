const fs = require("fs");

type TransformFunc<T> = (buffer: Buffer) => T;

export async function processDataFromStdin<T>(transformFunc: TransformFunc<T>): Promise<T> {
    if (!transformFunc) {
        throw new Error("Transform func must be provided");
    }
    return transformFunc(fs.readFileSync(process.stdin.fd));
}

export function toNumberArray(buffer: Buffer): number[] {
    return buffer.toString().trimEnd().split("\n").map(item => parseInt(item));
}
