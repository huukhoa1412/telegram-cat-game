#!/bin/bash
apt update && apt install xdotool -y
while true; do
    # Get the list of window IDs
    window_ids=($(xdotool search --all --title "chromium" 2>/dev/null))

    # Display the length of window_ids
    _len=0
    for id in "${window_ids[@]}"; do
        ((_len++))
        xdotool windowactivate $id
        sleep 3
        #xdotool windowminimize $id
    done

    echo "Number of window IDs: $_len"

    # Sleep for 20 seconds
    sleep 20
done
