#!/bin/sh

NODE=`which node`
NPM=`which npm`
YARN=`which yarn`
JQ=`which jq`

echo $NODE $NPM $YARN $JQ

if [[ ! -z "$NODE" ]]; then
  echo "Node is installed and it's version is: `$NODE --version`"
else
  echo "Please, install node.js."
  exit 1
fi

if [[ ! -z "$NPM" ]]; then
  echo "NPM is installed and it's version is: `$NPM --version`"
else
  echo "Please, install npm."
  exit 1
fi

if [[ ! -z "$YARN" ]]; then
  echo "yarn is installed and it's version is: `$YARN --version`"
else
  echo "yarn is optional."
fi

if [[ ! -z "$JQ" ]]; then
  echo "jq is installed and it's version is: `$JQ --version`"
else
  echo "jq is optional and used only for publish purpose."
fi

npm install -g gitbook-cli
