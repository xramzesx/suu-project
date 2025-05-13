#!/bin/bash

if [ ! -f .env ]; then 
    touch .env
fi

if ! grep -q DATABASE_URL .env; then
    echo \n >> .env
    echo DATABASE_URL=postgresql://$(
        cat /run/secrets/postgres_user 
    ):$(
        cat /run/secrets/postgres_password
    )@$(
        echo $DATABASE_ADDRESS
    )/$(
        cat /run/secrets/postgres_db
    ) >> .env

    echo \n >> .env
    echo ASSET_SERVICE_PASSWORD=$(
        cat /run/secrets/asset_service_password 
    ) >> .env
fi