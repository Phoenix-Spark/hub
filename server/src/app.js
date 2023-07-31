import cors from 'cors';
import cookieParser from 'cookie-parser';
import logger from 'morgan';
import session from 'express-session';
import multer from 'multer';
import { createClient } from 'redis';
import RedisStore from 'connect-redis';
import express, { json } from 'express';
import db from './db.js';
import { CellRouter, ProjectRouter, UserRouter, ForumRouter } from './Routes/index.js';
import { loginHandler, logoutHandler, signUpHandler } from './Routes/User.js';

const app = express();

const redisClient = createClient();
try {
  await redisClient.connect();
} catch (e) {
  console.error(e);
}

const redisStore = new RedisStore({
  client: redisClient,
  prefix: 'capstone:',
});

const sessionOptions = {
  secret: 'changethis',
  cookie: { /** domain: '', */ httpOnly: true, sameSite: 'lax', maxAge: 3600000 },
  resave: false,
  rolling: true,
  saveUninitialized: false,
  store: redisStore,
};

const corsOptions = {
  origin: ['http://localhost:3000', 'http://127.0.0.1:3000'],
  credentials: true,
};

// Set secure cookie only in production
// Hopefully it's a fully setup HTTPS connection
if (process.env.NODE_ENV === 'production') {
  sessionOptions.cookie.secure = true;
}

app.use(logger('dev'));
app.use(cors(corsOptions));
app.use(session(sessionOptions));
app.use(cookieParser());
app.use(json());

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

app.get('/faq', async (req, res, next) => {
  try {
    const data = await db.select('*').from('faq');
    res.status(200).json(data);
  } catch (e) {
    console.error(`GET /faq ERROR: ${e}`);
    next(e);
  }
});

app.get('/profile/:userId', async (req, res, next) => {
  try {
    const data = await
    db.select('users.username','users.first_name','users.last_name','users.email','users.photo_url','users.contact_number1','users.contact_number2','users.bio','cell.cell_name', 'cell.logo_url')
      .from('users')
      .join('cell', 'users.cell_id', 'cell.id')
      .where('users.id', req.params.userId);
    res.status(200).json(data);
  } catch (e) {
    console.error(`GET /profile/:userId ERROR: ${e}`);
    next(e);
  }
});

app.get('/userData/:username', async (req, res, next) => {
  try {
    const data = await
    db.select('*')
      .from('users')
      .where('users.username', req.params.username);
    res.status(200).json(data);
  } catch (e) {
    console.error(`GET /user/:username ERROR: ${e}`);
    next(e);
  }
});

export default app;