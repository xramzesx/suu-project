from src.models.basket import basket
import asyncio


def map_to_tasks(arr):
    return list(map(lambda x: asyncio.create_task(x), arr))


async def main():
    jobs = [basket.train_job()]

    for job in jobs:
        await job


if __name__ == "__main__":
    asyncio.run(main())
