import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, DataSource } from 'typeorm';

import { Link } from '../entities/link.entity';
import { Visit } from '../entities/visit.entity';
import { CreateLinkInterface } from '../interfaces/create-link.interface';
import { CreateVisitInterface } from '../interfaces/create-visit.interface';
import {
  LinkNotFoundException,
  AliasAlreadyExistsException,
} from '../exceptions';

@Injectable()
export class LinksService {
  private readonly logger = new Logger(LinksService.name);

  constructor(
    @InjectRepository(Link)
    private linksRepository: Repository<Link>,
    @InjectRepository(Visit)
    private visitsRepository: Repository<Visit>,
    private dataSource: DataSource,
  ) {}

  async createLink(createLinkData: CreateLinkInterface): Promise<Link> {
    try {
      const result = await this.dataSource.query(
        `
        INSERT INTO "links" (id, "originalUrl", alias, "expiresAt", "createdAt", "updatedAt")
        VALUES (
          gen_random_uuid(),
          $1,
          $2,
          $3,
          NOW(),
          NOW()
        )
        RETURNING id, "originalUrl", alias, "expiresAt", "createdAt", "updatedAt"
        `,
        [
          createLinkData.originalUrl,
          createLinkData.alias || null,
          createLinkData.expiresAt ? new Date(createLinkData.expiresAt) : null,
        ],
      );

      if (result.length > 0) {
        const link = result[0];
        this.logger.log(`Link created: ${link.id} -> ${link.originalUrl}`);
        return link;
      }
    } catch (error) {
      if (this.isUniqueConstraintViolation(error)) {
        const constraintName = this.getConstraintName(error);
        if (constraintName?.includes('UQ_ALIAS') && createLinkData.alias) {
          this.logger.warn(`Alias already exists: ${createLinkData.alias}`);
          throw new AliasAlreadyExistsException(createLinkData.alias);
        }
      }
      this.logger.error('Failed to create link:', error);
      throw error;
    }
    throw new Error('Failed to create link');
  }

  private isUniqueConstraintViolation(error: any): boolean {
    return (
      error.code === '23505' || // PostgreSQL unique violation
      error.message?.includes('duplicate key') ||
      error.message?.includes('UNIQUE constraint')
    );
  }

  private getConstraintName(error: any): string | null {
    if (error.constraint) {
      return error.constraint;
    }

    const match = error.message?.match(/constraint "([^"]+)"/);
    return match ? match[1] : null;
  }

  async getLinkByIdOrAlias(idOrAlias: string): Promise<Link> {
    const link = await this.linksRepository
      .createQueryBuilder('link')
      .where(
        `(
          (link.id::text = :value AND :value ~* '^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$')
          OR link.alias = :value
        )`,
      )
      .setParameter('value', idOrAlias)
      .getOne();

    if (!link) {
      throw new LinkNotFoundException();
    }

    return link;
  }

  async getLinkAndCreateVisitSingleQuery(
    idOrAlias: string,
    visitData: CreateVisitInterface,
  ): Promise<Link> {
    if (!idOrAlias?.trim()) {
      throw new LinkNotFoundException();
    }
    const trimmedIdOrAlias = idOrAlias.trim();

    try {
      const result = await this.dataSource.query(
        `
        WITH link_found AS (
          SELECT id, "originalUrl", alias, "expiresAt"
          FROM "links"
          WHERE (
            (CASE 
               WHEN $1 ~* '^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$'
               THEN id::text = $1
               ELSE FALSE
             END)
            OR alias = $1
          )
          AND ("expiresAt" IS NULL OR "expiresAt" > NOW())
          LIMIT 1
        ),
        visit_created AS (
          INSERT INTO "visits" (id, "linkId", ip, "createdAt", "updatedAt")
          SELECT
            gen_random_uuid(),
            lf.id,
            $2,
            NOW(),
            NOW()
          FROM link_found lf
          RETURNING "linkId"
        )
        SELECT
          lf.id,
          lf."originalUrl",
          lf.alias,
          lf."expiresAt"
        FROM link_found lf
        INNER JOIN visit_created vc ON lf.id = vc."linkId"
      `,
        [trimmedIdOrAlias, visitData.ip],
      );

      if (result.length === 0) {
        this.logger.warn(`Link not found or expired: ${idOrAlias}`);
        throw new LinkNotFoundException();
      }

      const link = result[0];
      this.logger.log(
        `Visit recorded for link: ${link.id} (IP: ${visitData.ip})`,
      );
      return link;
    } catch (error) {
      this.logger.error(`Failed to process visit for ${idOrAlias}:`, error);
      throw error;
    }
  }

  async deleteLink(idOrAlias: string): Promise<void> {
    const link = await this.getLinkByIdOrAlias(idOrAlias);
    await this.linksRepository.remove(link);
  }

  async getLinkAnalytics(idOrAlias: string) {
    const link = await this.getLinkByIdOrAlias(idOrAlias);

    if (!link) {
      throw new LinkNotFoundException();
    }

    const [clicks, recentVisits] = await Promise.all([
      this.visitsRepository.count({
        where: { linkId: link.id },
      }),
      this.visitsRepository.find({
        where: { linkId: link.id },
        select: ['ip'],
        order: { createdAt: 'DESC' },
        take: 5,
      }),
    ]);

    return {
      id: link.id,
      originalUrl: link.originalUrl,
      alias: link.alias,
      expiresAt: link.expiresAt,
      clicks,
      recentIps: recentVisits.map((v) => v.ip).filter((ip) => ip),
    };
  }
}
