#!/bin/sh
set -o nounset -o errexit
cd `dirname $0`

# Install packages
npm install

# Start prod mode
NODE_ENV=production node api/index.js