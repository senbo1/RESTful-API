import { Request, Response, NextFunction } from 'express';
import { get } from 'lodash';
import { reIssueAccessToken } from '../service/session.service';
import { verifyJwt } from '../utils/jwt.utils';

const deserializeUser = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  // Get the access token from the "Authorization" header in the request.
  const accessToken = get(req, 'headers.authorization', '').replace(
    /^Bearer\s/,
    ''
  );

  // Get the refresh token from the "x-refresh" header in the request
  const refreshToken = get(req, 'headers.x-refresh') as string;

  // If there is no access token in the request, move to the next middleware
  if (!accessToken) {
    return next();
  }

  // Verify the access token and get the decoded payload and expired status
  const { decoded, expired } = verifyJwt(accessToken);

  // If the access token is valid and has not expired, add the decoded payload to the response locals as user
  if (decoded) {
    res.locals.user = decoded;
    return next();
  }

  // If the access token is expired but there is a refresh token, attempt to re-issue a new access token.
  if (expired && refreshToken) {
    const newAccessToken = await reIssueAccessToken(refreshToken);

    // If re-issuing the access token failed, stop the request.
    if (!newAccessToken) {
      return false;
    }

    // If re-issuing the access token was successful, set the new access token in the response header.
    if (newAccessToken) {
      res.setHeader('x-access-token', newAccessToken);
    }

    // Verify the new access token and extract its decoded payload.
    const result = verifyJwt(newAccessToken);

    // Add the new access token's decoded payload to the response locals.
    res.locals.user = result.decoded;

    return next();
  }

  return next();
};

export default deserializeUser;
