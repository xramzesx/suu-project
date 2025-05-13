#!/bin/bash

### CREATE TEMPORARY DIRECTORY ###
mkdir generated

### BUILD MODULES ####
if command -v sudo 2>&1 >/dev/null
then
    ./scripts/build.node.sh
    ./scripts/build.python.sh
fi

### COMMON DIRS ###
PROTO_DIR_ANALIZE=../analyze/src/proto
PROTO_DIR_API=../api/src/proto

### CLEANUP OLD DIRECTORIES ###
if command -v sudo 2>&1 >/dev/null
then
    sudo rm -rf $PROTO_DIR_API
    sudo rm -rf $PROTO_DIR_ANALIZE
else
    rm -rf $PROTO_DIR_API
    rm -rf $PROTO_DIR_ANALIZE
fi

### CREATE DIRECTORIES ###
mkdir $PROTO_DIR_ANALIZE
mkdir $PROTO_DIR_API

### MOVE GENERATED FILES TO PROPER SERVICES ###
mv ./generated/python/* $PROTO_DIR_ANALIZE
mv ./generated/node/* $PROTO_DIR_API

### CLEANUP ###
rm -rf ./generated
