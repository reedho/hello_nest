import { Injectable, OnModuleInit, OnModuleDestroy } from '@nestjs/common';
import { type Connection, type Channel, connect } from 'amqplib';
import { RabbitMQConfig, defaultRabbitMQConfig } from './rmq.config';

@Injectable()
export class RabbitMQService implements OnModuleInit, OnModuleDestroy {
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

    // Assert a topic exchange
    await this.channel.assertExchange(this.config.exchange, 'topic', { durable: true });

    // Assert a dead letter exchange
    await this.channel.assertExchange(this.config.dlx, 'fanout', { durable: true });

    // Assert a dead letter queue
    await this.channel.assertQueue(this.config.dlq, { durable: true });

    // Bind the dead letter queue to the dead letter exchange
    await this.channel.bindQueue(this.config.dlq, this.config.dlx, '');

    // Assert the main queue with dead-letter exchange configuration
    await this.channel.assertQueue(this.config.queue, {
      durable: true,
      deadLetterExchange: this.config.dlx,
      messageTtl: this.config.messageTtl,
    });

    // Bind the queue to the exchange with a specific routing key
    await this.channel.bindQueue(this.config.queue, this.config.exchange, 'key.*');
    await this.channel.bindQueue(this.config.queue, this.config.exchange, '*.event');
  }

  async publish(routingKey: string, message: any) {
    const msgBuffer = Buffer.from(JSON.stringify(message));
    this.channel.publish(this.config.exchange, routingKey, msgBuffer);
  }

  async onModuleDestroy() {
    await this.channel.close();
    await this.connection.close();
  }
}
