import { Injectable, Logger, OnModuleDestroy, OnModuleInit } from '@nestjs/common';
import { type Connection, type Channel, connect } from 'amqplib';
import { RabbitMQConfig } from './rmq.config';
import { defaultRabbitMQConfig } from './rmq.config';

@Injectable()
export class RabbitMQDLQConsumerService implements OnModuleInit, OnModuleDestroy {
  private readonly logger = new Logger(RabbitMQDLQConsumerService.name);
  private connection: Connection;
  private channel: Channel;
  private readonly config: RabbitMQConfig;

  constructor(config?: Partial<RabbitMQConfig>) {
    this.config = { ...defaultRabbitMQConfig, ...config };
  }

  async onModuleInit() {
    // Establish connection to RabbitMQ
    this.connection = await connect(this.config.amqpUrl);
    this.channel = await this.connection.createChannel();

    // Assert the DLQ to ensure it exists
    await this.channel.assertQueue(this.config.dlq, { durable: true });

    // Consume messages from the DLQ
    this.channel.consume(this.config.dlq, (msg) => {
      if (msg !== null) {
        this.logger.log('Received message from DLQ:', msg.content.toString());
        this.channel.ack(msg); // Acknowledge the message to remove it from the queue
      }
    });
  }

  async onModuleDestroy() {
    await this.channel.close();
    await this.connection.close();
  }
}
