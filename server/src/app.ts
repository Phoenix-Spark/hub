import cors from 'cors';
import cookieParser from 'cookie-parser';
import logger from 'morgan';
import session, { SessionOptions } from 'express-session';
import multer from 'multer';
import { createClient } from 'redis';
import RedisStore from 'connect-redis';
import express, { json } from 'express';
import db from './Database/index.js';
import { CellRouter, FaqRouter, ForumRouter, ProjectRouter, UserRouter } from './Routes/index.js';
import { loginHandler, logoutHandler, signUpHandler } from './Routes/User.js';
import {
  CellRepository,
  LocationRepository,
  NewsRepository,
  ProjectRepository,
  UserRepository,
} from './Repository/index.js';

const app = express();

const redisClient = createClient({
  url: process.env.REDIS_CONN,
});

redisClient.connect().catch(console.error);

const redisStoreOptions = {
  client: redisClient,
  prefix: 'capstone:',
};

const redisStore: RedisStore = new RedisStore(redisStoreOptions);

const sessionOptions: SessionOptions = {
  secret: process.env.APP_SESSION || 'changethis',
  cookie: { /** domain: '', */ httpOnly: true, sameSite: 'lax', maxAge: 3600000, secure: false },
  resave: false,
  rolling: true,
  saveUninitialized: false,
  store: redisStore,
};

const corsOptions = {
  origin: ['127.0.0.1:3000', /localhost/, /\.staging\.apps\.techpulse\.us$/, /\.apps\.jmidd\.dev$/],
  credentials: true,
};

// Set secure cookie only in production
// Hopefully it's a fully setup HTTPS connection
if (process.env.NODE_ENV === 'production' && sessionOptions.cookie) {
  sessionOptions.cookie.secure = true;
}

app.set('trust proxy', 'uniquelocal');

app.use(logger('dev'));
app.use(cors(corsOptions));
app.use(session(sessionOptions));
app.use(cookieParser());
app.use(json());

export const cellRepository = new CellRepository(db, 'cells');
export const userRepository = new UserRepository(db, 'users');
export const projectRepository = new ProjectRepository(db, 'projects');
export const baseRepository = new LocationRepository(db, 'bases');
export const newsRepository = new NewsRepository(db, 'news');

app.post('/login', loginHandler);
app.get('/logout', logoutHandler);

const profileStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadDir = process.env.UPLOAD_PATH || '/tmp/uploads/';
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = `${Date.now()}-${Math.round(Math.random() * 1e9)}`;
    const fileType = file.mimetype === 'image/jpeg' ? '.jpg' : '.png';
    cb(null, `profile-${uniqueSuffix}${fileType}`);
  },
});
const profileUpload = multer({ dest: 'uploads/', storage: profileStorage });

app.post('/signup', profileUpload.single('photo'), signUpHandler);

app.use('/cell', CellRouter);
app.use('/project', ProjectRouter);
app.use('/user', UserRouter);
app.use('/forum', ForumRouter);
app.use('/faq', FaqRouter);

app.get('/', (req, res) => {
  res.status(200).json({ message: 'Server running.' });
  console.log('GET /');
});

app.get('/news', async (req, res, next) => {
  try {
    const data = await newsRepository.getAll();
    res.status(200).json(data);
  } catch (e) {
    console.error(`GET /news ERROR: ${e}`);
    next(e);
  }
});

app.get('/base/list', async (req, res, next) => {
  try {
    const data = await db.select('base.id', 'base_name as baseName').from('bases');
    res.status(200).json(data);
  } catch (e) {
    console.error(`GET /base/list ERROR: ${e}`);
    next(e);
  }
});

export default app;
