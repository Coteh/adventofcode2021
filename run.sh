#!/bin/sh

if [ "$#" == 0 ]; then
    >&2 echo "usage: ./run.sh <day> [|test]"
    exit 1
fi

INPUT_FILENAME="input"

if [ "$2" == "test" ]; then
    INPUT_FILENAME="input_test$3"
fi

if [ ! -f "$1/$INPUT_FILENAME" ]; then
    >&2 echo "$1/$INPUT_FILENAME missing: Please provide your input file"
    exit 1
fi

cat "$1/$INPUT_FILENAME" | ./node_modules/.bin/ts-node "$1/$1.ts"
