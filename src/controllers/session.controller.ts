import { Request, Response } from 'express';
import config from 'config';
import {
  createSession,
  findSessions,
  updateSession,
} from '../service/session.service';
import { validatePassword } from '../service/user.service';
import { signJwt } from '../utils/jwt.utils';

// Async function for creating a session
export async function createSessionHandler(req: Request, res: Response) {
  // Validate the user's email and password
  const user = await validatePassword(req.body);

  // If the user's credentials are invalid, return a 401 Unauthorized response
  if (!user) {
    return res.status(401).send('Invalid email or password');
  }

  // Create a session for the user
  const session = await createSession(user._id, req.get('user-agent') || '');

  // Generate an access token
  const accessToken = signJwt(
    { ...user, session: session._id },
    { expiresIn: config.get<string>('accessTokenTtl') }
  );

  // Generate a refresh token
  const refreshToken = signJwt(
    { ...user, session: session._id },
    { expiresIn: config.get<string>('refreshTokenTtl') }
  );

  // Return the access token and refresh token in the response
  res.send({ accessToken, refreshToken });
}

// Async function for handling user sessions
export async function getUserSessionsHandler(req: Request, res: Response) {
  // Get the user ID from the locals object in the response
  const userId = res.locals.user._id;

  // Find valid sessions for the given user
  const sessions = await findSessions({ user: userId, valid: true });

  // Send the found sessions in the response
  res.send(sessions);
}

export async function deleteSessionHandler(req: Request, res: Response) {
  // get the current user's session ID from response object
  const sessionId = res.locals.user.session;

  // Call the updateSession service
  await updateSession({ _id: sessionId }, { valid: false });

  return res.send({
    accessToken: null,
    refreshToken: null,
  });
}
