generate_certs:
	mkdir certs
	openssl req -x509 -newkey rsa:4096 -keyout certs/server.key -out certs/server.crt -days 365 -nodes -subj "/CN=grpc-server"

generate_proto:
	python3 -m grpc_tools.protoc -I. --python_out=./src --grpc_python_out=./src ./proto/sensor.proto

