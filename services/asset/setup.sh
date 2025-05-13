#!/bin/bash

if [ ! -f .env ]; then 
    touch .env
fi

if ! grep -q DATABASE_URL .env; then
    echo \n >> .env
    echo ASSET_SERVICE_PASSWORD=$(
        cat /run/secrets/asset_service_password 
    ) >> .env
fi
