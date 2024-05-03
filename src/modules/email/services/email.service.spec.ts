import { faker } from '@faker-js/faker';
import { getQueueToken } from '@nestjs/bull';
import { ConfigService } from '@nestjs/config';
import { Test, TestingModule } from '@nestjs/testing';
import { Queue } from 'bull';

import { EmailTemplateIds } from '../../../constants/email.constant';
import { Queues } from '../../../enums/queues.enum';
import configServiceMock from '../../../mocks/config.service.mock';
import queueMock from '../../../mocks/queue.mock';
import { EEmailTypes } from '../enums/email-types.enum';
import { EmailService } from './email.service';

const mailjetMock = {
  post: jest.fn(() => mailjetMock),
  request: jest.fn(),
};

jest.mock('node-mailjet', () => {
  return jest.fn(() => mailjetMock);
});

const emailFrom = faker.internet.email();
const nameFrom = faker.internet.userName();

process.env.MJ_EMAIL_FROM = emailFrom;
process.env.MJ_NAME_FROM = nameFrom;

describe('EmailService', () => {
  let emailService: EmailService;
  let emailsQueue: Queue;

  beforeEach(async () => {
    const moduleRef: TestingModule = await Test.createTestingModule({
      imports: [],
      providers: [
        EmailService,
        {
          provide: ConfigService,
          useFactory: configServiceMock,
        },
        {
          provide: getQueueToken(Queues.Emails),
          useFactory: queueMock,
        },
      ],
    }).compile();

    emailService = moduleRef.get<EmailService>(EmailService);
    emailsQueue = moduleRef.get(getQueueToken(Queues.Emails));
  });

  it('EmailService - should be defined', () => {
    expect(emailService).toBeDefined();
  });

  describe('sendForgotPasswordEmail', () => {
    it('should send forgot password email', async () => {
      const recipientMail = faker.internet.email();
      const variables = {
        USER_NAME: faker.internet.userName(),
        RESTORE_PASSWORD_URL: faker.internet.url(),
      };

      jest.spyOn(emailsQueue, 'add').mockResolvedValueOnce(null);

      await emailService.sendForgotPasswordEmail(recipientMail, variables);

      expect(emailsQueue.add).toHaveBeenCalledWith({
        Messages: [
          {
            From: {
              Email: emailFrom,
              Name: nameFrom,
            },
            To: [{ Email: recipientMail }],
            TemplateID: EmailTemplateIds[EEmailTypes.FORGOT_PASSWORD_EMAIL],
            Variables: variables,
            TemplateLanguage: true,
          },
        ],
      });
    });
  });

  describe('sendPasswordChangedEmail', () => {
    it('should send forgot password email', async () => {
      const recipientMail = faker.internet.email();

      jest.spyOn(emailsQueue, 'add').mockResolvedValueOnce(null);

      await emailService.sendPasswordChangedEmail(recipientMail);

      expect(emailsQueue.add).toHaveBeenCalledWith({
        Messages: [
          {
            From: {
              Email: emailFrom,
              Name: nameFrom,
            },
            To: [{ Email: recipientMail }],
            TemplateID: EmailTemplateIds[EEmailTypes.PASSWORD_CHANGED_EMAIL],
          },
        ],
      });
    });
  });

  describe('sendNewLoginEmail', () => {
    it('should send forgot password email', async () => {
      const recipientMail = faker.internet.email();

      jest.spyOn(emailsQueue, 'add').mockResolvedValueOnce(null);

      await emailService.sendNewLoginEmail(recipientMail);

      expect(emailsQueue.add).toHaveBeenCalledWith({
        Messages: [
          {
            From: {
              Email: emailFrom,
              Name: nameFrom,
            },
            To: [{ Email: recipientMail }],
            TemplateID: EmailTemplateIds[EEmailTypes.NEW_LOGIN],
          },
        ],
      });
    });
  });
});
