import {
  Controller,
  Get,
  Post,
  Delete,
  Body,
  Param,
  Req,
  UseFilters,
  HttpCode,
  HttpStatus,
  UseInterceptors,
} from '@nestjs/common';
import { Request } from 'express';
import { plainToInstance } from 'class-transformer';

import { LinksService } from './services/links.service';
import { CreateLinkDto } from './dtos/create-link.dto';
import { LinkResponseDto } from './dtos/link-response.dto';
import { LinkAnalyticsDto } from './dtos/link-analytics.dto';
import { ApiResponseDto } from './dtos/api-response.dto';
import { CreateLinkInterface } from './interfaces/create-link.interface';
import { CreateVisitInterface } from './interfaces/create-visit.interface';
import { LinksExceptionFilter } from './filters/links-exception.filter';
import { RedirectInterceptor } from '../../interceptors/redirect.interceptor';
import { responseTransformOptions } from '../../configuration/response-transform-options';

@UseFilters(LinksExceptionFilter)
@Controller()
export class LinksController {
  constructor(private readonly linksService: LinksService) {}

  @Post('shorten')
  @HttpCode(HttpStatus.CREATED)
  async createLink(
    @Body() createLinkDto: CreateLinkDto,
  ): Promise<ApiResponseDto<LinkResponseDto>> {
    const createLinkData: CreateLinkInterface = {
      originalUrl: createLinkDto.originalUrl,
      alias: createLinkDto.alias,
      expiresAt: createLinkDto.expiresAt,
    };

    const link = await this.linksService.createLink(createLinkData);
    return {
      data: plainToInstance(LinkResponseDto, link, responseTransformOptions),
    };
  }

  @Get(':idOrAlias')
  @UseInterceptors(RedirectInterceptor)
  async redirectToOriginal(
    @Param('idOrAlias') idOrAlias: string,
    @Req() req: Request,
  ) {
    // Here can be different logic for getting IP. It depends on a infrastructure
    const visitData: CreateVisitInterface = {
      ip: req.ip || req.socket.remoteAddress,
    };

    const link = await this.linksService.getLinkAndCreateVisitSingleQuery(
      idOrAlias,
      visitData,
    );

    return { redirectUrl: link.originalUrl };
  }

  @Get('info/:idOrAlias')
  async getLinkInfo(
    @Param('idOrAlias') idOrAlias: string,
  ): Promise<ApiResponseDto<LinkResponseDto>> {
    const link = await this.linksService.getLinkByIdOrAlias(idOrAlias);
    return {
      data: plainToInstance(LinkResponseDto, link, responseTransformOptions),
    };
  }

  @Get('analytics/:idOrAlias')
  async getLinkAnalytics(
    @Param('idOrAlias') idOrAlias: string,
  ): Promise<ApiResponseDto<LinkAnalyticsDto>> {
    const analytics = await this.linksService.getLinkAnalytics(idOrAlias);
    return {
      data: plainToInstance(
        LinkAnalyticsDto,
        analytics,
        responseTransformOptions,
      ),
    };
  }

  @Delete('delete/:idOrAlias')
  @HttpCode(HttpStatus.OK)
  async deleteLink(
    @Param('idOrAlias') idOrAlias: string,
  ): Promise<ApiResponseDto<{ message: string }>> {
    await this.linksService.deleteLink(idOrAlias);
    return {
      data: { message: 'Link deleted successfully' },
    };
  }
}
