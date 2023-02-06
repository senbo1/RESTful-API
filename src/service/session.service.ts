import { FilterQuery, UpdateQuery } from 'mongoose';
import config from 'config';
import SessionModel, { SessionDocument } from '../models/session.model';
import { signJwt, verifyJwt } from '../utils/jwt.utils';
import { get } from 'lodash';
import { findUser } from './user.service';

// Function for creating a new session
export async function createSession(userId: string, userAgent: string) {
  // Create a new session using the provided user ID and user agent
  const session = await SessionModel.create({ user: userId, userAgent });

  // Return the session as a JSON
  return session.toJSON();
}

// Function for finding sessions based on a Mongoose query
export async function findSessions(query: FilterQuery<SessionDocument>) {
  // return the result as a plain JavaScript object without document methods and properties
  return SessionModel.find(query).lean();
}

// function for updating a session document
export async function updateSession(
  query: FilterQuery<SessionDocument>,
  update: UpdateQuery<SessionDocument>
) {
  return SessionModel.updateOne(query, update);
}

// function for reissuing a access token
export async function reIssueAccessToken(refreshToken: string) {
  // Verify the refresh token and get the decoded payload
  const { decoded } = verifyJwt(refreshToken);

  // If the refresh token is invalid or does not contain a Session ID, return false
  if (!decoded || !get(decoded, 'session')) return false;

  // Find the session document by its ID
  const session = await SessionModel.findById(get(decoded, 'session'));

  // If the session document is not valid, return false
  if (!session || !session.valid) return false;

  // Find the user document by its ID
  const user = await findUser({ _id: session.user });

  // If the user document cannot be found, return false
  if (!user) return false;

  // Sign a new access token
  const accessToken = signJwt(
    { ...user, session: session._id },
    { expiresIn: config.get<string>('accessTokenTtl') }
  );

  return accessToken;
}
