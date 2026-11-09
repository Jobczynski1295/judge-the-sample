#!/usr/bin/env bash
set -e

cd "$(dirname "$0")/web"

if [ ! -d node_modules ]; then
    npm install
fi

npm run dev -- --host 127.0.0.1
