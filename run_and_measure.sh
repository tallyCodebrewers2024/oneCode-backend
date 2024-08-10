#!/bin/bash

# The script takes in two arguments: the file name and the run command
CODE_FILE="$1"
RUN_CMD="$2"

# Compile the code if necessary (you can extend this part based on the language)
if [[ "$CODE_FILE" == *.c ]]; then
    gcc "$CODE_FILE" -o code_exec
    RUN_CMD="./code_exec"
elif [[ "$CODE_FILE" == *.cpp ]]; then
    g++ "$CODE_FILE" -o code_exec
    RUN_CMD="./code_exec"
elif [[ "$CODE_FILE" == *.java ]]; then
    javac "$CODE_FILE"
    RUN_CMD="java Main"
fi

# Measure time and memory usage
/usr/bin/time -v $RUN_CMD
