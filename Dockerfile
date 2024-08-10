# Use alpine as the base image
FROM alpine:latest

# Install the necessary packages for running code and measuring runtime/memory
RUN apk add --no-cache gcc g++ make python3 openjdk11 bash

# Create a directory for your application
WORKDIR /usr/src/app

# Copy your script that will handle execution and measurement
COPY run_and_measure.sh /usr/src/app/

# Make sure the script is executable
RUN chmod +x /usr/src/app/run_and_measure.sh

# Command to run the script
CMD ["/usr/src/app/run_and_measure.sh"]
