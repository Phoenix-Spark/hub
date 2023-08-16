import cors from 'cors';
import cookieParser from 'cookie-parser';
import logger from 'morgan';
import session from 'express-session';
import express, { json } from 'express';
import multer from 'multer';
import { AppOptions, Components } from './types';
// import db from './Database/index.js';
// import { CellRouter, FaqRouter, ForumRouter, ProjectRouter, UserRouter } from './Routes/index.js';
// import { loginHandler, logoutHandler, signUpHandler } from './Routes/User.js';
import createCellRouteHandlers from './Routes/Cell.js';
import createNewsRouteHandlers from './Routes/News.js';

const createApplication = (components: Components, options: AppOptions) => {
  console.log('creating app with', options);

  const app = express();
  app.set('port', options.port);

  app.set('trust proxy', 'uniquelocal');

  app.use(logger('dev'));
  app.use(cors(options.corsOptions));
  app.use(session(options.sessionOptions));
  app.use(cookieParser());
  app.use(json());

  app.get('/', (req, res) => {
    res.status(200).json({ message: 'Server running.' });
    console.log('GET /');
  });

  /* NEWS Routes */
  // Create Route Handlers for News
  const { getAllNews } = createNewsRouteHandlers(components);

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
