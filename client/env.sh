#!/bin/sh

# Set environment variables
export NODE_OPTIONS=--openssl-legacy-provider

# Create a symbolic link
ln -sfn /app/shared /app/client/src/

# Execute the command provided to the Docker container
exec "$@"