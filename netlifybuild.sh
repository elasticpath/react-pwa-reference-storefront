#!/bin/bash

cat src/ep.config.json | jq \
  --arg SCOPE "$CORTEX_SCOPE" \
  --arg PATH "$CORTEX_PATH" \
  '.cortexApi.scope = $SCOPE | .cortexApi.path = $PATH' \
  > src/ep.config.json.temp

mv src/ep.config.json.temp src/ep.config.json

yarn build

