import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from './../src/app.module';
import {CreateReviewDto} from '../src/review/dto/create-review.dto';
import {Types, disconnect } from 'mongoose';
import {REVIEW_NOT_FOUND} from '../src/review/review.constants';
import {AuthDto} from '../dist/auth/dto/auth.dto';

const AUTH_TOKEN = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6InRlc3RAdGVzdC5jb20iLCJpYXQiOjE2MjgxNzI5NDh9.qexpPAtw6IficrWE1kLzHNsIf0uT-rt2Bg7oxSz1P20";
const productId = new Types.ObjectId().toHexString();

const testDto: CreateReviewDto = {
	description: 'Description',
	name: 'Test',
	productId: productId,
	rating: 5,
	title: 'Title'

}

const loginDto: AuthDto = {
	login: 'test@test.com',
	password: 'secret'
}

describe('ReviewController (e2e)', () => {
  let app: INestApplication;
  let createdId: string;
  let token: string;

  beforeEach(async () => {
		const moduleFixture: TestingModule = await Test.createTestingModule({
			imports: [AppModule],
		}).compile();

		app = moduleFixture.createNestApplication();
		await app.init();

		const res = await request(app.getHttpServer())
			.post('/auth/login')
			.send(loginDto);
		token = res.body.access_token;
  });

  it('/review/create (POST) - success', async (done) => {
		return request(app.getHttpServer())
			.post('/review/create')
			.send(testDto)
			.expect(201)
			.then(({body}: request.Response) => {
				createdId = body._id;
				expect(createdId).toBeDefined();
				done();
			});
  });

	it('/review/create (POST) - faile', async () => {
		return request(app.getHttpServer())
			.post('/review/create')
			.send({...testDto, rating: 0})
			.expect(400)
	});

	it('/review/byProduct/:productId (GET) - success',  async (done) => {
		return request(app.getHttpServer())
			.get('/review/byProduct/' + productId)
			// @ts-ignore
			.auth(token, {type: 'bearer'})
			.expect(200)
			.then(({body}: request.Response) => {
				expect(body.length).toBe(1);
				done();
			});
	});

	it('/review/byProduct/:productId (GET) - fail',  async (done) => {
		return request(app.getHttpServer())
			.get('/review/byProduct/' + new Types.ObjectId().toHexString())
			.auth(token, {type: 'bearer'})
			.expect(200)
			.then(({body}: request.Response) => {
				expect(body.length).toBe(0);
				done();
			});
	});

	it('/review/:id (DELETE) - success ',() => {
		return request(app.getHttpServer())
			.delete('/review/' + createdId)
			.auth(AUTH_TOKEN, {type: 'bearer'})
			.expect(200)
	});

	it('/review/:id (DELETE) - fail ',() => {
		return request(app.getHttpServer())
			.delete('/review/' + new Types.ObjectId().toHexString())
			.expect(404, {
				statusCode: 404,
				message: REVIEW_NOT_FOUND
			})
	});


	afterAll(() => {
		disconnect();
	})
});
