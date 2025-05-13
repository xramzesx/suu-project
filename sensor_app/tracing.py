from opentelemetry import trace
from opentelemetry.sdk.trace import TracerProvider
from opentelemetry.sdk.trace.export import BatchSpanProcessor, ConsoleSpanExporter
from opentelemetry.instrumentation.grpc import GrpcInstrumentorServer

def setup_tracing():
    trace.set_tracer_provider(TracerProvider())
    tracer = trace.get_tracer_provider().get_tracer(__name__)
    processor = BatchSpanProcessor(ConsoleSpanExporter())
    trace.get_tracer_provider().add_span_processor(processor)
    GrpcInstrumentorServer().instrument()
    return tracer