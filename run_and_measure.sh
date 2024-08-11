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

# Measure execution time and memory usage
/usr/bin/time -f "Time: %e Memory: %M" bash -c "$binary_file < $INPUT_FILE" > output.txt 2>execution_stats.txt

# Debugging: Show the content of execution_stats.txt
# echo "Contents of execution_stats.txt:"
# cat execution_stats.txt

# Extract runtime and memory usage
stats=$(cat execution_stats.txt)

# Extract runtime and memory usage from the combined line
runtime=$(echo $stats | awk '{print $2}')
mem_usage=$(echo $stats | awk '{print $4}')

# Convert runtime from seconds to milliseconds
if [ ! -z "$runtime" ]; then
    runtime_ms=$(echo "$runtime * 1000" | bc)
fi

# Check if memory usage is empty
# if [ -z "$mem_usage" ]; then
#     mem_usage="0"
# fi

# Print the program output
output=$(cat output.txt)

# Print the captured output with proper formatting
printf "$output"
printf " _____ $runtime_ms"
printf " _____ $mem_usage"
# printf "$stats"

# Print execution time and memory usage
# printf "\n${runtime} ms"
# printf "\n${mem_usage} KB"

# Clean up temporary files
rm -f execution_stats.txt output.txt
