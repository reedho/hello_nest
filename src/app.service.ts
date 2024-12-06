import { Injectable, Logger } from '@nestjs/common';

@Injectable()
export class AppService {
  async getHello(): Promise<string> {
    const result = await new Promise<string>((s, f) => {
      console.log('Begin processing....');
      setTimeout(() => {
        Logger.log('Processing done.');
        Logger.error('we are here');
        s('Hello World!, are you there?');
      }, 0);
    });

    // return 'Hello World!, are you ok?';
    return result;
  }
}
