#!/bin/bash

cat src/ep.config.json | jq \
  --arg SCOPE "$CORTEX_SCOPE" \
  --arg PROXY "$CORTEX_PATH" \
  '.cortexApi.scope = $SCOPE | .cortexApi.pathForProxy = $PROXY' \
  > src/ep.config.json.temp

mv src/ep.config.json.temp src/ep.config.json

yarn build

cp src/ep.config.json build/ep.config.json

