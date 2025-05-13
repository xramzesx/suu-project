import asyncio
import os
from concurrent import futures

import grpc
from dotenv import load_dotenv

from src.models.basket import basket
from src.proto import analyze_pb2_grpc
from src.rpc.analyze import BasketAnalyzeServiceImpl
from src.rpc.progress import ProgressAnalyzeServiceImpl


### MAIN ###
async def main() -> None:

    ### GET ENV VARIABLES ###
    port = os.getenv("GRPC_PORT")

    print("Server started, listening on " + port)

    ### PREPARE MODELS' DATA ###
    exercise_baskets, exercise_products = await basket.get_prepared_data()

    ### SETUP GRPC SERVER ###
    server = grpc.aio.server(futures.ThreadPoolExecutor(max_workers=10))
    analyze_pb2_grpc.add_BasketAnalyzeServiceServicer_to_server(
        BasketAnalyzeServiceImpl(exercise_baskets, exercise_products), server
    )

    analyze_pb2_grpc.add_ProgressAnalyzeServiceServicer_to_server(
        ProgressAnalyzeServiceImpl(), server
    )

    ### SETUP PORTS AND START SERVER ###
    server.add_insecure_port(f"0.0.0.0:{port}")
    await server.start()

    await server.wait_for_termination()


### SETUP ENV ###
if __name__ == "__main__":
    load_dotenv()
    print("Analyze service started")
    asyncio.get_event_loop().run_until_complete(main())
