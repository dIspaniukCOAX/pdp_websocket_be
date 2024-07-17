import { VersioningType } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import { NestExpressApplication } from '@nestjs/platform-express';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { I18nValidationExceptionFilter, I18nValidationPipe } from 'nestjs-i18n';

import { AppModule } from './app.module';
import {
  errorFormatter,
  HttpExceptionFilter,
  InternalServerErrorInterceptor,
} from './utils';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);

  const configService = app.get(ConfigService);

  app.useGlobalPipes(new I18nValidationPipe());

  app.useGlobalFilters(
    new HttpExceptionFilter(),
    new I18nValidationExceptionFilter({ errorFormatter }),
  );

  app.useGlobalInterceptors(new InternalServerErrorInterceptor());

  app.enableVersioning({ type: VersioningType.URI, defaultVersion: '1' });

  app.setGlobalPrefix('api');

  app.enableCors({
    origin:
      configService.get<string>('NODE_ENV') === 'production'
        ? configService
            .get('WHITELISTED_ORIGINS', 'http://localchat:4200')
            .split(',')
        : '*',
  });

  const options = new DocumentBuilder()
    .setTitle('Chat app API')
    .setDescription(
      'Chat app API is a RESTful API. It is built with NestJS, TypeORM, and PostgreSQL.',
    )
    .setVersion('1.0')
    .addBearerAuth()
    .build();

  const document = SwaggerModule.createDocument(app, options);
  SwaggerModule.setup('api/docs', app, document);

  await app.listen(configService.get('PORT', 3000));
}

bootstrap();
