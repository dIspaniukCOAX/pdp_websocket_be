import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  HttpStatus,
  Logger,
} from '@nestjs/common';
import { Response } from 'express';

@Catch(HttpException)
export class HttpExceptionFilter implements ExceptionFilter {
  public readonly logger = new Logger(HttpExceptionFilter.name);

  catch(exception: HttpException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const status = exception.getStatus();

    let exceptionResponse = exception.getResponse();

    if (typeof exceptionResponse === 'string') {
      exceptionResponse = { message: [exceptionResponse] };
    }

    if (status >= HttpStatus.BAD_REQUEST) {
      this.logger.error(exception);
    }

    return response.status(status).json({
      statusCode: status,
      ...exceptionResponse,
    });
  }
}
