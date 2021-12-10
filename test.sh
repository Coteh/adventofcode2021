#!/bin/sh

max=25

for i in `seq 1 $max`; do
    val=`printf %02d $i`
    if [ -d "$val" ]; then
        echo "Testing Day $val test"
        ./run.sh "$val" test | diff "$val/expected_test" -
        if [ "$?" != 0 ]; then
            >&2 echo "Day $val test file failed"
            exit 1
        fi
        if [ -f "$val/expected_test2" ]; then
            echo "Testing Day $val test 2"
            ./run.sh "$val" test 2 | diff "$val/expected_test2" -
            if [ "$?" != 0 ]; then
                >&2 echo "Day $val test file 2 failed"
                exit 1
            fi
        fi
        echo "Testing Day $val real"
        ./run.sh "$val" | diff "$val/expected" -
        if [ "$?" != 0 ]; then
            >&2 echo "Day $val failed"
            exit 1
        fi
        echo "Day $val passed!"
    fi
done
