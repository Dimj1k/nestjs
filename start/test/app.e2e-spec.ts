import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from './../src/app.module';
import { CreateReviewDto } from 'src/review/dto/review.dto';
import { disconnect, Types } from 'mongoose';
import { REVIEW_IS_NOT_FOUND } from '../src/review/review.constants';
import { AuthDto } from 'src/auth/dto/auth.dto';

const productId = '112';

let createdId;

const testReview: CreateReviewDto = {
  name: 'Тест',
  title: 'title',
  description: 'review description',
  rating: 5,
  productId,
};

const userLogin: AuthDto = {
  email: 'd@d.ru',
  password: '123',
};

describe('AppController (e2e)', () => {
  let app: INestApplication;
  let accessToken: string;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();

    let { body } = await request(app.getHttpServer())
      .post('/auth/login')
      .send(userLogin);
    accessToken = body.accessToken;
  });

  test('/review/create (POST)', async () => {
    return request(app.getHttpServer())
      .post('/review/create')
      .send(testReview)
      .set('Authorization', `Bearer ${accessToken}`)
      .expect(201)
      .then(({ body }: request.Response) => {
        createdId = body._id;
        expect(createdId).toBeDefined();
      });
  });

  it('/review/byProduct/:id (GET) - success', () => {
    return request(app.getHttpServer())
      .get(`/review/byProduct/${productId}`)
      .set('Authorization', `Bearer ${accessToken}`)
      .expect(200)
      .then(({ body }: request.Response) => {
        expect(body.length).toBe(1);
      });
  });

  it('/review/:id (GET) - fail', () => {
    return request(app.getHttpServer())
      .get(`/review/byProduct/${327}`)
      .set('Authorization', `Bearer ${accessToken}`)
      .expect(200)
      .then(({ body }: request.Response) => {
        expect(body.length).toBe(0);
      });
  });

  it('/review/:id (DELETE) - success', () => {
    return request(app.getHttpServer())
      .delete(`/review/${createdId}`)
      .set('Authorization', `Bearer ${accessToken}`)
      .expect(200);
  });

  it('/review/:id (DELETE) - fail', () => {
    return request(app.getHttpServer())
      .delete(`/review/${new Types.ObjectId().toHexString()}`)
      .set('Authorization', `Bearer ${accessToken}`)
      .expect(404, { statusCode: 404, message: REVIEW_IS_NOT_FOUND });
  });

  afterAll(disconnect);
});
