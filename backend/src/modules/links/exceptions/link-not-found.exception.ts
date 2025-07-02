import { LinksServiceException } from './links-service.exception';
import { LinksServiceErrorCode } from './links-service-error-codes';

export class LinkNotFoundException extends LinksServiceException {
  constructor(message: string = 'Link not found') {
    super(LinksServiceErrorCode.LINK_NOT_FOUND, message);
  }
}
