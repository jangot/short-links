import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { LinksController } from './links.controller';
import { LinksService } from './services/links.service';
import { Link } from './entities/link.entity';
import { Visit } from './entities/visit.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Link, Visit])],
  controllers: [LinksController],
  providers: [LinksService],
})
export class LinksModule {}
