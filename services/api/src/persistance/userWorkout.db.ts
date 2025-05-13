import { prisma } from '../config/db.server';

async function getUserWorkoutId(userId: number, workoutId: number) {
  return (
    await prisma.userWorkout.findFirst({
      where: {
        userId: userId,
        workoutId: workoutId,
      },
    })
  )?.userWorkoutId;
}

async function addWorkoutToUserAccount(userId: number, workoutId: number) {
  await prisma.userWorkout.create({
    data: {
      userId: userId,
      workoutId: workoutId,
    },
  });
}

async function getAllUserWorkouts(
  userId: number,
  skip: number,
  pageSize: number,
  tagIds: number[] | null,
) {
  return await prisma.userWorkout.findMany({
    skip: skip,
    take: pageSize,
    where: {
      userId: userId,
      ...((tagIds && {
        workoutTemplate: {
          workoutTags: {
            some: {
              tag: {
                tagId: {
                  in: tagIds,
                },
              },
            },
          },
        },
      }) ||
        undefined),
    },
    select: {
      workoutTemplate: {
        select: {
          workoutId: true,
          name: true,
          workoutTags: {
            select: {
              tag: {
                select: {
                  name: true,
                },
              },
            },
          },
          workoutLevel: {
            select: {
              name: true,
            },
          },
        },
      },
    },
  });
}

async function countAllFilteredWorkouts(tagIds: number[] | null) {
  return await prisma.userWorkout.count({
    where: tagIds
      ? {
          workoutTemplate: {
            workoutTags: {
              some: {
                tag: {
                  tagId: {
                    in: tagIds,
                  },
                },
              },
            },
          },
        }
      : undefined,
  });
}

async function getAllWorkoutTags() {
  return await prisma.userWorkout.findMany({
    select: {
      workoutTemplate: {
        select: {
          workoutTags: {
            select: {
              tag: true,
            },
          },
        },
      },
    },
  });
}

async function getWorkoutIdsSavedByUser(userId: number) {
  return await prisma.userWorkout.findMany({
    where: {
      userId: userId || -1,
    },
    select: {
      workoutId: true,
    },
  });
}

async function isWorkoutSavedByUser(userId: number, workoutId: number) {
  return (
    (
      await prisma.userWorkout.findFirst({
        where: {
          userId: userId,
          workoutId: workoutId,
        },
        select: {
          workoutId: true,
        },
      })
    )?.workoutId === workoutId
  );
}

export {
  getUserWorkoutId,
  addWorkoutToUserAccount,
  getAllUserWorkouts,
  countAllFilteredWorkouts,
  getAllWorkoutTags,
  getWorkoutIdsSavedByUser,
  isWorkoutSavedByUser,
};
