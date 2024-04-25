#!/bin/bash

read -p "Enter the number of profiles: " numOfProfile

# Read proxies from file
proxys=()
while IFS= read -r line; do
  proxys+=("$line")
done < /root/proxy.txt

# Create profiles and run Chrome with DevTools for each profile
for ((i=0; i<numOfProfile; i++)); do
  profile_name="Profile $((i+1))"
  if [ ! -d "$profile_name" ]; then
    mkdir "$profile_name"
  fi

  /opt/chrome-linux/chrome --no-sandbox --user-data-dir="$profile_name" --proxy-server="http://${proxys[i]}" --auto-open-devtools-for-tabs "https://game.catizen.ai" &
done
