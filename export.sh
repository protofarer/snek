#! /bin/bash

# 1st arg: path to project's /public dir
TARGET_DIR="$1"

rm -rf "$TARGET_DIR/"

# use vite artifacts
LOCAL_BUILD_DIR=./dist

## TODO getops and rsync to exclude assets/*.wav
rsync -av "$LOCAL_BUILD_DIR/" "$TARGET_DIR/"

cp -r ./icons "$TARGET_DIR/icons"