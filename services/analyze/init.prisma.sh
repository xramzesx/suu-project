#!/bin/bash

pip install prisma

DATABASE_URL=postgresql://$( \
    cat ../secrets/postgres_user.txt
):$( \
    cat ../secrets/postgres_password.txt \
)@$( \
    echo $DATABASE_ADDRESS \
)/$( \
    cat ../secrets/postgres_db.txt \
)

DATABASE_URL=$DATABASE_URL npx prisma db pull

yarn prisma:generate