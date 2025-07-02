import { LinksServiceErrorCode } from './links-service-error-codes';

export class LinksServiceException extends Error {
  public readonly code: LinksServiceErrorCode;

  constructor(code: LinksServiceErrorCode, message: string) {
    super(message);
    this.code = code;
    this.name = 'LinksServiceException';
  }
}
