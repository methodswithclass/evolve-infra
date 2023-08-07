#!/bin/bash
set -e 

echo "beginning build process"

ENV=$1

rm -rf build/*

env-cmd -f .env.$ENV npm run build
aws s3 sync ./build s3://$ENV-evolve-infra-frontend

echo "done"