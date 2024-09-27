#!/bin/sh

RED="\033[0;31m"
GREEN="\033[0;32m"
NC="\033[0m"

CHECK="\xE2\x9C\x94"
X="\xE2\x9D\x8C"

testDay () {
    day=$1
    fileNo=$2
    subcmd=""
    fileSuffix=""
    if [ "$fileNo" = 0 ]; then
        echo "Testing Day $day real"
    elif [ "$fileNo" = 1 ]; then
        echo "Testing Day $day test"
        subcmd="test"
        fileSuffix="_test"
    else
        echo "Testing Day $day test $fileNo"
        subcmd="test $fileNo"
        fileSuffix="_test$fileNo"
    fi
    # Run the test in subshell with echoing enabled (the "set -x" part)
    # fixes both "set +x" having to be echoed and "set +x" overriding return code from test
    # https://stackoverflow.com/a/19392242
    ( set -x; ./run.sh "$day" $subcmd | diff "$day/expected$fileSuffix" - )
    if [ "$?" != 0 ]; then
        >&2 echo "${RED}Day $day $subcmd failed${NC} ${X}"
        return 1
    fi
    echo "${GREEN}Day $day $subcmd passed!${NC}"
    return 0
}

if [ "$#" -gt "0" ]; then
    testDay $@
    exit $?
fi

max=25

for i in `seq 1 $max`; do
    day=`printf %02d $i`
    if [ -d "$day" ]; then
        for t in `seq 1 5`; do
            if [ $t = 1 ] || [ -f "$day/expected_test$t" ]; then
                testDay $day $t
                if [ "$?" != 0 ]; then
                    exit 1
                fi
            fi
        done
        testDay $day 0
        if [ "$?" != 0 ]; then
            exit 1
        fi
        echo "${GREEN}All tests in day $day passed!${NC} ${CHECK}"
    fi
done
