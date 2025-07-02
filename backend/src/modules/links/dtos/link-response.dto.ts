import { Expose } from 'class-transformer';

export class LinkResponseDto {
  @Expose()
  id: string;

  @Expose()
  originalUrl: string;

  @Expose()
  alias?: string;

  @Expose()
  expiresAt?: Date;

  @Expose()
  createdAt: Date;

  @Expose()
  updatedAt: Date;

  @Expose()
  clicks?: number;

  @Expose()
  isExpired?: boolean;

  @Expose()
  recentIps?: string[];
}
