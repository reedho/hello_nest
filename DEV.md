# Development Notes

## TLDR;

```bash
# Start rabbitmq docker container
docker compose up -d rabbitmq

# Dev mode
npm run start:dev

# Production mode
npm run build && node dist/main.js

# Production mode with docker
docker compose build && docker compose up -d
```

## Work Log

### 06-Dec-2024

Bootstrap new nestjs project from example repository https://github.com/nestjs/typescript-starter.git.

What we have done:

- Demonstrate the use of `pm2` to run nestjs application (See `start.sh`, `ecosystem.config.js`)
- Setup `dumb-init` for more safer guard for dockerized application (See `start.sh`)
- Show how to use default Logger from nestjs (See `src/app.service.ts`)

### 20-Dec-2024

Implemented RabbitMQ integration.

The implementation is not using standard nestjs microservice setup due to we need to use topic exchange and dead letter queue.

Where is the implementation:

- `src/rmq-config.ts` - RabbitMQ configuration
- `src/rmq-service.ts` - RabbitMQ service
- `src/rmq-consumer.service.ts` - RabbitMQ consumer
- `src/rmq-dlq-consumer.service.ts` - RabbitMQ DLQ consumer
- `src/message.controller.ts` - Demo controller that publish message to RabbitMQ
