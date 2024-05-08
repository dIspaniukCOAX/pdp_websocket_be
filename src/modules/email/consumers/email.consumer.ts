import { Process, Processor } from '@nestjs/bull';
import { Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Job } from 'bull';
import Mailjet from 'node-mailjet';
import { RequestData } from 'node-mailjet/declarations/request/Request';

import { Queues } from '../../../enums/queues.enum';

@Processor(Queues.Emails)
export class EmailConsumer {
  public readonly logger = new Logger(EmailConsumer.name);

  private readonly client: Mailjet;

  constructor(private readonly configService: ConfigService) {
    this.client = new Mailjet({
      apiKey: this.configService.get<string>('MJ_APIKEY_PUBLIC'),
      apiSecret: this.configService.get<string>('MJ_APIKEY_PRIVATE'),
    });
  }

  @Process()
  async sendEmail(job: Job<RequestData>) {
    try {
      await this.client.post('send', { version: 'v3.1' }).request(job.data);
    } catch (error) {
      this.logger.error(error);
    }
  }
}
