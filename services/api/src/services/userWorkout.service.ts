import * as UserWorkoutDB from '../persistance/userWorkout.db';
import { PaginatedResponse } from '../types/api';
import { GeneralWorkout } from '../types/workout';

async function addWorkoutToUserAccount(userId: number, workoutId: number) {
  return await UserWorkoutDB.addWorkoutToUserAccount(userId, workoutId);
}

async function getAllUserWorkouts(
  userId: number,
  skip: number,
  page: number,
  pageSize: number,
  tagIds: number[] | null,
) {
  const workouts = (
    await UserWorkoutDB.getAllUserWorkouts(userId, skip, pageSize, tagIds)
  ).map((item) => item.workoutTemplate);

  const allWorkoutsCount = await UserWorkoutDB.countAllFilteredWorkouts(tagIds);

  const workoutsWithTagName: GeneralWorkout[] = workouts.map((workout) => {
    return {
      workoutId: workout.workoutId,
      name: workout.name,
      workoutTags: workout.workoutTags.map(
        (workoutTag) => workoutTag.tag.name || '',
      ),
      workoutLevel: workout.workoutLevel.name,
    };
  });

  const paginatedResponse: PaginatedResponse<GeneralWorkout> = {
    pageNo: page,
    totalPages: Math.ceil(allWorkoutsCount / pageSize),
    totalItems: allWorkoutsCount,
    pageSize,
    currentPageSize: workoutsWithTagName.length,
    data: workoutsWithTagName,
  };

  return paginatedResponse;
}

async function getAllWorkoutTags() {
  const tags = (await UserWorkoutDB.getAllWorkoutTags())
    .map((tag) =>
      tag.workoutTemplate.workoutTags.map((workoutTag) => workoutTag.tag),
    )
    .flat(1);

  const uniqueIds: number[] = [];
  return tags.filter((tag) => {
    if (uniqueIds.includes(tag.tagId)) {
      return false;
    }
    uniqueIds.push(tag.tagId);
    return true;
  });
}

export { addWorkoutToUserAccount, getAllUserWorkouts, getAllWorkoutTags };
