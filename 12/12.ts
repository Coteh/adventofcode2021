import { processDataFromStdin, toStringArray } from "../util/file_util";

type VisitConditionFunc = (node: Node<CaveType>, visitedMap: {[label: string]: number}) => boolean;

enum CaveType {
    SMALL,
    BIG
};

const isLargeCave = (label: string) => label.length > 0 && label[0] >= "A" && label[0] <= "Z";

class Node<T> {
    label: string;
    links: Node<T>[];
    type: T;

    constructor(label: string, links: Node<T>[], type: T) {
        this.label = label;
        this.links = links;
        this.type = type;
    }
}

function toGraph(buffer: Buffer) {
    const nodes = new Map<string, Node<CaveType>>();

    const connections = toStringArray(buffer).map(line => line.split("-"));

    connections.forEach(connection => {
        const labels = [connection[0], connection[1]];
        labels.forEach(label => {
            if (!nodes.get(label)) {
                const newNode = new Node<CaveType>(label, [], isLargeCave(label) ? CaveType.BIG : CaveType.SMALL);
                nodes.set(label, newNode);
            }
        });
    });
    connections.forEach(connection => {
        const nodeA = nodes.get(connection[0]);
        const nodeB = nodes.get(connection[1]);
        if (nodeA && nodeB) {
            nodeA.links.push(nodeB);
            nodeB.links.push(nodeA);
        }
    });

    return nodes;
}

function findPath(currNode: Node<CaveType>, visitedMap: {[label: string]: number}, paths: Node<CaveType>[][], currPath: Node<CaveType>[], visitCondition: VisitConditionFunc) {
    if (!visitedMap[currNode.label]) {
        visitedMap[currNode.label] = 1;
    } else {
        visitedMap[currNode.label]++;
    }
    currPath.push(currNode);
    if (currNode.label === "end") {
        return paths.push(currPath);
    }
    for (const node of currNode.links) {
        if (visitedMap[node.label] && visitCondition(node, visitedMap)) {
            continue;
        }
        findPath(node, {...visitedMap}, paths, [...currPath], visitCondition);
    }
}

function findPaths(start: Node<CaveType>, visitCondition: VisitConditionFunc) {
    const paths: Node<CaveType>[][] = [];
    findPath(start, {}, paths, [], visitCondition);
    return paths;
}

const hasSmallTwiceVisited = (visitedMap: {[label: string]: number}) => Object.keys(visitedMap).some(label => !isLargeCave(label) && visitedMap[label] > 1);

const part1Condition = (node: Node<CaveType>) => node.type === CaveType.SMALL;
const part2Condition = (node: Node<CaveType>, visitedMap: {[label: string]: number}) => node.type === CaveType.SMALL && (node.label === "start" || node.label === "end" || hasSmallTwiceVisited(visitedMap));

// debug
const printPath = (path: Node<CaveType>[]) => console.log(path.map(node => node.label).join(","));

const data = processDataFromStdin(toGraph);
// console.log(data.get("start")); // debug
// Array.from(data.values()).forEach(val => console.log(val)) // debug
const start = data.get("start");
if (!start) {
    console.error("No start");
    process.exit(1);
}
const paths1 = findPaths(start, part1Condition);
// paths1.forEach(path => printPath(path)); // debug
console.log(paths1.length);
const paths2 = findPaths(start, part2Condition);
// paths2.forEach(path => printPath(path)); // debug
console.log(paths2.length);
