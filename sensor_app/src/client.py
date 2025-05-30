import grpc
from proto import sensor_pb2, sensor_pb2_grpc
import time
import tracing
import random

def get_random_temperature():
    return 20.0 + (time.time() % 10)


def generate_readings():
    for _ in range(5):
        yield sensor_pb2.SensorReading(
            sensor_id="sensor-2",
            temperature=get_random_temperature(),
            timestamp=int(time.time()),
        )
        time.sleep(0.2)


def test_unary(stub, metadata):
    response = stub.SendSingleReading(
        sensor_pb2.SensorReading(
            sensor_id="sensor-1",
            temperature=get_random_temperature(),
            timestamp=int(time.time()),
        ),
        metadata=metadata,
    )

    print(response)
    return


def test_client_streaming(stub, metadata):
    response = stub.StreamSensorReadings(generate_readings(), metadata=metadata)
    print("Client-streaming response:", response.message)


def test_server_streaming(stub, metadata):
    request = sensor_pb2.SensorRequest(sensor_id="sensor-2")
    for reading in stub.GetSensorReadings(request, metadata=metadata):
        print(f"Reading from server: {reading.temperature} at {reading.timestamp}")


def test_bidirectional_streaming(stub, metadata):
    responses = stub.SensorChat(generate_readings(), metadata=metadata)
    for res in responses:
        print(f"Server says: {res.message} at {res.server_time}")


if __name__ == "__main__":
    with open("certs/server.crt", "rb") as f:
        trusted_certs = f.read()
    creds = grpc.ssl_channel_credentials(root_certificates=trusted_certs)
    channel = grpc.secure_channel("grpc-server:50051", creds)
    stub = sensor_pb2_grpc.SensorServiceStub(channel)
    metadata = [("authorization", "sensor_token_abc")]

    tracing.setup_tracing('client', __name__)

    while True:
        choosen_request = random.randint(0, 3)
        choosen_delay = random.random()

        if choosen_request == 0:
            test_unary(stub, metadata)
        elif choosen_request == 1:
            test_client_streaming(stub, metadata)
        elif choosen_request == 2:
            test_server_streaming(stub, metadata)
        elif choosen_request == 3:
            test_bidirectional_streaming(stub, metadata)

        time.sleep(choosen_delay)

