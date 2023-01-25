#!/bin/bash

# superceded by simply using vite, package.json, and .env file

rm -rf ./env.js
touch ./env-config.js

echo "window._env_ = {" >> ./env.js

# read each line in .env file
# each line represents key=value pairs
while read -r line || [[ -n "$line" ]];
do
  # Split env var by character `=`
  if printf '%s\n' "$line" | grep -q -e '='; then
    varname=$(printf '%s\n' "$line" | sed -e 's/=.*//')
    varvalue=$(printf '%s\n' "$line" | sed -e 's/^[^=]*=//')
  fi

  # read value of current variable if exists as env var
  value=$(printf '%s\n' "${!varname}")
  # otherwise use value from .env file
  [[ -z $value ]] && value=${varvalue}

  # append configuration property to JS file
  echo " $varname: \"$value\"," >> ./env.js
done < .env

echo "}" >> ./env.js
