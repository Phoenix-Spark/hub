import cors from 'cors';
import cookieParser from 'cookie-parser';
import logger from 'morgan';
import session, { SessionOptions } from 'express-session';
// import multer from 'multer';
import express, { json, NextFunction, Request, Response } from 'express';
import multer from 'multer';
import { Components } from './types';
// import db from './Database/index.js';
// import { CellRouter, FaqRouter, ForumRouter, ProjectRouter, UserRouter } from './Routes/index.js';
// import { loginHandler, logoutHandler, signUpHandler } from './Routes/User.js';
import createCellRouteHandlers from './Routes/Cell.js';

const createNewsRouteHandler = (components: Components) => {
  const { newsRepository } = components;

  return {
    async getAllNews(req: Request, res: Response, next: NextFunction) {
      try {
        const data = await newsRepository.getAll();
        res.status(200).json(data);
      } catch (e) {
        console.error(`GET /news ERROR: ${e}`);
        next(e);
      }
    },
  };
};

const createApplication = (components: Components, options: object) => {
  console.log('creating app with', options);
  const { redisStore } = components;

  // Create Route Handlers for News
  const { getAllNews } = createNewsRouteHandler(components);

  const app = express();

  const sessionOptions: SessionOptions = {
    secret: process.env.APP_SESSION || 'changethis',
    cookie: { /** domain: '', */ httpOnly: true, sameSite: 'lax', maxAge: 3600000, secure: false },
    resave: false,
    rolling: true,
    saveUninitialized: false,
    store: redisStore,
  };

  const corsOptions = {
    origin: [
      '127.0.0.1:3000',
      /localhost/,
      /\.staging\.apps\.techpulse\.us$/,
      /\.apps\.jmidd\.dev$/,
    ],
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

  // app.post('/login', loginHandler);
  // app.get('/logout', logoutHandler);
  //
  // const profileStorage = multer.diskStorage({
  //   destination: (req, file, cb) => {
  //     const uploadDir = process.env.UPLOAD_PATH || '/tmp/uploads/';
  //     cb(null, uploadDir);
  //   },
  //   filename: (req, file, cb) => {
  //     const uniqueSuffix = `${Date.now()}-${Math.round(Math.random() * 1e9)}`;
  //     const fileType = file.mimetype === 'image/jpeg' ? '.jpg' : '.png';
  //     cb(null, `profile-${uniqueSuffix}${fileType}`);
  //   },
  // });
  // const profileUpload = multer({ dest: 'uploads/', storage: profileStorage });
  //
  // app.post('/signup', profileUpload.single('photo'), signUpHandler);

  // app.use('/cell', CellRouter);
  // app.use('/project', ProjectRouter);
  // app.use('/user', UserRouter);
  // app.use('/forum', ForumRouter);
  // app.use('/faq', FaqRouter);

  app.get('/', (req, res) => {
    res.status(200).json({ message: 'Server running.' });
    console.log('GET /');
  });

  app.get('/news', getAllNews);

  /* CELL Routes */
  const {
    getCells,
    getCell,
    getCellTeam,
    getCellProjects,
    getCellNews,
    addCell,
    approveCell,
    deleteCell,
    patchCell,
  } = createCellRouteHandlers(components);

  const cellUpload = multer();

  app.post('/cell/add', addCell);
  app.patch('/cell/:cellId/approve', approveCell);
  app.route('/cell/:cellId').delete(deleteCell).patch(cellUpload.none(), patchCell);
  app.get('/cell/list', getCells);
  app.get('/cell/:cellEndpoint', getCell);
  app.get('/cell/:cellEndpoint/team', getCellTeam);
  app.get('/cell/:cellEndpoint/projects', getCellProjects);
  app.get('/cell/:cellEndpoint/news', getCellNews);

  // app.get('/base/list', async (req, res, next) => {
  //   try {
  //     const data = await db.select('base.id', 'base_name as baseName').from('bases');
  //     res.status(200).json(data);
  //   } catch (e) {
  //     console.error(`GET /base/list ERROR: ${e}`);
  //     next(e);
  //   }
  // });
  //
  // app.get('/test', async (req, res) => {
  //   const result = await userRepository.getUserId('jon');
  //   console.log(result);
  //   res.status(200).json(result);
  // });

  return app;
};

export default createApplication;
