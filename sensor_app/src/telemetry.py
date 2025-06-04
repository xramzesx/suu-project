from opentelemetry.sdk.resources import SERVICE_NAME, Resource

from opentelemetry import trace
from opentelemetry.sdk.trace import TracerProvider
from opentelemetry.sdk.trace.export import BatchSpanProcessor
from opentelemetry.instrumentation.grpc import (
    GrpcInstrumentorServer,
    GrpcInstrumentorClient
)
from opentelemetry.sdk.trace import TracerProvider
from opentelemetry.sdk.trace.export import BatchSpanProcessor
from opentelemetry.sdk.metrics import MeterProvider
from opentelemetry.exporter.otlp.proto.grpc.trace_exporter import OTLPSpanExporter
from opentelemetry.exporter.otlp.proto.grpc.metric_exporter import OTLPMetricExporter
from opentelemetry.sdk.metrics.export import PeriodicExportingMetricReader, ConsoleMetricExporter

import grpc_observability

import os

COLLECTOR_ADDRESS= f"http://{os.getenv('COLLECTOR_ADDRESS')}:4317"

CLIENT_SIDE = 'client'
SERVER_SIDE = 'server'

OTEL_EXPORT_INTERVAL_MS = 1000

def get_resource(side):
    
    service_name = ""

    if side == CLIENT_SIDE:
        service_name = "client-side"
    elif side == SERVER_SIDE:
        service_name = "server-side"
    else:
        raise Exception(f"Invalid connection side: {side}")

    return Resource.create(attributes={
        SERVICE_NAME: service_name
    })


def setup_tracing(side):

    resource = get_resource(side)
    
    tracerProvider = TracerProvider(resource=resource)
    processor = BatchSpanProcessor(OTLPSpanExporter(insecure= True))
    tracerProvider.add_span_processor(processor)
    trace.set_tracer_provider(tracerProvider)

    if side == 'client':
        GrpcInstrumentorClient().instrument()
    elif side == 'server':
        GrpcInstrumentorServer().instrument()
    else:
        raise Exception(f"Invalid connection side: {side}")


def setup_metrics(side):
    resource = get_resource(side)

    otel_exporter = OTLPMetricExporter(insecure = True)
    reader = PeriodicExportingMetricReader(
        exporter=otel_exporter,
        export_interval_millis=OTEL_EXPORT_INTERVAL_MS,
    )
    provider = MeterProvider(
        metric_readers=[reader], 
        resource=resource
    )
    otel_plugin = grpc_observability.OpenTelemetryPlugin(
        meter_provider=provider
    )
    otel_plugin.register_global()
    
