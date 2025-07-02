import {
  IsUrl,
  IsNotEmpty,
  IsOptional,
  IsDateString,
  IsString,
  MaxLength,
  Matches,
} from 'class-validator';

export class CreateLinkDto {
  @IsUrl()
  @IsNotEmpty()
  originalUrl: string;

  @IsOptional()
  @IsString()
  @MaxLength(50)
  alias?: string;

  @IsOptional()
  @IsDateString({}, { message: 'expiresAt must be a valid ISO 8601 date string' })
  @Matches(/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(\.\d{3})?Z$/, {
    message: 'expiresAt must be in ISO 8601 format with UTC timezone (e.g. 2024-12-31T23:59:59.000Z)',
  })
  expiresAt?: string;
}
