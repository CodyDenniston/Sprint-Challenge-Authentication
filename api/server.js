const express = require('express');
const helmet = require('helmet');
const cors = require('cors');
const session = require('express-session');

const authenticate = require('../auth/authenticate-middleware.js');
const authRouter = require('../auth/auth-router.js');
const jokesRouter = require('../jokes/jokes-router.js');
const usersRouter = require('../users/users-router.js');

const server = express();

const sessionConfig = {
	name: 'monster',
	secret: process.env.SESSION_SECRET || 'keep it secret, keep it safe!',
	resave: false,
	saveUninitialized: process.env.SEND_COOKIES || true,
	cookie: {
		maxAge: 1000 * 60 * 10, // good for 10 mins in ms
		secure: process.env.USE_SECURE_COOKIES || false, // used over https only, set to true in production
		httpOnly: true, // true means JS on the client cannot access the cooke
	},
};

server.use(helmet());
server.use(cors());
server.use(express.json());
server.use(session(sessionConfig));

server.use('/api/auth', authRouter);
server.use('/api/jokes', authenticate, jokesRouter);
server.use('/api/users', usersRouter);

server.get('/', (req, res) => {
	res.json({ api: 'up' });
});

module.exports = server;
