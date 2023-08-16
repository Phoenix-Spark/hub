import { createServer } from 'node:http';
// eslint-disable-next-line import/extensions
import 'dotenv/config';
import { AddressInfo } from 'net';
import { createClient } from 'redis';
import RedisStore from 'connect-redis';
import createApplication from './app.js';
import {
  CellRepository,
  LocationRepository,
  NewsRepository,
  ProjectRepository,
  UserRepository,
} from './Repository/index.js';
import db from './Database/index.js';
import { AppOptions } from './types';

/**
 * Get port from environment and store in Express.
 */

// eslint-disable-next-line consistent-return
function normalizePort(val: string) {
  const port = parseInt(val, 10);

  if (Number.isNaN(port)) {
    // named pipe
    return val;
  }

  if (port >= 0) {
    // port number
    return port;
  }

  return false;
}

const port = normalizePort(process.env.PORT || '3001');
if (!port) {
  throw new Error('Could not set port');
}
// app.set('port', port);

/**
 * Bootstrap Application
 */

// Define Repositories
const cellRepository = new CellRepository(db, 'cells');
const userRepository = new UserRepository(db, 'users');
const projectRepository = new ProjectRepository(db, 'projects');
const baseRepository = new LocationRepository(db, 'bases');
const newsRepository = new NewsRepository(db, 'news');

// App Redis Store
const redisClient = createClient({
  url: process.env.REDIS_CONN,
});

redisClient.connect().catch(console.error);

const redisStoreOptions = {
  client: redisClient,
  prefix: 'capstone:',
};

const redisStore: RedisStore = new RedisStore(redisStoreOptions);

// App Options like cors and session
const appOptions: AppOptions = {
  corsOptions: {
    origin: [
      '127.0.0.1:3000',
      /localhost/,
      /\.staging\.apps\.techpulse\.us$/,
      /\.apps\.jmidd\.dev$/,
    ],
    credentials: true,
  },
  sessionOptions: {
    secret: process.env.APP_SESSION || 'changethis',
    cookie: { /** domain: '', */ httpOnly: true, sameSite: 'lax', maxAge: 3600000, secure: false },
    resave: false,
    rolling: true,
    saveUninitialized: false,
    store: redisStore,
  },
  port,
};

// Set secure cookie only in production
// Hopefully it's a fully setup HTTPS connection
if (process.env.NODE_ENV === 'production' && appOptions.sessionOptions!.cookie) {
  appOptions.sessionOptions!.cookie.secure = true;
}

const app = createApplication(
  { cellRepository, userRepository, projectRepository, baseRepository, newsRepository },
  appOptions
);

/**
 * Create HTTP server.
 */
const server = createServer(app);

/**
 * Listen on provided port, on all network interfaces.
 */

server.listen(port, () => {
  const { address } = server.address() as AddressInfo;
  const host = address === '::' || address === '127.0.0.1' ? 'localhost' : address;

  console.log(`Server listening at http://${host}:${port}`);
});

const shutdownServer = () => {
  console.debug('SIGTERM signal received: closing HTTP server...');
  server.close(() => {
    console.debug('HTTP server closed.');
  });
};

process.on('SIGTERM', shutdownServer);

// TODO: Gracefully shutdown on SIGKILL
// process.on('SIGKILL', shutdownServer)
