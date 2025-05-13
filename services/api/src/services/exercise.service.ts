import * as ExerciseDB from '../persistance/exercise.db';
import {
  IdsPackageMessage,
  IdsPackageMessage__Output,
} from '../proto/IdsPackageMessage';
import { BasicExercise, DetailedExercise } from '../types/exercise';
import analyzeService from './analyze.service';

type ExerciseShortEntity = {
  exerciseType: {
    name: string;
  };
  exercisesBodyParts: {
    bodyPart: {
      name: string;
    };
  }[];
  exerciseId: number;
  name: string;
  description: string | null;
};

const undetailedExerciseMapper = (exercise: ExerciseShortEntity) => ({
  exerciseId: exercise.exerciseId,
  name: exercise.name,
  exerciseType: exercise.exerciseType.name,
  shortDescription: exercise.description?.substring(0, 40) + '...',
  bodyParts: exercise.exercisesBodyParts.map((bp) => bp.bodyPart.name),
});

async function getRecommendedExercises(
  userId: number,
  exerciseIds: number[],
  limit: number = 10,
) {
  if (exerciseIds.length === 0) {
    return [];
  }

  const recommendationResults: IdsPackageMessage =
    (await analyzeService.recommendExercises(
      userId,
      exerciseIds,
    )) as IdsPackageMessage__Output;

  const recommendedIds = recommendationResults.ids ?? [];

  if (recommendedIds.length === 0) {
    return [];
  }

  const exercises = await ExerciseDB.getExercisesByIds(recommendedIds);

  return exercises.map(undetailedExerciseMapper).slice(0, limit);
}

async function getAllExercises(): Promise<BasicExercise[]> {
  const exercises = (await ExerciseDB.getAllExercises()).map(
    undetailedExerciseMapper,
  );

  return exercises;
}

async function getExerciseDetails(
  exerciseId: number,
): Promise<DetailedExercise> {
  const exercise = await ExerciseDB.getExerciseDetails(exerciseId);
  if (!exercise) {
    throw new Error('Exercise not found');
  }

  return {
    exerciseId: exercise?.exerciseId,
    name: exercise?.name,
    description: exercise?.description ?? '',
    exerciseType: exercise?.exerciseType.name,
    imageUrls: exercise?.imageUrls,
    bodyParts: exercise?.exercisesBodyParts.map((bp) => bp.bodyPart.name),
  };
}

async function getAllExersiceTypes() {
  const exerciseTypes = await ExerciseDB.getAllExersiceTypes();
  return exerciseTypes;
}

export {
  getAllExercises,
  getExerciseDetails,
  getAllExersiceTypes,
  getRecommendedExercises,
};
