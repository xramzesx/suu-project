import { ExerciseHistoryItem } from '../types/exerciseHistoryItem';
import { prisma } from '../config/db.server';
import { createEvent } from './calendar.db';

async function getProperEventId(
  userId: number,
  workoutId: number,
  timestamp: Date,
  eventId?: number | null,
) {
  if (eventId !== null && eventId !== undefined) {
    const userWorkoutLog = await prisma.userWorkoutLog.findFirst({
      where: {
        eventId: eventId,
      },
    });

    if (userWorkoutLog === null || userWorkoutLog === undefined) {
      return eventId;
    }
  }

  const { events } = await createEvent(userId, {
    workoutId: workoutId,
    repeatCount: 0,
    repeatFrequency: 0,
    repeatUnit: 'day',
    datetime: timestamp,
  });

  return events[0].eventId;
}

async function createWorkoutLog(
  workoutId: number,
  userWorkoutId: number,
  opinion: number,
  exercises: ExerciseHistoryItem[],
  userId: number,
  eventId?: number | null,
) {
  const timeStamp = new Date();

  const calendarEventId = await getProperEventId(
    userId,
    workoutId,
    timeStamp,
    eventId,
  );

  const log = await prisma.userWorkoutLog.create({
    data: {
      userWorkoutId: userWorkoutId,
      opinion: opinion,
      logDate: timeStamp,
      eventId: calendarEventId,
    },
  });

  exercises.forEach(async (exercise) => {
    await prisma.userExerciseHistoryItem.create({
      data: {
        exerciseTemplateItemId: exercise.exerciseTemplateItemId,
        userLogId: log.logId,
        exerciseId: exercise.exerciseId,
        opinion: exercise.opinion,
        value: exercise.value,
        orderIndex: exercise.orderIndex,
        timestamp: timeStamp,
      },
    });
  });

  return log;
}

async function getUserWorkoutLogs(userId: number) {
  return await prisma.userWorkoutLog.findMany({
    where: {
      userWorkout: {
        userId: userId,
      },
    },
    orderBy: {
      logDate: 'desc',
    },
    include: {
      userWorkout: true,
    },
  });
}

export { createWorkoutLog, getUserWorkoutLogs };
