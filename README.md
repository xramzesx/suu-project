Temat projektu: Python - gRPC - OTel

Autorzy: Michał Bert, Jakub Kędra, Aleksandra Sobiesiak, Adrian Stahl

## Wprowadzenie

Celem niniejszego projektu jest przedstawienie nowoczesnego, wydajnego frameworka do zdalnego wywoływania procedur (RPC) – gRPC – oraz jego zastosowania w ekosystemie Pythona. Raport obejmuje również omówienie narzędzi do obserwowalności systemów rozproszonych, skupiając się na OpenTelemetry, które umożliwia zbieranie metryk, logów i śladów (traces) z aplikacji. W ramach studium przypadku zostanie zaprezentowany prosty system klient-serwer oparty o gRPC, wzbogacony o mechanizmy monitorowania z wykorzystaniem OpenTelemetry.

## Opis przypadku, stack technologiczny

### gRPC

gRPC to otwartoźródłowy framework RPC opracowany przez Google, który opiera się na protokole HTTP/2 i formacie serializacji danych Protocol Buffers (Protobuf). Dzięki temu zapewnia wysoką wydajność, niski narzut sieciowy oraz wsparcie dla zaawansowanych funkcji, takich jak:

- transmisja strumieniowa (streaming) w obu kierunkach,

- uwierzytelnianie i bezpieczeństwo,

- balansowanie obciążenia,

- automatyczne generowanie kodu dla wielu języków programowania, w tym Pythona.

Python umożliwia łatwe tworzenie zarówno serwerów, jak i klientów gRPC. Za pomocą narzędzia grpcio-tools możliwe jest generowanie kodu klienta i serwera na podstawie plików .proto. Dzięki temu komunikacja między różnymi usługami i językami jest spójna oraz wydajna.

## Opis aplikacji

Aplikacja symuluje pobieranie odczytów z czujników temperatury oraz przesyłanie ich do centralnego serwera. Zarówno część serwerowa jak i kliencka napisane są w języku python. Dodatkowo dla bezpieczeństwa serwer wykorzystuje certyfikat SSL.

### Rodzaje wywołań / streamingu w gRPC

#### Unary (request → response)

- Klient wysyła pojedynczy komunikat, serwer zwraca pojedynczą odpowiedź.

#### Server‑streaming (request → stream(response))

- Klient wysyła jedno żądanie, serwer odsyła strumień wielu komunikatów.

#### Client‑streaming (stream(request) → response)

- Klient wysyła strumień komunikatów, serwer zwraca jedno podsumowanie.

#### Bidirectional‑streaming (stream(request) ⇄ stream(response))

- Obie strony wymieniają komunikaty niezależnie i równolegle.

### Plik proto

Plik .proto opisuje interfejs usługi gRPC w wersji proto3 oraz formaty wiadomości, jakimi klient i serwer będą się ze sobą wymieniać. Poniżej omówienie jego poszczególnych elementów:

`syntax = "proto3";`

Używamy proto3 – najnowszej, uproszczonej wersji języka Protocol Buffers.

SensorService to nazwa usługi oferowanej przez serwer. Każda metoda (rpc) określa:

- nazwę RPC,
- typ argumentu (po stronie klienta),
- typ odpowiedzi (po stronie serwera).

```proto3
service SensorService {
  rpc SendSingleReading (SensorReading) returns (Ack);
  rpc StreamSensorReadings (stream SensorReading) returns (Ack);
  rpc GetSensorReadings (SensorRequest) returns (stream SensorReading);
  rpc SensorChat (stream SensorReading) returns (stream ServerMessage);
}
```

#### Możliwe typy wywołań RPC

- Unary: pojedyncze żądanie → pojedyncza odpowiedź
```
  SendSingleReading(SensorReading) → Ack
```

- Client streaming: strumień żądań → pojedyncza odpowiedź
```
StreamSensorReadings(stream SensorReading) → Ack
```

- Server streaming: pojedyncze żądanie → strumień odpowiedzi
```
GetSensorReadings(SensorRequest) → stream SensorReading
```

- Bidirectional streaming: strumień żądań ↔ strumień odpowiedzi
```
SensorChat(stream SensorReading) → stream ServerMessage
```

#### Definicje wiadomości

SensorReading reprezentuje odczyt z czujnika.

- sensor_id (pole 1): unikalny identyfikator czujnika.
- temperature (pole 2): wartość temperatury (zmiennoprzecinkowa).
- timestamp (pole 3): znacznik czasu (liczba całkowita 64-bitowa), np. sekundy od epoki.

```proto3
message SensorReading {
  string sensor_id = 1;
  double temperature = 2;
  int64 timestamp = 3;
}
```

Ack potwierdza otrzymanie danych, zawiera krótki komunikat tekstowy.

```proto3
message Ack {
  string message = 1;
}
```

SensorRequest to żądanie dotyczące konkretnego czujnika (np. pobranie historii odczytów)

