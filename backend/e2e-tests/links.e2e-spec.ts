import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { v4 as uuidv4 } from 'uuid';

import { AppModule } from '../src/app.module';

function generateAlias() {
  return 'ali_' + uuidv4().replace(/\s/g, '-');
}

describe('Links (e2e)', () => {
  let app: INestApplication;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  describe('POST /shorten', () => {
    it('should create a link with unique alias', async () => {
      const createLinkDto = {
        originalUrl: 'https://example.com',
        alias: generateAlias(),
      };

      const response = await request(app.getHttpServer())
        .post('/shorten')
        .send(createLinkDto)
        .expect(201);

      expect(response.body.data).toHaveProperty('id');
      expect(response.body.data.originalUrl).toBe(createLinkDto.originalUrl);
      expect(response.body.data.alias).toBe(createLinkDto.alias);
      expect(response.body.data).toHaveProperty('createdAt');
      expect(response.body.data).toHaveProperty('updatedAt');
    });

    it('should fail when creating link with duplicate alias', async () => {
      const uniqueAlias = generateAlias();
      const createLinkDto = {
        originalUrl: 'https://example.com',
        alias: uniqueAlias,
      };

      await request(app.getHttpServer())
        .post('/shorten')
        .send(createLinkDto)
        .expect(201);

      const response = await request(app.getHttpServer())
        .post('/shorten')
        .send(createLinkDto)
        .expect(400);

      expect(response.body.error.code).toBe('ALIAS_ALREADY_EXISTS');
      expect(response.body.error.message).toContain(uniqueAlias);
    });
  });

  describe('GET /:idOrAlias', () => {
    it('should redirect to original URL when accessing by id', async () => {
      const createLinkDto = {
        originalUrl: 'https://google.com',
        alias: generateAlias(),
      };

      const createResponse = await request(app.getHttpServer())
        .post('/shorten')
        .send(createLinkDto)
        .expect(201);

      const linkId = createResponse.body.data.id;

      const redirectResponse = await request(app.getHttpServer())
        .get(`/${linkId}`)
        .expect(302);

      expect(redirectResponse.headers.location).toBe(createLinkDto.originalUrl);
    });

    it('should redirect to original URL when accessing by alias', async () => {
      const createLinkDto = {
        originalUrl: 'https://yandex.ru',
        alias: generateAlias(),
      };

      await request(app.getHttpServer())
        .post('/shorten')
        .send(createLinkDto)
        .expect(201);

      const redirectResponse = await request(app.getHttpServer())
        .get(`/${createLinkDto.alias}`)
        .expect(302);

      expect(redirectResponse.headers.location).toBe(createLinkDto.originalUrl);
    });

    it('should create visit record when redirecting', async () => {
      const createLinkDto = {
        originalUrl: 'https://example.com',
        alias: generateAlias(),
      };

      await request(app.getHttpServer())
        .post('/shorten')
        .send(createLinkDto)
        .expect(201);

      await request(app.getHttpServer())
        .get(`/${createLinkDto.alias}`)
        .expect(302);

      const { body } = await request(app.getHttpServer())
        .get(`/analytics/${createLinkDto.alias}`)
        .expect(200);

      expect(body.data.clicks).toEqual(1);
      expect(body.data.recentIps[0]).toEqual('::ffff:127.0.0.1');
    });

    it('should not redirect when link is expired', async () => {
      const pastDate = new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(); // 1 day ago
      const createLinkDto = {
        originalUrl: 'https://example.com',
        alias: generateAlias(),
        expiresAt: pastDate,
      };

      const createResponse = await request(app.getHttpServer())
        .post('/shorten')
        .send(createLinkDto)
        .expect(201);

      const linkId = createResponse.body.data.id;
      await request(app.getHttpServer()).get(`/${linkId}`).expect(404); // Should return 404 for expired links
    });

    it('should not redirect when link alias is expired', async () => {
      const pastDate = new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(); // 1 day ago
      const createLinkDto = {
        originalUrl: 'https://example.com',
        alias: generateAlias(),
        expiresAt: pastDate,
      };

      await request(app.getHttpServer())
        .post('/shorten')
        .send(createLinkDto)
        .expect(201);

      await request(app.getHttpServer())
        .get(`/${createLinkDto.alias}`)
        .expect(404);
    });

    it('should redirect when link is not expired', async () => {
      const futureDate = new Date(
        Date.now() + 24 * 60 * 60 * 1000,
      ).toISOString(); // 1 day from now
      const createLinkDto = {
        originalUrl: 'https://example.com',
        alias: generateAlias(),
        expiresAt: futureDate,
      };

      const createResponse = await request(app.getHttpServer())
        .post('/shorten')
        .send(createLinkDto)
        .expect(201);

      const linkId = createResponse.body.data.id;

      // Should redirect for non-expired links
      const redirectResponse = await request(app.getHttpServer())
        .get(`/${linkId}`)
        .expect(302);

      expect(redirectResponse.headers.location).toBe(createLinkDto.originalUrl);
    });
  });

  describe('GET /info', () => {
    it('should return link info', async () => {
      const createLinkDto = {
        originalUrl: 'https://example.com',
        alias: generateAlias(),
      };

      await request(app.getHttpServer())
        .post('/shorten')
        .send(createLinkDto)
        .expect(201);

      const { body } = await request(app.getHttpServer())
        .get(`/info/${createLinkDto.alias}`)
        .expect(200);

      expect(body.data.originalUrl).toBe(createLinkDto.originalUrl);
    });

    it('should return link info by id', async () => {
      const createLinkDto = {
        originalUrl: 'https://example.com/for-id',
      };

      const link = await request(app.getHttpServer())
        .post('/shorten')
        .send(createLinkDto)
        .expect(201);

      const { body } = await request(app.getHttpServer())
        .get(`/info/${link.body.data.id}`)
        .expect(200);

      expect(body.data.originalUrl).toBe(createLinkDto.originalUrl);
    });
  });
});
