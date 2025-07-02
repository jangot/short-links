import { LinksServiceException } from './links-service.exception';
import { LinksServiceErrorCode } from './links-service-error-codes';

export class AliasAlreadyExistsException extends LinksServiceException {
  constructor(alias: string) {
    super(
      LinksServiceErrorCode.ALIAS_ALREADY_EXISTS,
      `Alias '${alias}' already exists`,
    );
  }
}
