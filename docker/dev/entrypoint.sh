#!/bin/bash
set -e

sed -i.bak "s@\(\"pathForProxy\": \"\)[^\"]*\"@\1${CORTEX}\"@" ./src/ep.config.json
sed -i.bak "s@\(\"scope\": \"\)[^\"]*\"@\1${STORE}\"@" ./src/ep.config.json

exec "$@"
