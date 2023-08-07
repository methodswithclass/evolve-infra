
if [ $# -lt 1 ]
    then
    echo "Missing argument:"
    echo "1. Environment: (dev|prod)"
    exit
fi


#npm clean-install


ENV=$1


cp stage_vars/cdk.$ENV.json cdk.json

rm -rf build/*

npm run bundle

cdk deploy