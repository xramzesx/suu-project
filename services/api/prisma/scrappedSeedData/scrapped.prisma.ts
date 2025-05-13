import { Prisma } from '@prisma/client';
import { prisma } from '../../src/config/db.server';

import exercisesJson from './data/exercises.json';
import workoutsJson from './data/workout.json';

const datasetBodyParts = [
  'abdominals',
  'abductors',
  'adductors',
  'biceps',
  'calves',
  'chest',
  'forearms',
  'glutes',
  'hamstrings',
  'lats',
  'lower back',
  'middle back',
  'neck',
  'quadriceps',
  'shoulders',
  'traps',
  'triceps',
];

const datasetWorkoutTags = [
  'Men',
  'Muscle-building',
  'Home',
  'Strength',
  'Beginner',
  'Fat-loss',
  'Women',
  'FBW',
  'Celebrity',
  'Bodyweight',
  'Other',
  'Legs',
  'Abs',
  'Sports',
  'Back',
  'Shoulders',
  'Cardio',
  'Chest',
  'Biceps',
  'Triceps',
];

export async function seedBodyPartsAndReturnIds() {
  const bodyPartsIds: Record<string, number> = {};

  const existingBodyParts = await prisma.bodyPart.findMany({
    where: {
      name: {
        in: datasetBodyParts,
      },
    },
  });
  const existingBodyPartsNames = existingBodyParts.map(({ name }) => name);

  const remainingBodyPartsNames = datasetBodyParts.filter(
    (part) => !existingBodyPartsNames.includes(part),
  );

  const remainingBodyParts = await prisma.bodyPart.createManyAndReturn({
    data: remainingBodyPartsNames.map((name) => ({
      name,
    })),
  });

  for (const { bodyPartId, name } of existingBodyParts) {
    bodyPartsIds[name] = bodyPartId;
  }

  for (const { bodyPartId, name } of remainingBodyParts) {
    bodyPartsIds[name] = bodyPartId;
  }

  console.log('[scrapped] Body parts seeded');

  return bodyPartsIds;
}

export async function seedWorkoutTagsAndReturnIds() {
  const tagsIds: Record<string, number> = {};

  const existingTags = await prisma.tag.findMany({
    where: {
      name: {
        in: datasetWorkoutTags,
      },
    },
  });

  const existingTagsNames = existingTags.map(({ name }) => name);

  const remainingTagsNames = datasetWorkoutTags.filter(
    (tag) => !existingTagsNames.includes(tag),
  );

  const remainingTags = await prisma.tag.createManyAndReturn({
    data: remainingTagsNames.map((name) => ({
      name,
    })),
  });

  for (const { tagId, name } of existingTags) {
    // eslint-disable-next-line @typescript-eslint/no-extra-non-null-assertion
    tagsIds[name!!] = tagId;
  }

  for (const { tagId, name } of remainingTags) {
    // eslint-disable-next-line @typescript-eslint/no-extra-non-null-assertion
    tagsIds[name!!] = tagId;
  }

  console.log('[scrapped] Tags seeded');

  return tagsIds;
}

async function getUsedExerciseTypes() {
  const repsType = await prisma.exerciseType.findFirst({
    where: { name: 'reps' },
  });

  const timeType = await prisma.exerciseType.findFirst({
    where: { name: 'time' },
  });

  const weightsType = await prisma.exerciseType.findFirst({
    where: { name: 'weights' },
  });

  return {
    // eslint-disable-next-line
    reps: repsType?.exerciseTypeId!!,
    // eslint-disable-next-line
    time: timeType?.exerciseTypeId!!,
    // eslint-disable-next-line
    weights: weightsType?.exerciseTypeId!!,
  };
}

