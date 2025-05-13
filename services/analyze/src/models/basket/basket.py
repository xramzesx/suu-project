from typing import Tuple, List
from collections import defaultdict
from tqdm import tqdm
from more_itertools import powerset
from src.services.database import PrismaClient
from src import utils

from sklearn.model_selection import train_test_split


class BasketMarketAnalysis:
    ### CONSTRUCTOR ###
    def __init__(
        self,
        baskets: List[Tuple[int]],
        products: List[int],
        epsilon: float = 0.0000001,
        name: str = "BasketMarketAnalysis",
    ):
        self.baskets = baskets
        self.products = products
        self.epsilon = epsilon
        self.supports = defaultdict(lambda: 0)
        self.name = name
        self.is_already_trained = False

        # TODO: Make cache versioning
        if self.is_cached():
            self.load()
            self.is_already_trained = True

    ### UTILS ###

    def _key(self, raw_key) -> Tuple[int]:
        if type(raw_key) == int:
            raw_key = (raw_key,)

        raw_key = tuple(raw_key)
        return tuple(sorted(raw_key))

    def _match(self, baskets: List[Tuple[int]], product: int):
        return list(filter(lambda basket: product in basket, baskets))

    ### MATH UTILS ###

    def support(self, products: Tuple[int]) -> float:
        support_key = self._key(products)

        if support_key not in self.supports:
            return self.epsilon

        return self.supports[support_key]

    def confidence(
        self, prior_products: Tuple[str], following_products: Tuple[str]
    ) -> float:
        prior_products = set(prior_products)
        following_products = set(following_products)

        union = prior_products.union(following_products)

        union_support = self.support(union)
        prior_support = self.support(prior_products)

        if prior_support <= self.epsilon:
            return self.epsilon

        return union_support / prior_support

    def lift(self, prior_products: Tuple[str], following_products: Tuple[str]) -> float:
        prior_products = set(prior_products)
        following_products = set(following_products)

        union = prior_products.union(following_products)

        union_support = self.support(union)

        prior_support = self.support(prior_products)
        following_support = self.support(following_products)

        if prior_support <= self.epsilon or following_support <= self.epsilon:
            return self.epsilon

        return union_support / (prior_support * following_support)

    ### SUPPORTS ###
    def _prepare_support(
        self,
        result: defaultdict,
        baskets: List[Tuple[int]],
        index: int,
        prev_basket: set = set(),
    ):
        product = self.products[index]
        matched_baskets = self._match(baskets, product)

        support_value = len(matched_baskets) / len(self.baskets)

        if support_value <= self.epsilon:
            return

        current_basket = prev_basket.union({product})
        support_key = self._key(current_basket)

        result[support_key] = support_value

        for i in range(index + 1, len(self.products)):
            self._prepare_support(
                result,
                matched_baskets,
                i,
                current_basket,
            )

    def _get_supports(self):
        result = defaultdict(lambda: 0)
        for index in tqdm(range(len(self.products))):
            self._prepare_support(result, self.baskets, index)

        return result

    def recommend(self, basket: List[int], lift_multipler: int = 10):
        if not self.is_already_trained:
            raise Exception("Train model first!")

        result = []
        for subbasket in powerset(basket):
            if subbasket == ():
                continue
            for product in self.products:
                if product in basket:
                    continue

                product = (product,)
                lift_value = self.lift(subbasket, product) * lift_multipler

                if lift_value <= 1:
                    continue

                confidence_value = self.confidence(subbasket, product)
                result.append((product, subbasket, confidence_value, lift_value))

        return sorted(result, key=lambda x: x[2], reverse=True)

    def load(self):
        self.supports = utils.load_model(self.name)

    def save(self):
        utils.save_model(self.supports, self.name)

    def is_cached(self):
        return utils.does_cache_exists(self.name)

    def train(self):
        self.supports = self._get_supports()
        self.save()
        self.is_already_trained = True


async def get_prepared_data():
    client = PrismaClient()
    await client.connect()
    workouts = await client.db.workout_template.find_many(
        include={"exercise_template_item": True}
    )

    baskets = []

    products = set()
    for workout in workouts:
        exercise_ids = []
        for exercise in workout.exercise_template_item:
            exercise_ids.append(exercise.exercise_id)
            products.add(exercise_ids[-1])

        baskets.append(tuple(exercise_ids))

    await client.disconnect()
    products = list(products)

    return baskets, products


TRAIN_TEST_SPLIT_SEED = 42


async def train_job():
    baskets, products = await get_prepared_data()

    baskets_train, baskets_test = train_test_split(
        baskets, test_size=0.2, random_state=TRAIN_TEST_SPLIT_SEED
    )

    basket_analysis = BasketMarketAnalysis(baskets_train, list(products), 0.0000001)

    basket_analysis.train()

    example_basket = list(baskets[0])[:4]

    print("basket training done")
    print("Example results for basket:", example_basket)
    print("Results:", basket_analysis.recommend(example_basket))
