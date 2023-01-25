#! /bin/bash

DIR="$1"/snek
echo $DIR

rm -rf $DIR
mkdir -p $DIR
cp index.html index.css $DIR

GAMEBUNDLE=$(find ./dist/assets/ -regex ".*index.*\.js$")
cp $GAMEBUNDLE $DIR/index.js

mkdir -p $DIR/game/assets/audio
cp game/assets/audio/* $DIR/game/assets/audio