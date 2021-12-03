#!/bin/sh

max=25

for i in `seq 1 $max`; do
    val=`printf %02d $i`
    if [ -d "$val" ]; then
        ./run.sh "$val" test | diff "$val/expected_test.txt" -
        if [ "$?" != 0 ]; then
            >&2 echo "Day $val test file failed"
            exit 1
        fi
        ./run.sh "$val" | diff "$val/expected.txt" -
        if [ "$?" != 0 ]; then
            >&2 echo "Day $val failed"
            exit 1
        fi
    fi
done
