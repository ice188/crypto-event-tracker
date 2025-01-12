## Crypto Data Consumer

This microservice will:
- consume the crypto data from Kafka
- store processed data in firebase firestore, ready to be used for frontend real-time stat
- archive daily price/volume data in AWS S3 bucket, ready to be used for frontend chart visualization

- evaluates incoming crypto data to trigger alerts
- if alert condition is met, push alert to RabbitMQ to be consumed by notification service (FCM)

## Quick Commands (Dev)
docker run --name redis -p 6379:6379 -d redis
docker run -d --hostname rabbitmq --name rabbitmq -p 5672:5672 -p 15672:15672 rabbitmq:management

## Side note
RabbitMQ vs Kafka: 
- queue vs distributed stream
- priority is low-latency deliver message (small message volume) vs priority is high-throughput (big data)
