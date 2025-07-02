import { LinksServiceException } from './links-service.exception';
import { LinksServiceErrorCode } from './links-service-error-codes';

export class ShortCodeGenerationFailedException extends LinksServiceException {
  constructor(attempts: number) {
    super(
      LinksServiceErrorCode.SHORT_CODE_GENERATION_FAILED,
      `Unable to generate unique short code after ${attempts} attempts`,
    );
  }
}
