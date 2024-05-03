import { InjectQueue } from '@nestjs/bull';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Queue } from 'bull';

import { EmailTemplateIds } from '../../../constants/email.constant';
import { Queues } from '../../../enums/queues.enum';
import { EEmailTypes } from '../enums/email-types.enum';

@Injectable()
export class EmailService {
  private readonly from: { Email: string; Name: string };

  constructor(
    private readonly configService: ConfigService,
    @InjectQueue(Queues.Emails)
    private readonly emailsQueue: Queue,
  ) {
    this.from = {
      Email: this.configService.get<string>('MJ_EMAIL_FROM'),
      Name: this.configService.get<string>('MJ_NAME_FROM'),
    };
  }

  public async sendForgotPasswordEmail(
    recipientMail: string,
    variables: { RESTORE_PASSWORD_URL: string },
  ) {
    const data = {
      Messages: [
        {
          From: this.from,
          To: [{ Email: recipientMail }],
          TemplateID: EmailTemplateIds[EEmailTypes.FORGOT_PASSWORD_EMAIL],
          Variables: variables,
          TemplateLanguage: true,
        },
      ],
    };

    await this.emailsQueue.add(data);
  }

  public async sendPasswordChangedEmail(recipientMail: string) {
    const data = {
      Messages: [
        {
          From: this.from,
          To: [{ Email: recipientMail }],
          TemplateID: EmailTemplateIds[EEmailTypes.PASSWORD_CHANGED_EMAIL],
        },
      ],
    };

    await this.emailsQueue.add(data);
  }

  public async sendNewLoginEmail(recipientMail: string) {
    const data = {
      Messages: [
        {
          From: this.from,
          To: [{ Email: recipientMail }],
          TemplateID: EmailTemplateIds[EEmailTypes.NEW_LOGIN],
        },
      ],
    };

    await this.emailsQueue.add(data);
  }

  public async sendRegisteredEmail(recipientMail: string) {
    const data = {
      Messages: [
        {
          From: this.from,
          To: [{ Email: recipientMail }],
          TemplateID: EmailTemplateIds[EEmailTypes.REGISTERED],
        },
      ],
    };

    await this.emailsQueue.add(data);
  }
}
