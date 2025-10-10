#!/bin/bash

# starter script

IMAGE="phpshare"



# try attach already running container
ID=$(docker ps |awk /${IMAGE}/'{print $1}')

if [ "$ID" ] ; then
    exit 0
fi

# try attach already sleepy container
ID=$(docker ps -a |awk /${IMAGE}/'{print $1}')

if [ "$ID" ] ; then
    # wake up !
    docker restart "$ID"
    exit 0
fi

# start a new container
docker run \
    -it \
    --rm \
    -v $PWD:/var/www/html \
    -p 8080:8080 \
    ${IMAGE}


