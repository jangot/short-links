import { Expose, Transform } from 'class-transformer';

export class LinkAnalyticsDto {
  @Expose()
  id: string;

  @Expose()
  originalUrl: string;

  @Expose()
  alias: string | null;

  @Expose()
  clicks: number;

  @Expose()
  recentIps: string[];

  @Expose()
  @Transform(({ obj }) => (obj.expiresAt ? new Date() > obj.expiresAt : false))
  isExpired: boolean;
}
