## Crypto Data Fetcher

This microservice will:
- fetch cryptocurrency price, percent change, HL, market cap, current supply etc. data from CoinGecko
- update data every 10 seconds
- stream data to Kafka topic for processing

## Commands
- Start Kafka:
```
docker pull apache/kafka:3.9.0
docker run -p 9092:9092 --name kafka apache/kafka:3.9.0

- Create Kafka topic:
```
docker exec kafka /opt/kafka/bin/kafka-topics.sh --create --topic crypto.data --bootstrap-server localhost:9092 --partitions 1 --replication-factor 1
```

- Delete Kafka topic:
```
docker exec kafka /opt/kafka/bin/kafka-topics.sh --delete --topic crypto_data --bootstrap-server localhost:9092
```