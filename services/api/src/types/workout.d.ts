import { ProgressConfigType } from './exercise';

type NewWorkoutTemplate = {
  authorId: number;
  name: string;
  description: string;
  createdAt: Date;
  private: boolean;
  workoutLevelId: number;
};

type GeneralWorkout = {
  workoutId: number;
  name: string;
  workoutTags: string[];
  workoutLevel: string;
  isOwnedByUser?: boolean;
};

type NewUserWorkout = {
  userId: number;
  workoutId: number;
  timestamp: Date;
};

type WorkoutTag = {
  workoutTemplateId: number;
  tagId: number;
};

type ExerciseWorkoutItem = {
  exerciseId: number;
  value: JsonNull | InputJsonValue;
  progress: ProgressConfigType;
  orderIndex: number;
};

export type {
  NewWorkoutTemplate,
  GeneralWorkout,
  NewUserWorkout,
  WorkoutTag,
  ExerciseWorkoutItem,
};
