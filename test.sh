#!/bin/sh

max=25

DATA_DIR="./data/2021"

for i in `seq 1 $max`; do
    val=`printf %02d $i`
    if [ -d "$val" ]; then
        echo "Testing Day $val test"
        ./run.sh "$val" test | diff "${DATA_DIR}/$val/expected_test" -
        if [ "$?" != 0 ]; then
            >&2 echo "Day $val test file failed"
            exit 1
        fi
        for t in `seq 1 5`; do
            if [ -f "${DATA_DIR}/$val/expected_test$t" ]; then
                echo "Testing Day $val test $t"
                ./run.sh "$val" test $t | diff "${DATA_DIR}/$val/expected_test$t" -
                if [ "$?" != 0 ]; then
                    >&2 echo "Day $val test file $t failed"
                    exit 1
                fi
            fi
        done
        echo "Testing Day $val real"
        ./run.sh "$val" | diff "${DATA_DIR}/$val/expected" -
        if [ "$?" != 0 ]; then
            >&2 echo "Day $val failed"
            exit 1
        fi
        echo "Day $val passed!"
    fi
done
