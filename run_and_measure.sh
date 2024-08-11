#!/bin/bash

# Variables for input file and output binary/executable
input_file="$1"
binary_file="$2"
INPUT_FILE="/usr/src/app/input.txt"

# Compile the code if necessary
if [ ! -z "$3" ]; then
    compile_command="$3"
    # echo "Compiling with command: $compile_command"
    eval "$compile_command"
    if [ $? -ne 0 ]; then
        echo "Compilation failed"
        exit 1
    fi
fi

# Measure the execution time
start_time=$(date +%s%N) # Record start time in nanoseconds
output=$(/usr/bin/time -f "%M" -o mem_usage.txt bash -c "$binary_file < $INPUT_FILE" 2>&1)
end_time=$(date +%s%N) # Record end time in nanoseconds

# Calculate runtime
runtime=$((end_time - start_time))
runtime_ms=$((runtime / 1000000)) # Convert nanoseconds to milliseconds

# Get memory usage
mem_usage=$(cat mem_usage.txt)

# Print output
# echo "Output:"
echo "$output"
echo "Execution time: ${runtime_ms} ms"
echo "Memory usage: ${mem_usage} KB"

# Clean up memory usage file
rm -f mem_usage.txt
