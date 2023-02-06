import { Express, Request, Response } from 'express';
import {
  createProductHandler,
  deleteProductHandler,
  getProductHandler,
  updateProductHandler,
} from './controllers/product.controller';
import {
  createSessionHandler,
  deleteSessionHandler,
  getUserSessionsHandler,
} from './controllers/session.controller';
import { createUserHandler } from './controllers/user.controller';
import requireUser from './middleware/requireUser';
import validateResources from './middleware/validateResources';
import {
  createProductSchema,
  deleteProductSchema,
  getProductSchema,
  updateProductSchema,
} from './schema/product.schema';
import { createSessionSchema } from './schema/session.schema';
import { createUserSchema } from './schema/user.schema';

function routes(app: Express) {
  app.get('/healthcheck', (req: Request, res: Response) => res.sendStatus(200));

  // creates a user
  app.post(
    '/api/users',
    validateResources(createUserSchema),
    createUserHandler
  );

  // creates a session
  app.post(
    '/api/sessions',
    validateResources(createSessionSchema),
    createSessionHandler
  );

  // get all sessions
  app.get('/api/sessions', requireUser, getUserSessionsHandler);

  // delete a session
  app.delete('/api/sessions', requireUser, deleteSessionHandler);

  // create a product
  app.post(
    '/api/products',
    [requireUser, validateResources(createProductSchema)],
    createProductHandler
  );

  // update a product
  app.put(
    '/api/products/:productId',
    [requireUser, validateResources(updateProductSchema)],
    updateProductHandler
  );

  // delete a product
  app.delete(
    '/api/products/:productId',
    [requireUser, validateResources(deleteProductSchema)],
    deleteProductHandler
  );

  // get a product
  app.get(
    '/api/products/:productId',
    validateResources(getProductSchema),
    getProductHandler
  );
}

export default routes;
