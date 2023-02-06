import express from 'express';
import config from 'config';
import connect from './utils/connect';
import logger from './utils/logger';
import routes from './routes';

import deserializeUser from "./middleware/deserializeUser";

const port = config.get<number>('port');

const app = express();

// for parsing incoming json
app.use(express.json());

app.use(deserializeUser);

app.listen(port, async () => {
  logger.info(`App is running http://localhost:${port}`);

  // MongoDB connection
  await connect();
  
  routes(app);
});
