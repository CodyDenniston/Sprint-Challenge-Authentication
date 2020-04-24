const request = require('supertest');

const server = require('./server.js');
const db = require('../database/dbConfig');

describe('server', function () {
	describe('GET /', function () {
		it('should return status 200', function () {
			// make a GET request to / endpoint on the server
			return request(server) // return the async call to let jest know it should wait
				.get('/')
				.then(res => {
					// assert that the HTTP status code is 200
					expect(res.status).toBe(200);
				});
		});
		it('should return api up', function () {
			// make a GET request to / endpoint on the server
			return request(server) // return the async call to let jest know it should wait
				.get('/')
				.then(res => {
					// assert that the HTTP status code is 200
					expect(res.body.api).toBe('up');
				});
		});
	});

	describe('POST /register', function () {
		beforeEach(async () => {
			await db('users').truncate(); // empty the table and reset the id back to 1
		});

		it('should hash password', function () {
			return request(server)
				.post('/api/auth/register')
				.send({ username: 'CoDy', password: 'GoBy' })
				.then(res => {
					expect(res.body.password).not.toBe('GoBy');
				});
		});

		it('add the user to the db', async function () {
			const existing = await db('users').where({ username: 'Shrek' });
			expect(existing).toHaveLength(0);

			await request(server)
				.post('/api/auth/register')
				.send({ username: 'Shrek', password: 'isLove&life' })
				.then(res => {
					expect(res.body.username).toBe('Shrek');
				});

			const inserted = await db('users'); //.where({ name: userName });
			expect(inserted).toHaveLength(1);
		});
	});
	describe('POST /login', function () {
		it('returns 200 on success', function () {
			return request(server)
				.post('/api/auth/login')
				.send({ username: 'Shrek', password: 'isLove&life' })
				.then(res => {
					expect(res.status).toBe(200);
				});
		});
		it('returns welcome message', function () {
			return request(server)
				.post('/api/auth/login')
				.send({ username: 'Shrek', password: 'isLove&life' })
				.then(res => {
					expect(res.body.message).toBe('Welcome!');
				});
		});
	});
	describe('GET /jokes', function () {
		it('should return status 200', function () {
			// make a GET request to / endpoint on the server
			request(server) // return the async call to let jest know it should wait
				.get('/api/jokes')
				.then(res => {
					// assert that the HTTP status code is 200
					expect(res.status).toBe(200);
				});
		});
		it('should return something in postman', function () {
			// make a GET request to / endpoint on the server
			request(server) // return the async call to let jest know it should wait
				.get('/api/jokes')
				.then(res => {
					// assert that the HTTP status code is 200
					expect(res.body).toBeTruthy();
				});
		});
	});
});
