#!/bin/bash

set -x
set -e

export CI=true

# cat src/ep.config.json | jq \
#   --arg SCOPE "$CORTEX_SCOPE" \
#   --arg PATH "$CORTEX_PATH" \
#   '.cortexApi.scope = $SCOPE | .cortexApi.path = $PATH' \
#   > src/ep.config.json.temp

# mv src/ep.config.json.temp src/ep.config.json

yarn build

# cp ./_redirects build/

# ./node_modules/.bin/http-server build/ -p 8080 &>/dev/null &

# yarn test

# kill $(jobs -p)
