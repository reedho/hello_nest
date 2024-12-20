import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { HealthController } from './health.controller';
import { MessageController } from './message.controller';
import { RabbitMQConsumerService } from './rmq-consumer.service';
import { RabbitMQConfig } from './rmq.config';
import { RabbitMQService } from './rmq.service';
import { RabbitMQDLQConsumerService } from './rmq-dlq-consumer.service';

const customConfig: Partial<RabbitMQConfig> = {
  exchange: 'booking_exchange',
  queue: 'booking_queue',
  dlx: 'booking_dlx',
  dlq: 'booking_dlq',
  messageTtl: 1000 * 60 * 60 * 24 * 7, // 7 days retention
};

@Module({
  imports: [],
  controllers: [AppController, HealthController, MessageController],
  providers: [
    AppService,
    {
      provide: RabbitMQService,
      useFactory: () => new RabbitMQService(customConfig),
    },
    {
      provide: RabbitMQConsumerService,
      useFactory: () => new RabbitMQConsumerService(customConfig),
    },
    {
      provide: RabbitMQDLQConsumerService,
      useFactory: () => new RabbitMQDLQConsumerService(customConfig),
    },
  ],
})
export class AppModule {}
