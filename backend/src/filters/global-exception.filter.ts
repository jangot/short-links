import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpStatus,
  Logger,
} from '@nestjs/common';
import { Response } from 'express';

@Catch()
export class GlobalExceptionFilter implements ExceptionFilter {
  private readonly logger = new Logger(GlobalExceptionFilter.name);

  catch(exception: any, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const res = ctx.getResponse<Response>();

    let status = HttpStatus.INTERNAL_SERVER_ERROR;
    let message = 'Internal server error';

    if (exception.status) {
      status = exception.status;
    } else if (exception.statusCode) {
      status = exception.statusCode;
    }

    if (exception.message) {
      message = exception.message;
    }

    if (status >= 500 || !exception.status) {
      this.logger.error(
        `Unhandled exception: ${exception.message || 'Unknown error'}`,
        exception.stack,
        'GlobalExceptionFilter',
      );
    }

    const errorResponse = {
      error: {
        code: status >= 500 ? 'INTERNAL_SERVER_ERROR' : 'UNKNOWN_ERROR',
        message: message,
        ...(status >= 500 && { timestamp: new Date().toISOString() }),
      },
    };

    res.status(status).json(errorResponse);
  }
}
