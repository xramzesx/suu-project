from src.proto.analyze_pb2 import (
    UserProgressRequest,
    ProgressRecommendationMessage,
    ExerciseItem,
)
from src.proto.analyze_pb2_grpc import ProgressAnalyzeServiceServicer
from src.services.progress import ProgressService


class ProgressAnalyzeServiceImpl(ProgressAnalyzeServiceServicer):

    def __init__(self):
        super().__init__()
        self.service = ProgressService()

    async def RecommendProgress(
        self, request: UserProgressRequest, context
    ) -> ProgressRecommendationMessage:

        exercises = await self.service.recommend_progress(
            request.user_id, request.workout_id
        )

        if exercises is None:
            return ProgressRecommendationMessage(exercises=[])

        exercise_items = map(
            lambda x: ExerciseItem(
                exercise_id=x["exercise_id"],
                item_id=x["item_id"],
                order_index=x["order_index"],
                value=x["value"],
            ),
            exercises,
        )

        exercise_items = list(exercise_items)
        return ProgressRecommendationMessage(exercises=list(exercise_items))
