import { Prisma } from '@prisma/client';
import { prisma } from '../../src/config/db.server';
import { NewWorkoutTemplate } from '../../src/types/workout';
import { WorkoutTag } from '../../src/types/workout';

export default async function seedWorkouts() {
  const workoutTemplates = await prisma.workoutTemplate.findMany();
  if (workoutTemplates.length === 0) {
    await Promise.all(
      getWorkoutTemplates().map(async (workoutTemplate) => {
        await prisma.workoutTemplate.create({
          data: {
            authorId: workoutTemplate.authorId,
            name: workoutTemplate.name,
            description: workoutTemplate.description,
            createdAt: workoutTemplate.createdAt,
            private: workoutTemplate.private,
            workoutLevelId: workoutTemplate.workoutLevelId,
          },
        });
      }),
    );
    console.log('Workout templates seeded');
  }

  const exerciseTemplateItems = await prisma.exerciseTemplateItem.findMany();
  if (exerciseTemplateItems.length === 0) {
    await Promise.all(
      getExerciseTemplateItems().map(async (exerciseTemplateItem) => {
        const exercise = await prisma.exercise.findFirst({
          where: {
            name: exerciseTemplateItem.exerciseName,
          },
          select: {
            exerciseId: true,
          },
        });
        if (exercise) {
          await prisma.exerciseTemplateItem.create({
            data: {
              workoutTemplateId: exerciseTemplateItem.workoutTemplateId,
              exerciseId: exercise.exerciseId,
              value: exerciseTemplateItem.value as Prisma.InputJsonValue,
              orderIndex: exerciseTemplateItem.orderIndex,
            },
          });
        }
      }),
    );
    console.log('Exercise template items seeded');
  }

  const workoutTags = await prisma.workoutTags.findMany();
  if (workoutTags.length === 0) {
    await Promise.all(
      getWorkoutTags().map(async (workoutTag) => {
        await prisma.workoutTags.create({
          data: {
            tagId: workoutTag.tagId,
            workoutTemplateId: workoutTag.workoutTemplateId,
          },
        });
      }),
    );
    console.log('Workout tags seeded');
  }
}

function getWorkoutTemplates(): NewWorkoutTemplate[] {
  return [
    {
      authorId: 1,
      name: 'Giga workout',
      description:
        'Professional workout dedicated for gym lovers that focuses on all muscle groups',
      createdAt: new Date(),
      private: false,
      workoutLevelId: 1,
    },
    {
      authorId: 1,
      name: '"the timetable is known" type of workout',
      description: 'Lets gooooo!',
      createdAt: new Date(),
      private: false,
      workoutLevelId: 4,
    },
  ];
}

type NewExerciseTemplateItemSeed = {
  workoutTemplateId: number;
  exerciseName: string;
  value: Prisma.JsonValue;
  orderIndex: number;
};

function getExerciseTemplateItems(): NewExerciseTemplateItemSeed[] {
  return [
    // workout 1
    {
      workoutTemplateId: 1,
      exerciseName: 'Push ups',
      value: JSON.stringify({
        sets: 3,
        reps: 15,
        breakTime: 60,
      }),
      orderIndex: 1,
    },
    {
      workoutTemplateId: 1,
      exerciseName: 'Interval running',
      value: JSON.stringify({
        time: 1000,
        breakTime: 120,
      }),
      orderIndex: 2,
    },
    {
      workoutTemplateId: 1,
      exerciseName: 'Deadlifts',
      value: JSON.stringify({
        sets: 3,
        reps: 10,
        weight: 80,
        breakTime: 60,
      }),
      orderIndex: 3,
    },
    // workout 2
    {
      workoutTemplateId: 2,
      exerciseName: 'Pull ups',
      value: JSON.stringify({
        sets: 4,
        reps: 5,
        breakTime: 60,
      }),
      orderIndex: 1,
    },
    {
      workoutTemplateId: 2,
      exerciseName: 'Squats',
      value: JSON.stringify({
        sets: 3,
        reps: 10,
        breakTime: 60,
      }),
      orderIndex: 2,
    },
    {
      workoutTemplateId: 2,
      exerciseName: 'Rest',
      value: JSON.stringify({
        breakTime: 240,
      }),
      orderIndex: 3,
    },
  ];
}

function getWorkoutTags(): WorkoutTag[] {
  return [
    {
      tagId: 1,
      workoutTemplateId: 1,
    },
    {
      tagId: 2,
      workoutTemplateId: 1,
    },
    {
      tagId: 3,
      workoutTemplateId: 2,
    },
    {
      tagId: 4,
      workoutTemplateId: 2,
    },
    {
      tagId: 5,
      workoutTemplateId: 2,
    },
  ];
}
