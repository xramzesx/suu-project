import * as grpc from '@grpc/grpc-js';
import { UserRequest } from '../proto/UserRequest';
import gymuPackage from '../proto.package';
import { UserProgressRequest } from '../proto/UserProgressRequest';

const GRPC_URL = `${process.env.GRPC_HOST}:${process.env.GRPC_PORT}`;

const basketAnalyzeClient = new gymuPackage.BasketAnalyzeService(
  GRPC_URL,
  grpc.credentials.createInsecure(),
);

const progressClient = new gymuPackage.ProgressAnalyzeService(
  GRPC_URL,
  grpc.credentials.createInsecure(),
);

const recommendExercises = async (userId: number, ids: number[]) =>
  new Promise((resolve, reject) => {
    const request: UserRequest = {
      userId: userId,
      ids: ids,
    };
    basketAnalyzeClient.recommendExercises(
      request,
      (error: grpc.ServiceError | null, response) => {
        if (error) {
          console.error(error);
          reject(error);
        }

        resolve(response);
      },
    );
  });

const recommendProgress = async (userId: number, workoutId: number) =>
  new Promise((resolve, reject) => {
    const request: UserProgressRequest = {
      userId: userId,
      workoutId: workoutId,
    };

    progressClient.recommendProgress(
      request,
      (error: grpc.ServiceError | null, response) => {
        if (error) {
          console.error(error);
          reject(error);
        }
        resolve(response);
      },
    );
  });

export default {
  recommendExercises,
  recommendProgress,
};
