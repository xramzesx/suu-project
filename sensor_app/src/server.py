from concurrent import futures
import grpc
import time
import telemetry

from proto import sensor_pb2, sensor_pb2_grpc
from health_check import add_health_check
from auth import check_token

class SensorService(sensor_pb2_grpc.SensorServiceServicer):
    def __init__(self):
        self.db = {}

    def SendSingleReading(self, request, context):
        check_token(context)
        self._store_reading(request)
        return sensor_pb2.Ack(message="Reading received.")

    def StreamSensorReadings(self, request_iterator, context):
        check_token(context)
        for reading in request_iterator:
            print(f"Received reading: {reading.temperature}")
            self._store_reading(reading)
        return sensor_pb2.Ack(message="All readings stored.")

    def GetSensorReadings(self, request, context):
        check_token(context)
        readings = self.db.get(request.sensor_id, [])
        for reading in readings:
            yield reading

    def SensorChat(self, request_iterator, context):
        check_token(context)
        for reading in request_iterator:
            self._store_reading(reading)
            yield sensor_pb2.ServerMessage(
                message=f"Received {reading.temperature}", server_time=int(time.time())
            )

    def _store_reading(self, reading):
        if reading.sensor_id not in self.db:
            self.db[reading.sensor_id] = []
        self.db[reading.sensor_id].append(reading)


def serve():
    telemetry.setup_tracing('server')
    telemetry.setup_metrics('server')

    server = grpc.server(futures.ThreadPoolExecutor(max_workers=10))
    sensor_pb2_grpc.add_SensorServiceServicer_to_server(SensorService(), server)
    add_health_check(server)

    with open("certs/server.crt", "rb") as f:
        cert = f.read()
    with open("certs/server.key", "rb") as f:
        key = f.read()

    creds = grpc.ssl_server_credentials(((key, cert),))
    server.add_secure_port("[::]:50051", creds)
    print("Server started on port 50051 with TLS.")
    server.start()
    server.wait_for_termination()


if __name__ == "__main__":
    serve()
