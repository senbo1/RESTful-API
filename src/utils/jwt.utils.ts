import jwt from 'jsonwebtoken';
import config from 'config';

const publicKey = config.get<string>('publicKey');
const privateKey = config.get<string>('privateKey');

// Signs a user object with private key to create a JWT 
export function signJwt(object: object, options?: jwt.SignOptions | undefined) {
  return jwt.sign(object, privateKey, {
    ...(options && options),
    algorithm: 'RS256',
  });
}

// verifies the JWT with public key 
export function verifyJwt(token: string) {
  try {
    const decoded = jwt.verify(token, publicKey);
    return {
      valid: true,
      expired: false,
      decoded,
    };
  } catch (e: any) {
    return {
      valid: false,
      expired: e.message === 'jwt expired',
      decoded: null,
    };
  }
}
