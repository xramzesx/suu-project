type ExerciseHistoryItem = {
  exerciseId: number;
  opinion: number;
  value: JsonNull | InputJsonValue;
  orderIndex: number;
  exerciseTemplateItemId?: number;
};

export type { ExerciseHistoryItem };
