# Postgres

PostgreSQL database for general CRUD operations

## Running

To start container, run in the `services` directory

```bash
docker compose up
```

## Dev notes

Currently, our database doesn't persistence data (for dev purposes). Hence, to reset the state of the database, run:

```bash
docker compose down
docker compose up
```

To setup data persistence, uncomment this line (under the `postgres/volumes` section):

```yaml
- postgres-db-volume:/var/lib/postgresql/data
```

Setup scripts are placed in `services/postgres/setup.*` directory.

## Database

_Schema: [Lucid](https://lucid.app/lucidchart/72865ec2-e302-43c9-828b-27426595a02a/edit?invitationId=inv_f4be9ce7-aae7-470f-9af1-3a6f7f96cf15&page=0_0#)_

Tables:

- `app_user` - Stores all app users
- `workout_template` - Stores workout templates that users can create
- `tag` - Stores tags that can be added to workout templates
- `workout_tags` - Many-to-many table to store which tags are associated with a workout template
- `exercise_template_item` - Stores exercises that are part of a workout template. Contains basic information about the exercise like sets, reps, etc.
- `exercise` - Stores all exercises that users can add to their workouts
- `exercise_type` - Stores exercise types to specify what kind of attributes an exercise has
- `body_part` - Stores body parts to specify what body parts an exercise targets
- `exercise_body_part` - Many-to-many table to store which body parts an exercise targets
- `user_workout` - Stores workouts that where downloaded by user from workout templates
- `user_workout_log` - Stores logs of user workouts. Log is generated after finishing a workout and contains all information about the training session
- `user_exercise_history_item` - Stores history of user exercises. Each item is a single exercise that was done by user and contains all information about the exercise and progress that was made


## Prisma ORM

More info about Prisma can be found in [api / README.md](../api/README.md#prisma)