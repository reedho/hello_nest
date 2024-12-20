import { Controller, Post, Body } from '@nestjs/common';
import { RabbitMQService } from './rmq.service';

@Controller('messages')
export class MessageController {
  constructor(private readonly rabbitMQService: RabbitMQService) {}

  @Post()
  async sendMessage(
    @Body('routingKey') routingKey: string,
    @Body('message') message: any,
  ) {
    await this.rabbitMQService.publish(routingKey, message);
    return { status: 'Message sent successfully' };
  }
}
