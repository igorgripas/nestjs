import {Test, TestingModule} from '@nestjs/testing';
import {INestApplication} from '@nestjs/common';
import * as request from 'supertest';
import {AppModule} from './../src/app.module';
import {disconnect} from 'mongoose';
import {AuthDto} from '../src/auth/dto/auth.dto';

describe('AuthController (e2e)', () => {
  let app: INestApplication;
  let createdId: string;
  let token: string;

  beforeEach(async () => {
		const moduleFixture: TestingModule = await Test.createTestingModule({
			imports: [AppModule],
		}).compile();

		app = moduleFixture.createNestApplication();
		await app.init();
	});

  it('/auth/login (POST) - success', async (done) => {
		const loginDto: AuthDto = {
			login: 'test@test.com',
			password: 'secret'
		}
		return request(app.getHttpServer())
			.post('/auth/login')
			.send(loginDto)
			.expect(200)
			.then(({body}: request.Response) => {
				expect(body.access_token).toBeDefined();
				done();
			});
  });

	it('/auth/login (POST) - fail password', () => {
		const loginDto: AuthDto = {
			login: 'test@test.com',
			password: 'fail'
		}
		return request(app.getHttpServer())
			.post('/auth/login')
			.send(loginDto)
			.expect(401);
	});

	it('/auth/login (POST) - fail login', () => {
		const loginDto: AuthDto = {
			login: 'wrong',
			password: 'secret'
		}
		return request(app.getHttpServer())
			.post('/auth/login')
			.send(loginDto)
			.expect(401);
	});

	afterAll(() => {
		disconnect();
	})
});
