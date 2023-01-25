#!/bin/sh

# Usage: deploy.sh [-s] 
#   noargs: Normal deploy without sounds
#   -s: Deploys sounds along with rest of app

npm run build

REMOTE_USER='kenny'
REMOTE_HOST='knet'
SSH_NICKNAME='knet'

# REMOTE_DIR='~'

ssh knet 'rm -rf ~/snek-build && mkdir -p ~/snek-build'
# ssh knet 'mkdir -p ~/snek-build'

echo "Copying to deployment site..."
# Web stuff
scp index.html kenny@knet:~/snek-build/index.html
scp index.css kenny@knet:~/snek-build/index.css

# Game
GAMEBUNDLE=$(find ./dist/assets/ -regex ".*index.*\.js$")
scp $GAMEBUNDLE kenny@knet:~/snek-build/index.js

# Sounds
case "$1" in
-s) ssh knet 'cd /var/www/lab2.kennybaron.net/html && mkdir -p game/assets/audio' && scp -r game/assets/audio/* kenny@knet:/var/www/lab2.kennybaron.net/html/game/assets/audio && echo "Sound files copied"
;;
esac

echo "Deploying to virtual host..."
ssh -t knet "cd /var/www/lab2.kennybaron.net/html \
  && sudo rm index.js index.html index.css \
  && sudo mv ~/snek-build/* /var/www/lab2.kennybaron.net/html/"