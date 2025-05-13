import { prisma } from '../config/db.server';

const exerciseItemSelector = {
  exerciseId: true,
  name: true,
  description: true,
  exerciseType: {
    select: {
      name: true,
    },
  },
  exercisesBodyParts: {
    select: {
      bodyPart: {
        select: {
          name: true,
        },
      },
    },
  },
};

async function getAllExercises() {
  const exercises = await prisma.exercise.findMany({
    select: exerciseItemSelector,
  });

  return exercises;
}

async function getExercisesByIds(ids: number[]) {
  const exercises = await prisma.exercise.findMany({
    select: exerciseItemSelector,
    where: {
      exerciseId: { in: ids },
    },
  });

  return exercises;
}

async function getExerciseDetails(exerciseId: number) {
  const exercises = await prisma.exercise.findUnique({
    where: {
      exerciseId: exerciseId,
    },
    select: {
      exerciseId: true,
      name: true,
      description: true,
      exerciseType: {
        select: {
          name: true,
        },
      },
      exercisesBodyParts: {
        select: {
          bodyPart: {
            select: {
              name: true,
            },
          },
        },
      },
      imageUrls: true,
    },
  });

  return exercises;
}

async function getAllExersiceTypes() {
  const exerciseTypes = await prisma.exerciseType.findMany({
    select: {
      name: true,
      hasReps: true,
      hasSets: true,
      hasWeights: true,
      hasTime: true,
      isBreak: true,
    },
  });
  return exerciseTypes;
}

export {
  getAllExercises,
  getExercisesByIds,
  getExerciseDetails,
  getAllExersiceTypes,
};
