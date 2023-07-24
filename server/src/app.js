import cors from 'cors';
import cookieParser from 'cookie-parser';
import logger from 'morgan';
import session from 'express-session';
import { createClient } from 'redis';
import RedisStore from 'connect-redis';
import express, { json } from 'express';
import { v4 as uuid } from 'uuid';
import db from './db.js';
import { CellRouter, ProjectRouter, UserRouter } from './Routes/index.js';

const app = express();

const redisClient = createClient();
try {
  redisClient.connect();
} catch (e) {
  console.error(e);
}

const redisStore = new RedisStore({
  client: redisClient,
  prefix: 'capstone:',
});

const sessionOptions = {
  secret: 'changethis',
  cookie: { /** domain: '', */ httpOnly: true, /** sameSite: 'strict', */ maxAge: 3600000 },
  genid: () => uuid(),
  resave: false,
  rolling: true,
  saveUninitialized: true,
  store: redisStore,
};

// Set secure cookie only in production
// Hopefully it's a fully setup HTTPS connection
if (process.env.NODE_ENV === 'production') {
  sessionOptions.cookie.secure = true;
}

app.use(logger('dev'));
app.use(session(sessionOptions));
app.use(cors());
app.use(cookieParser());
app.use(json());

app.use('/cell', CellRouter);
app.use('/project', ProjectRouter);
app.use('/user', UserRouter);

app.get('/', (req, res) => {
  res.status(200).json({ message: 'Server running.' });
  console.log('GET /');
});

app.get('/spark_list', async (req, res, next) => {
  try {
    const data = await db.select('*').from('cell').join('base', 'cell.base_id', 'base.id');
    res.status(200).json(data);
  } catch (e) {
    console.error(`GET /spark_list ERROR: ${e}`);
    next(e);
  }
});

app.get('/news', async (req, res, next) => {
  try {
    const data = await db.select('*').from('news_feed').orderBy('date', 'desc');
    res.status(200).json(data);
  } catch (e) {
    console.error(`GET /news ERROR: ${e}`);
    next(e);
  }
});

export default app;
