#!/usr/bin/env bash

BRANCH=$(git rev-parse --abbrev-ref HEAD)

if [ "$BRANCH" = "gh-pages" ]; then
  yarn build
  mv ./build/* .
  rm -rf ./build
fi
