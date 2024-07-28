import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from './../src/app.module';
import { CreateReviewDto } from 'src/review/dto/review.dto';
import { disconnect } from 'mongoose';
import { AuthDto } from 'src/auth/dto/auth.dto';
import {
  INCORRECT_PASSWORD,
  USER_IS_NOT_FOUND,
} from '../src/auth/auth.constants';

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
  email: 'd11@d.ru',
  password: '1234',
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
  });

  test('/auth/login - success', async () => {
    return await request(app.getHttpServer())
      .post('/auth/login')
      .send(userLogin)
      .expect(200)
      .then(({ body }: request.Response) => {
        expect(body.accessToken).toBeDefined();
      });
  });

  test('/auth/login - fail (email)', async () => {
    return await request(app.getHttpServer())
      .post('/auth/login')
      .send({ email: 'dsaihoouhqwhoiuq@uhodsauhio.ru', password: 'oiuhiuog' })
      .expect(401, {
        error: 'Unauthorized',
        message: USER_IS_NOT_FOUND,
        statusCode: 401,
      });
  });

  test('/auth/login - fail (password)', async () => {
    return await request(app.getHttpServer())
      .post('/auth/login')
      .send({ email: userLogin.email, password: '312421dfk' })
      .expect(401, {
        error: 'Unauthorized',
        message: INCORRECT_PASSWORD,
        statusCode: 401,
      });
  });

  afterAll(disconnect);
});
