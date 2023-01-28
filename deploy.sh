#!/bin/sh

# Usage: deploy.sh [-s] 
#   noargs: Normal deploy without sounds
#   -s: Deploys sounds along with rest of app

npm run build

REMOTE_USER='kenny'
REMOTE_HOST='knet'
SSH_NICKNAME='knet'

REMOTE_SERVE_DIR=/var/www/lab2.kennybaron.net/html
REMOTE_BUILD_DIR=~/snek-build
# REMOTE_DIR='~'

echo "Copying to deployment site..."
ssh knet 'rm -rf ~/snek-build && mkdir ~/snek-build'
scp -r dist/* kenny@knet:"$REMOTE_BUILD_DIR"

# Sounds
# case "$1" in
# -s) ssh knet 'cd /var/www/lab2.kennybaron.net/html && mkdir -p game/assets/audio' && scp -r game/assets/audio/* kenny@knet:/var/www/lab2.kennybaron.net/html/game/assets/audio && echo "Sound files copied"
# ;;
# esac

echo "Deploying to virtual host..."
ssh -t knet "sudo rm -rf $REMOTE_SERVE_DIR/* && \
  sudo mv $REMOTE_BUILD_DIR/* $REMOTE_SERVE_DIR/"