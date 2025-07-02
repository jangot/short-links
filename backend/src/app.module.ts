import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';

import { LinksModule } from './modules/links/links.module';
import { configurationValidate } from './configuration/configuration-validate';

@Module({
  imports: [
    ConfigModule.forRoot({
      validate: configurationValidate,
      isGlobal: true,
      envFilePath: '.env',
    }),
    TypeOrmModule.forRootAsync({
      useFactory: (configService: ConfigService) => {
        const environment = configService.getOrThrow('NODE_ENV');
        const url = configService.getOrThrow('DATABASE_URL');

        return {
          type: 'postgres',
          url,
          entities: [__dirname + '/**/*.entity{.ts,.js}'],
          synchronize: environment === 'development',
          logging: environment === 'development',
        };
      },
      inject: [ConfigService],
    }),
    LinksModule,
  ],
})
export class AppModule {}
