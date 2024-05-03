import { BullModule } from '@nestjs/bull';
import { Module } from '@nestjs/common';

import { Queues } from '../../enums/queues.enum';
import { EmailConsumer } from './consumers/email.consumer';
import { EmailService } from './services/email.service';

@Module({
  imports: [
    BullModule.registerQueue({
      name: Queues.Emails,
      defaultJobOptions: {
        removeOnComplete: true,
        removeOnFail: true,
      },
    }),
  ],
  providers: [EmailService, EmailConsumer],
  exports: [EmailService],
})
export class EmailModule {}