async function seedScrappedExercisesAndReturn() {
  const bodyPartsIds = await seedBodyPartsAndReturnIds();

  const exercisesJsonIds: Record<string, number> = {};
  const exerciseTypesIds = await getUsedExerciseTypes();

  const exercises = await prisma.exercise.createManyAndReturn({
    data: exercisesJson.map((exercise) => {
      return {
        name: exercise.name,
        exerciseTypeId:
          exerciseTypesIds[exercise.type as 'time' | 'reps' | 'weights'],
        description: exercise.description,
        imageUrls: exercise.images.map(
          (path) => `http://localhost:3000/assets?file=/exercises/${path}`,
        ),
      };
    }),
  });

  console.log('[scrapped] Exercises seeded');

  for (const index in exercises) {
    const { exerciseId } = exercises[index];
    const { bodyParts } = exercisesJson[index];

    await prisma.exercisesBodyParts.createMany({
      data: bodyParts.map((part) => ({
        bodyPartId: bodyPartsIds[part],
        exerciseId,
      })),
    });
  }

  console.log('[scrapped] Exercises bodyparts seeded');

  for (const index in exercises) {
    const { id } = exercisesJson[index];
    const { exerciseId } = exercises[index];

    exercisesJsonIds[id] = exerciseId;
  }

  return exercisesJsonIds;
}

const getWorkoutLevelId = async (name: string) => {
  const workoutLevel = await prisma.workoutLevel.findFirst({
    where: { name },
  });
  return workoutLevel?.levelId;
};

const getWorkoutLevelIds = async () => ({
  beginner: await getWorkoutLevelId('beginner'),
  medium: await getWorkoutLevelId('medium'),
  hardcore: await getWorkoutLevelId('hardcore'),
});

async function seedWorkouts() {
  const exercisesIds = await seedScrappedExercisesAndReturn();

  const workoutLevelMapper = await getWorkoutLevelIds();

  const workoutTagsIds = await seedWorkoutTagsAndReturnIds();

  const adminUser = await prisma.appUser.findFirst({
    where: { username: 'admin' },
  });

  // eslint-disable-next-line
  const adminId = adminUser?.userId!!;

  const workouts = await prisma.workoutTemplate.createManyAndReturn({
    data: workoutsJson.map((workout) => ({
      authorId: adminId,
      source: workout.source,
      name: workout.title,
      description: workout.description,
      workoutLevelId:
        // eslint-disable-next-line @typescript-eslint/no-extra-non-null-assertion
        workoutLevelMapper[
          workout.level as 'beginner' | 'medium' | 'hardcore'
        ]!!,
      createdAt: new Date(),
      private: false,
    })),
  });

  console.log('[scrapped] Workouts seeded');

  for (const index in workouts) {
    const { workoutId } = workouts[index];
    const { exercises } = workoutsJson[index];

    await prisma.exerciseTemplateItem.createMany({
      data: exercises.map((exercise, order) => {
        const value: {
          reps?: number;
          sets?: number;
          time?: number;
          weight?: number;
          breakTime?: number;
        } = {};

        if ('reps' in exercise) {
          value.reps = exercise.reps;
        }

        if ('sets' in exercise) {
          value.sets = exercise.sets;
        }

        if ('time' in exercise) {
          value.time = exercise.time;
        }

        if ('weight' in exercise) {
          value.weight = exercise.weight;
        }

        if ('breakTime' in exercise) {
          value.breakTime = exercise.breakTime;
        }

        return {
          workoutTemplateId: workoutId,
          exerciseId: exercisesIds[exercise.id],
          orderIndex: order + 1,
          value: JSON.stringify(value) as Prisma.InputJsonValue,
        };
      }),
    });
  }

  console.log('[scrapped] Workout exercises seeded');

  for (const index in workouts) {
    const { workoutId } = workouts[index];

    await prisma.workoutTags.createMany({
      data: workoutsJson[index].tags.map((tag) => ({
        tagId: workoutTagsIds[tag],
        workoutTemplateId: workoutId,
      })),
    });
  }

  console.log('[scrapped] Workouts tags seeded');
}

export default async function seedScrappedData() {
  await seedWorkouts();
}
