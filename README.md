# Środowiska Udostępniania Usług - projekt
Temat projektu: Python - gRPC - OTel

Autorzy: Michał Bert, Jakub Kędra, Aleksandra Sobiesiak, Adrian Stahl 
## Wprowadzenie
Celem niniejszego projektu jest przedstawienie nowoczesnego, wydajnego frameworka do zdalnego wywoływania procedur (RPC) – gRPC – oraz jego zastosowania w ekosystemie Pythona. Raport obejmuje również omówienie narzędzi do obserwowalności systemów rozproszonych, skupiając się na OpenTelemetry, które umożliwia zbieranie metryk, logów i śladów (traces) z aplikacji. W ramach studium przypadku zostanie zaprezentowany prosty system klient-serwer oparty o gRPC, wzbogacony o mechanizmy monitorowania z wykorzystaniem OpenTelemetry.
## Opis przypadku, stack technologiczny
gRPC to otwartoźródłowy framework RPC opracowany przez Google, który opiera się na protokole HTTP/2 i formacie serializacji danych Protocol Buffers (Protobuf). Dzięki temu zapewnia wysoką wydajność, niski narzut sieciowy oraz wsparcie dla zaawansowanych funkcji, takich jak:

- transmisja strumieniowa (streaming) w obu kierunkach,

- uwierzytelnianie i bezpieczeństwo,

- balansowanie obciążenia,

- automatyczne generowanie kodu dla wielu języków programowania, w tym Pythona.

Python umożliwia łatwe tworzenie zarówno serwerów, jak i klientów gRPC. Za pomocą narzędzia grpcio-tools możliwe jest generowanie kodu klienta i serwera na podstawie plików .proto. Dzięki temu komunikacja między różnymi usługami i językami jest spójna oraz wydajna.

OpenTelemetry to uniwersalny zestaw narzędzi, API i SDK do instrumentacji, zbierania, przetwarzania oraz eksportu danych telemetrycznych. Główne kategorie danych to:

- Traces (śledzenie) – pozwala analizować przepływ żądań przez system rozproszony,

- Metrics (metryki) – dostarcza danych liczbowych o stanie aplikacji (np. liczba żądań, czas odpowiedzi),

- Logs (logi) – zapisuje szczegółowe zdarzenia z działania aplikacji.

OpenTelemetry dla Pythona zapewnia natywną integrację m.in. z frameworkami sieciowymi, w tym z gRPC, co umożliwia łatwe śledzenie przepływu danych i monitorowanie działania aplikacji w czasie rzeczywistym.

W ramach studium przypadku zostanie zaimplementowany prosty system klient-serwer w Pythonie z użyciem gRPC. Serwer będzie udostępniał usługę obliczeniową (np. prostą operację matematyczną), a klient będzie wysyłał żądania oraz odbierał odpowiedzi. Obie strony komunikacji zostaną zainstrumentowane przy użyciu OpenTelemetry, aby umożliwić zbieranie i wizualizację:

- śladów przesyłanych żądań,

- metryk dotyczących liczby obsłużonych żądań i czasu odpowiedzi,

- logów błędów i zdarzeń.

Dane telemetryczne będą eksportowane do wybranego backendu, np. Jaeger (dla traces) oraz Prometheus/Grafana (dla metrics), co pozwoli na monitorowanie działania systemu w czasie rzeczywistym.
## Architektura rozwiązania

## Konfiguracja środowiska

## Sposób instalacji, uruchomienie środowiska

## Użycie AI w projekcie

## Podsumowanie

## Referencje
