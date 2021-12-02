import { processDataFromStdin, toParsedBasicCommands } from "../util/file_util";

const calculatePlannedCourse = (commands: [string, number][]) => {
    let position = 0;
    let depth = 0;

    commands.forEach(command => {
        if (command[0] === "forward") {
            position += command[1];
            return;
        }
        depth += command[1] * (command[0] === "up" ? -1 : 1);
    });

    return position * depth;
}

const calculateNewPlannedCourse = (commands: [string, number][]) => {
    let position = 0;
    let depth = 0;
    let aim = 0;

    commands.forEach(command => {
        if (command[0] === "forward") {
            position += command[1];
            depth += aim * command[1];
            return;
        }
        aim += command[1] * (command[0] === "up" ? -1 : 1);
    });

    return position * depth;
}

const commands = processDataFromStdin(toParsedBasicCommands);
console.log(`Part 1: ${calculatePlannedCourse(commands)}`);
console.log(`Part 2: ${calculateNewPlannedCourse(commands)}`);
