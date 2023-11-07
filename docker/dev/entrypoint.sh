#!/bin/bash
set -e

sed -i.bak "s@\(\"pathForProxy\": \"\)[^\"]*\"@\1${CORTEX}\"@" ./src/ep.config.json
sed -i.bak "s@\(\"headerXForwardedBase\": \"\)[^\"]*\"@\1${HEADER_X_FORWARDED_BASE}\"@" ./src/ep.config.json
sed -i.bak "s@\(\"scope\": \"\)[^\"]*\"@\1${STORE}\"@" ./src/ep.config.json

exec "$@"
