#!/bin/bash
set -e

# Install npm dependencies (if required)
npm i 
npm install -D webpack-cli 

# Install dependencies for ffmpeg
sudo apt-get update
sudo apt-get install -y make gcc yasm libx264-dev

# Download and extract ffmpeg
wget https://ffmpeg.org/releases/ffmpeg-snapshot.tar.bz2
tar xjvf ffmpeg-snapshot.tar.bz2
pushd ffmpeg

# Configure and build ffmpeg
./configure --enable-gpl --enable-libx264
make
sudo make install

# Return to original directory
popd

# Build project files
npx webpack

# Optional: Clean up
rm ffmpeg-snapshot.tar.bz2
rm -rf ffmpeg
