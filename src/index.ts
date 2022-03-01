/* eslint-disable @typescript-eslint/no-unused-vars */
import express, { Application, NextFunction, Request, Response } from 'express';
// import { createConnection } from 'typeorm';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';
import helmet from 'helmet';

import swaggerUI from 'swagger-ui-express';
import { Server } from 'socket.io';
// import * as swaggerDocument from './routes/swagger.json';

import logger from './utils/logger';
import router from './routes';

dotenv.config();
const port = process.env.PORT || 3000;
const MONGO_OPTIONS = {
  useunifiedTopology: true,
  useNewUrlParser: true,
  socketTimeoutMs: 30000,
  keepAlive: true,
  // poolSize: 50,
  autoIndex: false,
  retryWrites: false,
};

const MONGO_USERNAME = process.env.MONGO_USERNAME || 'superuser';
const MONGO_PASSWORD = process.env.MONGO_PASSWORD || 'superuserpassword1';
const MONGO_HOST = process.env.MONGO_HOST || 'superuser';

const MONGO = {
  host: MONGO_HOST,
  username: MONGO_USERNAME,
  password: MONGO_PASSWORD,
  options: MONGO_OPTIONS,
  url: `mongodb+srv://${MONGO_USERNAME}:${MONGO_PASSWORD}@${MONGO_HOST}?w=majority`,
};
const NAMESPACE = 'Server';

async function startServer(): Promise<void> {
  const app: Application = express();
  app.use(express.json());
  app.use(express.urlencoded({ extended: false }));

  app.use(cors());
  app.use(helmet());

  app.use('/api', router);
  // app.use('/api-docs', swaggerUI.serve, swaggerUI.setup(swaggerDocument));

  app.get('/', (req: Request, res: Response) => {
    res.json({ greeting: `Hello, Good Morning ${port} !` });
  });

  app.use((req, res, _next): void => {
    res.status(404).send({
      status: false,
      error: 'resource not found',
    });
  });

  // handle unexpected errors
  app.use((err: any, req: Request, res: Response, _next: NextFunction): void => {
    res.status(err.status || 500).send({
      success: false,
      error: 'Internal server error.',
    });
  });

  // await createConnection()
  //   .then(() => logger.info('Database connected'))
  //   .catch((err) => {
  //     logger.error('Database connection failed');
  //     logger.error(JSON.stringify(err));
  //     process.exit(1);
  //   });

  await mongoose
    .connect(MONGO.url, MONGO.options)
    .then((result) => {
      logger.info(`${NAMESPACE}: Mongo Connected`);
    })
    .catch((error) => {
      logger.error('Database connection failed');
      logger.error(JSON.stringify(error));
      logger.error(`${NAMESPACE}: ${error.message}`);
    });

  const server = app.listen(port, () => {
    logger.info(`App is listening on port ${port} !`);
  });

  const io = new Server(server);

  io.on('connection', (socket) => {
    // Emit events
    socket.on('chat', (data) => {
      io.sockets.emit('chat', data);
    });
    socket.on('look', (data) => {
      socket.broadcast.emit('look', data);
    });
  });
}

startServer();
