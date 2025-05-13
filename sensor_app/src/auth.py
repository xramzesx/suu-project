import grpc

VALID_TOKENS = {"sensor_token_abc"}

def check_token(context):
    metadata = dict(context.invocation_metadata())
    token = metadata.get("authorization")
    if token not in VALID_TOKENS:
        context.abort(grpc.StatusCode.UNAUTHENTICATED, "Invalid token")