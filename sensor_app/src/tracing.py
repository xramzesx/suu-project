from opentelemetry import trace, metrics
from opentelemetry.sdk.trace import TracerProvider
from opentelemetry.sdk.trace.export import BatchSpanProcessor, ConsoleSpanExporter
from opentelemetry.instrumentation.grpc import (
    GrpcInstrumentorServer,
    GrpcInstrumentorClient,
)
from opentelemetry.sdk.trace import TracerProvider
from opentelemetry.sdk.trace.export import BatchSpanProcessor
from opentelemetry.sdk.metrics import MeterProvider
from opentelemetry.exporter.otlp.proto.grpc.trace_exporter import OTLPSpanExporter
from opentelemetry.exporter.otlp.proto.grpc.metric_exporter import OTLPMetricExporter
from opentelemetry.sdk.metrics.export import PeriodicExportingMetricReader
import os

COLLECTOR_ADDRESS= f"http://{os.getenv('COLLECTOR_ADDRESS')}:4317"

def setup_tracing(side):
    # Tracing config

    trace.set_tracer_provider(TracerProvider())
    tracer = trace.get_tracer_provider().get_tracer(__name__)
    
    span_exporter = OTLPSpanExporter(endpoint=COLLECTOR_ADDRESS, insecure=True)
    processor = BatchSpanProcessor(span_exporter)
    trace.get_tracer_provider().add_span_processor(processor)

    # Metrics config
    metric_exporter = OTLPMetricExporter(endpoint=COLLECTOR_ADDRESS, insecure=True)
    reader = PeriodicExportingMetricReader(metric_exporter)
    metrics.set_meter_provider(MeterProvider(metric_readers=[reader]))
    meter = metrics.get_meter(__name__)

    if side == 'client':
        GrpcInstrumentorClient().instrument()
    elif side == 'server':
        GrpcInstrumentorServer().instrument()
    else:
        raise Exception("Connection side not specified")


    return tracer
