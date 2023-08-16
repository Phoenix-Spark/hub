import { createServer } from 'node:http';
// eslint-disable-next-line import/extensions
import 'dotenv/config';
import { AddressInfo } from 'net';
import createApplication from './app.js';
import {
  CellRepository,
  LocationRepository,
  NewsRepository,
  ProjectRepository,
  UserRepository,
} from './Repository/index.js';
import db from './Database/index.js';

/**
 * Get port from environment and store in Express.
 */

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

// App Options like cors and session
const appOptions = {};

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
