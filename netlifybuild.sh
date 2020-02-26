#!/bin/bash

set -x
set -e

export CI=true

yarn build

cp ./_redirects build/

# ./node_modules/.bin/http-server build/ -p 8080 &>/dev/null &

# yarn test

# kill $(jobs -p)
