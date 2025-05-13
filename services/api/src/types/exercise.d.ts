type NewExerciseType = {
  name: string;
  hasReps: boolean;
  hasSets: boolean;
  hasWeights: boolean;
  hasTime: boolean;
  isBreak: boolean;
};

type NewExercise = {
  exerciseTypeId: number;
  name: string;
  description: string;
  bodyParts: string[];
};

type BasicExercise = {
  exerciseId: number;
  name: string;
  exerciseType: string;
  bodyParts: string[];
  shortDescription?: string;
};

type ExerciseDetails = {
  sets?: number;
  reps?: number;
  weight?: number;
  time?: number;
  breakTime?: number;
  isBreak?: boolean;
};

type DetailedExercise = {
  exerciseId: number;
  name: string;
  exerciseType: string;
  bodyParts: string[];
  value?: ExerciseDetails;
  description?: string;
  orderIndex?: number;
  imageUrls?: string[];
};

type NewExerciseTemplateItem = {
  workoutTemplateId: number;
  exerciseId: number;
  value: Prisma.JsonValue;
  orderIndex: number;
};

type ProgressTarget = 'sets' | 'reps' | 'weight' | 'time';

type ProgressType = 'none' | 'linear' | 'sigmoidal';

type NoneProgressType = {
  type: 'none';
};

type LinearProgressType = {
  type: 'linear';
  interval: number;
  difference: number;
  maxValue?: number;
  maxOccurences?: number;
  target: ProgressTarget;
};

type ProgressConfigType = {
  type: ProgressType;
} & (NoneProgressType | LinearProgressType);

export type {
  NewExerciseType,
  NewExercise,
  NewExerciseTemplateItem,
  BasicExercise,
  DetailedExercise,
  ProgressTarget,
  ProgressType,
  NoneProgressType,
  LinearProgressType,
  ProgressConfigType,
};
