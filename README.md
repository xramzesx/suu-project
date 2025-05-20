# Środowiska Udostępniania Usług - projekt
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

### Rodzaje wywołań / streamingu w gRPC

#### Unary (request → response)

- Klient wysyła pojedynczy komunikat, serwer zwraca pojedynczą odpowiedź.

- Implementacja w repo: SensorService.SendSingleReading() • test_unary()

#### Server‑streaming (request → stream(response))

- Klient wysyła jedno żądanie, serwer odsyła strumień wielu komunikatów.

- Implementacja w repo: SensorService.GetSensorReadings() • test_server_streaming()

#### Client‑streaming (stream(request) → response)

- Klient wysyła strumień komunikatów, serwer zwraca jedno podsumowanie.


#### Bidirectional‑streaming (stream(request) ⇄ stream(response))

- Obie strony wymieniają komunikaty niezależnie i równolegle.

### Opisanie pliku proto
Plik .proto opisuje interfejs usługi gRPC w wersji proto3 oraz formaty wiadomości, jakimi klient i serwer będą się ze sobą wymieniać. Poniżej omówienie jego poszczególnych elementów:

`syntax = "proto3";`

Używamy proto3 – najnowszej, uproszczonej wersji języka Protocol Buffers.

`service SensorService {
  rpc SendSingleReading (SensorReading) returns (Ack);
  rpc StreamSensorReadings (stream SensorReading) returns (Ack);
  rpc GetSensorReadings (SensorRequest) returns (stream SensorReading);
  rpc SensorChat (stream SensorReading) returns (stream ServerMessage);
}`

SensorService to nazwa usługi oferowanej przez serwer.
- Każda metoda (rpc) określa:
- nazwę RPC,
- typ argumentu (po stronie klienta),
- typ odpowiedzi (po stronie serwera).

Możliwe tryby transmisji:
1. Unary: pojedyncze żądanie → pojedyncza odpowiedź
- SendSingleReading(SensorReading) → Ack
2.	Client streaming: strumień żądań → pojedyncza odpowiedź
- StreamSensorReadings(stream SensorReading) → Ack
3.	Server streaming: pojedyncze żądanie → strumień odpowiedzi
- GetSensorReadings(SensorRequest) → stream SensorReading
4.	Bidirectional streaming: strumień żądań ↔ strumień odpowiedzi
- SensorChat(stream SensorReading) → stream ServerMessage

`message SensorReading {
  string sensor_id = 1;
  double temperature = 2;
  int64 timestamp = 3;
}`

SensorReading reprezentuje odczyt z czujnika.
- sensor_id (pole 1): unikalny identyfikator czujnika.
- temperature (pole 2): wartość temperatury (zmiennoprzecinkowa).
- timestamp (pole 3): znacznik czasu (liczba całkowita 64-bitowa), np. sekundy od epoki.

`message Ack {
  string message = 1;
}`

Ack potwierdza otrzymanie danych, zawiera krótki komunikat tekstowy.

`message SensorRequest {
  string sensor_id = 1;
}`

SensorRequest to żądanie dotyczące konkretnego czujnika (np. pobranie historii odczytów)

`message ServerMessage {
  string message = 1;
  int64 server_time = 2;
}`

Komunikat serwera, wysyłany w trybie strumieniowym.
- message: treść (np. status lub alert).
- server_time: czas na serwerze (np. dla synchronizacji).


### OTEL

OpenTelemetry to uniwersalny zestaw narzędzi, API i SDK do instrumentacji, zbierania, przetwarzania oraz eksportu danych telemetrycznych. Główne kategorie danych to:

- Traces (śledzenie) – pozwala analizować przepływ żądań przez system rozproszony,

- Metrics (metryki) – dostarcza danych liczbowych o stanie aplikacji (np. liczba żądań, czas odpowiedzi),

- Logs (logi) – zapisuje szczegółowe zdarzenia z działania aplikacji.

OpenTelemetry dla Pythona zapewnia natywną integrację m.in. z frameworkami sieciowymi, w tym z gRPC, co umożliwia łatwe śledzenie przepływu danych i monitorowanie działania aplikacji w czasie rzeczywistym.

W ramach studium przypadku implementujemy system zbierania odczytów z czujników temperatury. Aplikację budujemy w architekturze klient–serwer, korzystając z gRPC, a dane telemetryczne eksportujemy do Jaegera (traces) oraz Prometheusa/Grafany (metrics).

## Architektura rozwiązania

<!---
┌────────────┐          TLS + token          ┌────────────────────┐
│  Sensor 🟦 │  ───────────────────────────▶ │  gRPC‑Server 🟩     │
│   Client   │    unary / streaming         │  • walidacja token │
│            │     + health‑check           │  • baza in‑memory  │
└────────────┘ ◀─────────────────────────── │  • OTel tracing    │
         ▲        stream(response)          │     & metrics      │
         │                                   └─────────┬────────┘
         │                                             │ OTLP
         │                                             ▼
         │                                      ┌───────────────┐
         │                                      │  Jaeger UI    │
         │                                      └───────────────┘
         │ metrics                               ▲
         ▼                                       │
┌─────────────────┐                              │
│ Prometheus/Graf │◀─────────────────────────────┘
└─────────────────┘
-->
<img width="512" alt="image" src="https://github.com/user-attachments/assets/d2368f4d-c7da-405a-b466-a4a31a57a3cd" />

Klient łączy się z serwerem gRPC poprzez bezpieczny kanał TLS, przekazując token w metadanych. Serwer zapisuje otrzymane odczyty w pamięci oraz emituje ślady i metryki przez OpenTelemetry. Liveness zapewnia grpc-health. Dane telemetryczne trafiają do Jaegera (traces) i Prometheusa (metrics), skąd Grafana wizualizuje dashboard.

## Konfiguracja środowiska

## Sposób instalacji, uruchomienie środowiska

## Użycie AI w projekcie

## Podsumowanie

## Referencje
