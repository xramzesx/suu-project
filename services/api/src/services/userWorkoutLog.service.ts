import * as UserWorkoutLogDB from '../persistance/userWorkoutLog.db';
import * as UserWorkout from '../persistance/userWorkout.db';
import { ExerciseHistoryItem } from '../types/exerciseHistoryItem';

async function createWorkoutLog(
  workoutId: number,
  opinion: number,
  exercises: ExerciseHistoryItem[],
  userId: number,
  eventId?: number | null,
) {
  function parseOpinion(value: number): number {
    if (value < 0) {
      return -1;
    }
    if (value > 0) {
      return 1;
    }
    return 0;
  }

  const workoutOpinion = parseOpinion(opinion);
  const workoutExercises = exercises.map((exercise) => ({
    ...exercise,
    opinion: parseOpinion(exercise.opinion),
  }));

  const userWorkoutId = await UserWorkout.getUserWorkoutId(userId, workoutId);

  if (userWorkoutId === undefined) {
    throw null;
  }

  return await UserWorkoutLogDB.createWorkoutLog(
    workoutId,
    userWorkoutId,
    workoutOpinion,
    workoutExercises,
    userId,
    eventId,
  );
}

export { createWorkoutLog };
