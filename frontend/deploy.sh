#!/bin/bash
set -e 

echo "beginning build process"

ENV=$1

if [ $ENV == "dev" ]; then
    DIST=E18E8JKGIEHM0A
else
    DIST=E2DGAOCZZJLKRZ
fi

rm -rf build/*

env-cmd -f .env.$ENV npm run build
aws s3 sync ./build s3://$ENV-evolve-infra-frontend

aws cloudfront create-invalidation --distribution-id $DIST --paths "/*"

echo "done"