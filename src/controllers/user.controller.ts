import { Request, Response } from 'express';
import { CreateUserInput } from '../schema/user.schema';
import { createUser } from '../service/user.service';
import logger from '../utils/logger';

// Async function for handling user creation
export async function createUserHandler(req: Request<{}, {}, CreateUserInput['body']>, res: Response) {
  try {

    // Call the createUser service with the request body as the input
    const user = await createUser(req.body);

    // Return the created user in the response
    return res.send(user);
  } catch (e: any) {
    logger.error(e);

    // Return a 409 Conflict response with the error message
    res.status(409).send(e.message);
  }
}
