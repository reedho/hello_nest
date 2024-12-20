export interface RabbitMQConfig {
  amqpUrl: string;
  exchange: string;
  queue: string;
  dlx: string;
  dlq: string;
  messageTtl: number;
}

export const defaultRabbitMQConfig: RabbitMQConfig = {
  amqpUrl: process.env.AMQP_URL || 'amqp://localhost:5672',
  exchange: process.env.AMQP_EXCHANGE || 'app_exchange',
  queue: process.env.AMQP_QUEUE || 'app_queue',
  dlx: process.env.AMQP_DLX || 'app_dlx',
  dlq: process.env.AMQP_DLQ || 'app_dlq',
  messageTtl: Number(process.env.AMQP_MESSAGE_TTL) || 1000 * 60 * 60 * 24 * 7, // 7 days retention
};
