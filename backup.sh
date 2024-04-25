#!/bin/bash

CONTAINER_NAME="chrome-novnc"  # Replace with the actual name of your Docker container
SOURCE_PATH="/root/.config/chromium"  # Replace with the source path inside the container
DESTINATION_PATH="."  # Replace with the destination path on your host machine

docker cp "$CONTAINER_NAME:$SOURCE_PATH" "$DESTINATION_PATH"
