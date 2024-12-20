import { Injectable, Logger, OnModuleDestroy, OnModuleInit } from '@nestjs/common';
import { defaultRabbitMQConfig, RabbitMQConfig } from './rmq.config';
import { Channel, ChannelWrapper, connect } from 'amqp-connection-manager';
import { IAmqpConnectionManager } from 'amqp-connection-manager/dist/types/AmqpConnectionManager';

// Note:
// This service is `using amqp-connection-manager` instead of standard `amqplib`
// Benefits of using amqp-connection-manager:
// 1. It supports promises and async/await
// 2. It supports channel pooling
// 3. It supports connection pooling
// 4. It supports connection recovery
// 5. It supports connection events

@Injectable()
export class RabbitMQConsumerService implements OnModuleInit, OnModuleDestroy {
  private readonly logger = new Logger(RabbitMQConsumerService.name);
  private connection: IAmqpConnectionManager;
  private channel: ChannelWrapper;
  private readonly config: RabbitMQConfig;

  constructor(config?: Partial<RabbitMQConfig>) {
    this.config = { ...defaultRabbitMQConfig, ...config };
  }

  async onModuleInit() {
    // Establish connection to RabbitMQ
    this.connection = await connect(this.config.amqpUrl);
    this.connection.on('connect', () => {
      this.logger.log('Message Consumer Connected to RabbitMQ');
    });
    this.connection.on('disconnect', () => {
      this.logger.log('Message Consumer Disconnected from RabbitMQ');
    });

    this.channel = this.connection.createChannel({
      setup: (channel: Channel) => {
        // Assert a topic exchange
        channel.assertExchange(this.config.exchange, 'topic', { durable: true });

        return channel.assertQueue(this.config.queue, {
          durable: true,
          deadLetterExchange: this.config.dlx,
          messageTtl: this.config.messageTtl,
        });
      },
    });

    // Bind queue to the exchange with specific binding keys
    await this.channel.bindQueue(this.config.queue, this.config.exchange, 'key.*');
    await this.channel.bindQueue(this.config.queue, this.config.exchange, '*.event');

    // Consume messages
    this.channel.consume(this.config.queue, (msg) => {
      if (msg !== null) {
        this.logger.log(`Received: ${msg.content.toString()}`);
        this.channel.ack(msg);
      }
    });
  }

  async onModuleDestroy() {
    await this.channel.close();
    await this.connection.close();
  }
}
