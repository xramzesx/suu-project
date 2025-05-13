#!/bin/bash

PROTO_DIR=$(pwd -W 2>/dev/null)

if [[ $? -ne 0 ]]; then
    PROTO_DIR=$(pwd)
fi

DOCKER_NAMELY_IMAGES_COUNT=`docker images | grep namely/protoc-all | wc -l`

if [[ $DOCKER_NAMELY_IMAGES_COUNT -ge 1 ]]; then
    ## Fetch protoc compilation container
    docker pull namely/protoc-all:latest
fi

docker run --rm \
    -v $PROTO_DIR:/defs \
    namely/protoc-all \
    --with-pyi \
    -f ./src/*.proto \
    -o generated/python \
    -l python

mv ./generated/python/src/* ./generated/python/
rm -rf ./generated/python/src
rm -rf ./generated/__init__.py

sed -i -e 's/import src./import src.proto./g' ./generated/python/*
sed -i -e 's/from src/from src.proto/g' ./generated/python/*
