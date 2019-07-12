#!/bin/bash
set -e

sed -i.bak "s@\(\"pathForProxy\": \"\)[^\"]*\"@\1${CORTEX}\"@" ./app/src/ep.config.json
sed -i.bak "s@\(\"scope\": \"\)[^\"]*\"@\1${STORE}\"@" ./app/src/ep.config.json

exec "$@"
