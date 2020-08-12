#!/bin/bash

set -x
set -e

export CI=true

npm cache clean --force

npm rebuild

rm -rf node_modules

yarn build

cp ./_redirects build/

# ./node_modules/.bin/http-server build/ -p 8080 &>/dev/null &

# yarn test

# kill $(jobs -p)
