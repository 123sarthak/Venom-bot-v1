#!/bin/bash

# Install ffmpeg (via apt)
apt-get update && apt-get install -y ffmpeg

# Install Python deps
pip3 install -r requirements.txt

# Install Node.js deps
npm install 