```proto3
message SensorRequest {
  string sensor_id = 1;
}
```

Komunikat serwera, wysyłany w trybie strumieniowym.

- message: treść (np. status lub alert).
- server_time: czas na serwerze (np. dla synchronizacji).

```proto3
message ServerMessage {
  string message = 1;
  int64 server_time = 2;
}
```

### Serwer

Zadaniem serwera jest zbieranie danych pomiarowych z czujników oraz ich analiza (np. obliczanie średniej). Dane te mogą być następnie pobrane przez klientów. Serwer realizuje kontrakt określony w pliku .proto w następujący sposób:

- SendSingleReading - zapisuje otrzymany odczyt w swojej pamięci podręcznej,
- StreamSensorReadings - jak powyżej, jednak z większą liczbą pomiarów (przesyłanych jako stream),
- GetSensorReadings - odsyła do klienta zapisane dane w formie streamu,
- SensorChat - Serwer odbiera od klienta pomiary, jednocześnie odsyłając potwierdzenie o ich otrzymaniu

### Klient

Zadaniem klienta jest symulacja działania czujników temperatury i przesyłanie pomiarów do serwera.

Do celów symulacji, uruchomione zostaną 4 instancje klienckie, każda wykorzystująca inny typ wywołań RPC, opisany w sekcji opisującej serwer. Każdy z klientów periodycznie wysyła w losowych odstępach czasu odczytane wyniki pomiarów lub żądanie odczytu zapisanych na serwerze pomiarów.

### OTEL

OpenTelemetry to uniwersalny zestaw narzędzi, API i SDK do instrumentacji, zbierania, przetwarzania oraz eksportu danych telemetrycznych. Główne kategorie danych to:

- Traces (śledzenie) – pozwala analizować przepływ żądań przez system rozproszony,

- Metrics (metryki) – dostarcza danych liczbowych o stanie aplikacji (np. liczba żądań, czas odpowiedzi),

- Logs (logi) – zapisuje szczegółowe zdarzenia z działania aplikacji.

OpenTelemetry dla Pythona zapewnia natywną integrację m.in. z frameworkami sieciowymi, w tym z gRPC, co umożliwia łatwe śledzenie przepływu danych i monitorowanie działania aplikacji w czasie rzeczywistym.

W ramach studium przypadku implementujemy system zbierania odczytów z czujników temperatury. Aplikację budujemy w architekturze klient–serwer, korzystając z gRPC, a dane telemetryczne eksportujemy do Jaegera (traces) oraz Prometheusa/Grafany (metrics).

## Architektura rozwiązania
![architecture](https://github.com/user-attachments/assets/ecf67907-1df0-4271-b907-5925255b1ae0)
Powyższy diagram przedstawia główne komponenty aplikacji oraz sposób, w jaki ze sobą współpracują w ramach sieci Dockerowej (grpc-network):
- Czarna przerywana linia - sieć dockerowa
- Kolorowe przerywane linie - kontenery dockerowe

## Konfiguracja środowiska
### Wymagania wstępne
- Python 3.10+
- Docker & Docker Compose (wersja ≥ 1.29)
- Make
- Klient grpcurl (do testów ręcznych, opcjonalnie)
  
Wymagane pakiety pythonowe można znaleźć w pliku requirements.txt:
```
grpcio
grpcio-tools
grpcio-observability
grpcio-health-checking
opentelemetry-sdk
opentelemetry-instrumentation-grpc
opentelemetry-exporter-jaeger
opentelemetry-exporter-otlp
protobuf==3.20.3
```

## Sposób instalacji, uruchomienie środowiska

1. Kopiowanie projektu na lokalny komputer

   `git clone git@github.com:xramzesx/suu-project.git`

2. Przejście do folderu z projektem

   `cd suu-projekt/sensor_app`

3. Generowanie certyfikatów

   `make generate_certs`

4. Uruchomienie kontenerów

   `docker compose up --build`

W wyniku wykonania powyższej komendy zostaną zbudowane poniższe kontenery:

- grpc-server
- grpc-client-1
- grpc-client-2
- grpc-client-3
- otel-collector
- prometheus
- grafana
- jaeger-1

## Użycie AI w projekcie
Wykonano kilka zapytań przy użyciu Chat-GPT o4-mini, w celu wygenerowania schematu architektury systemu na podstawie pliku docker-compose, jednak wyniki nie były wystarczająco dobre, aby wykorzystać je w projekcie.


## Podsumowanie

## Referencje
- https://opentelemetry.io/docs/ - Dokumentacja OpenTelemetry
- https://grpc.io/docs/languages/python/ - Dokumentacja wykorzystania gRPC z językiem Python
- https://prometheus.io/docs/visualization/grafana/ - Dokumentacja integracji systemu Prometheus z Grafaną
- https://opentelemetry.io/docs/collector/ - Dokumentacja OpenTelemetry Collector
