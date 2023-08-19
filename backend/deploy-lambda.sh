funcName=$1
lambdaName=dev-evolve-infra-$funcName

rm -rf build/*

npm run bundle

cd ./build/$funcName

zip -r $funcName.zip *

aws lambda update-function-code --function-name $lambdaName --zip-file fileb://$funcName.zip