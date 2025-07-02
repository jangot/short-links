import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpStatus,
} from '@nestjs/common';
import { Response } from 'express';
import { LinksServiceException, LinksServiceErrorCode } from '../exceptions';

@Catch(LinksServiceException)
export class LinksExceptionFilter implements ExceptionFilter {
  catch(exception: LinksServiceException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const res = ctx.getResponse<Response>();

    let status = HttpStatus.INTERNAL_SERVER_ERROR;
    switch (exception.code) {
      case LinksServiceErrorCode.LINK_NOT_FOUND:
        status = HttpStatus.NOT_FOUND;
        break;
      case LinksServiceErrorCode.ALIAS_ALREADY_EXISTS:
        status = HttpStatus.BAD_REQUEST;
        break;
      case LinksServiceErrorCode.SHORT_CODE_GENERATION_FAILED:
        status = HttpStatus.INTERNAL_SERVER_ERROR;
        break;
      default:
        status = HttpStatus.INTERNAL_SERVER_ERROR;
    }

    res.status(status).json({
      error: {
        code: exception.code,
        message: exception.message,
      },
    });
  }
}
