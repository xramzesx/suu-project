import { prisma } from '../config/db.server';
import { NewUserDetails } from '../types/user';

async function countAllUsers(userIdsToSkip: number[] = []) {
  return await prisma.appUser.count({
    where: {
      userId: {
        notIn: userIdsToSkip,
      },
    },
  });
}

async function getUserByEmail(email: string) {
  return await prisma.appUser.findUnique({
    where: {
      email: email,
    },
  });
}

async function getUserById(userId: number) {
  return await prisma.appUser.findUnique({
    where: {
      userId: userId,
    },
    select: {
      userId: true,
      username: true,
      description: true,
      email: true,
    },
  });
}

async function getAllUsers(
  skip: number,
  pageSize: number,
  userIdsToSkip: number[] = [],
) {
  return await prisma.appUser.findMany({
    skip: skip,
    take: pageSize,
    where: {
      userId: {
        notIn: userIdsToSkip,
      },
    },
    select: {
      userId: true,
      username: true,
    },
  });
}

async function addUserHeight(userId: number, height: number) {
  return await prisma.appUser.update({
    where: {
      userId,
    },
    data: {
      height,
    },
  });
}

async function getUserHeight(userId: number) {
  return await prisma.appUser.findUnique({
    select: {
      height: true,
    },
    where: {
      userId,
    },
  });
}

async function getGender(userId: number) {
  return await prisma.appUser.findUnique({
    select: {
      gender: true,
    },
    where: {
      userId,
    },
  });
}

async function getCreationDate(userId: number) {
  return await prisma.appUser.findUnique({
    select: {
      createdAt: true,
    },
    where: {
      userId,
    },
  });
}

async function updateUserProfileInfo(
  userId: number,
  userDetails: NewUserDetails,
) {
  return await prisma.appUser.update({
    where: {
      userId: userId,
    },
    data: {
      ...userDetails,
    },
    select: {
      userId: true,
      username: true,
      description: true,
      email: true,
    },
  });
}

export {
  countAllUsers,
  getUserByEmail,
  getUserById,
  getAllUsers,
  addUserHeight,
  getUserHeight,
  getGender,
  getCreationDate,
  updateUserProfileInfo,
};
