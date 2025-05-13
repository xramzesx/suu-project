from src.proto.analyze_pb2 import UserRequest, IdsPackageMessage
from src.proto.analyze_pb2_grpc import BasketAnalyzeServiceServicer
from src.models.basket import basket
from typing import Tuple, List


class BasketAnalyzeServiceImpl(BasketAnalyzeServiceServicer):

    def __init__(self, baskets: List[Tuple[int]], products: List[int]):
        super().__init__()
        self.exercises_basket_model = basket.BasketMarketAnalysis(baskets, products)

    def RecommendExercises(self, request: UserRequest, context):
        current_basket = request.ids
        results = self.exercises_basket_model.recommend(current_basket)
        results = map(lambda x: x[0][0], results)
        results = list(results)
        return IdsPackageMessage(ids=results)
