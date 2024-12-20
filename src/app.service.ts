import { Injectable, Logger } from '@nestjs/common';

@Injectable()
export class AppService {
  private readonly logger = new Logger(AppService.name);

  async getHello(): Promise<string> {
    const result = await new Promise<string>((s, _f) => {
      this.logger.log('Begin processing....');
      setTimeout(() => {
        this.logger.log('Processing done.');
        this.logger.error('There is no error here');
        s('Hello World!, are you there?');
      }, 0);
    });

    // return 'Hello World!, are you ok?';
    return result;
  }
}
