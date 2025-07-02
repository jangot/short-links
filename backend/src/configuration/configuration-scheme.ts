import { IsInt, IsString } from 'class-validator';
import { Transform } from 'class-transformer';

export class ConfigurationScheme {
  @IsString()
  NODE_ENV: string = 'development';

  @Transform(({ value }) => Number(value))
  @IsInt()
  APP_PORT: number = 3001;

  @IsString()
  DATABASE_URL: string;
}
