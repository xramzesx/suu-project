FROM python:3.10-slim

WORKDIR /app

COPY . .

RUN apt-get update -y && apt-get install make -y

RUN pip install --no-cache-dir -r requirements.txt \
    && make generate_proto

ENTRYPOINT ["python"]


