import * as UserDB from '../persistance/user.db';
import { PaginatedResponse } from '../types/api';
import { BaseUser, NewUserDetails, UserDetails } from '../types/user';
import * as CalendarDB from '../persistance/calendar.db';
import * as UserWorkoutLogDB from '../persistance/userWorkoutLog.db';
import ApiError from '../error/ApiError';

async function checkEmailUniqueness(email: string) {
  try {
    const user = await UserDB.getUserByEmail(email);
    return user === null;
  } catch (error) {
    return false;
  }
}

async function getAllUsers(
  page: number,
  skip: number,
  pageSize: number,
  userIdsToSkip: number[] = [],
): Promise<PaginatedResponse<BaseUser>> {
  const users: BaseUser[] = await UserDB.getAllUsers(
    skip,
    pageSize,
    userIdsToSkip,
  );

  const allWorkoutsCount = await UserDB.countAllUsers(userIdsToSkip);

  const paginatedResponse: PaginatedResponse<BaseUser> = {
    pageNo: page,
    totalPages: Math.ceil(allWorkoutsCount / pageSize),
    totalItems: allWorkoutsCount,
    pageSize,
    currentPageSize: users.length,
    data: users,
  };

  return paginatedResponse;
}

async function getUserDetails(userId: number): Promise<UserDetails | null> {
  const user = await UserDB.getUserById(userId);
  if (!user) {
    return null;
  }
  const deatils: UserDetails = {
    userId: user.userId,
    username: user.username,
    description: user.description,
  };
  return deatils;
}

async function addUserHeight(userId: number, height: number) {
  return await UserDB.addUserHeight(userId, height);
}

async function getUserHeight(userId: number) {
  return await UserDB.getUserHeight(userId);
}

async function getGender(userId: number) {
  return await UserDB.getGender(userId);
}

async function getStreak(userId: number) {
  const userCreationDate = await UserDB.getCreationDate(userId);

  if (!userCreationDate) {
    return 0;
  }

  const userAddedWorkouts = await CalendarDB.getAllEventsInRange(
    userId,
    userCreationDate.createdAt!,
    new Date(),
  );

  const userCompletedWorkouts =
    await UserWorkoutLogDB.getUserWorkoutLogs(userId);

  const makeUnique = (value: string, index: number, array: string[]) =>
    array.indexOf(value) === index;

  const addedWorkoutsDates = userAddedWorkouts
    .map((workout) => workout.datetime.toLocaleDateString())
    .filter(makeUnique);

  const completedWorkoutDates = userCompletedWorkouts
    .map((workout) => workout.logDate!.toLocaleDateString())
    .filter(makeUnique);

  let streak = 0;

  for (const date of addedWorkoutsDates) {
    streak = completedWorkoutDates.includes(date) ? streak + 1 : 0;
  }

  return streak;
}

async function updateUserProfileInfo(
  userId: number,
  userDetails: NewUserDetails,
) {
  const user = await UserDB.getUserById(userId);
  if (!user) {
    throw new ApiError(404, 'User not found');
  }

  if (user.email !== userDetails.email) {
    const emailIsUnique = await checkEmailUniqueness(userDetails.email);
    if (!emailIsUnique) {
      throw new ApiError(400, 'Email is already in use');
    }
  }

  if (
    userDetails.description !== null &&
    userDetails.description.length > 255
  ) {
    throw new ApiError(400, 'Description is too long');
  }

  return await UserDB.updateUserProfileInfo(userId, userDetails);
}

export {
  checkEmailUniqueness,
  getAllUsers,
  getUserDetails,
  addUserHeight,
  getUserHeight,
  getGender,
  getStreak,
  updateUserProfileInfo,
};
