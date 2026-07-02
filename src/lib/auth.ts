import jwt from 'jsonwebtoken';
import { NextRequest } from 'next/server';

const JWT_SECRET = process.env.JWT_SECRET || 'wedding-secret-key-123';
const TOKEN_COOKIE_NAME = 'wedding_admin_token';

export interface TokenPayload {
  username: string;
}

export function signToken(payload: TokenPayload): string {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: '7d' });
}

export function verifyToken(token: string): TokenPayload | null {
  try {
    return jwt.verify(token, JWT_SECRET) as TokenPayload;
  } catch (error) {
    return null;
  }
}

export function getAuthTokenFromRequest(req: NextRequest): string | null {
  // First try from cookie
  const cookieToken = req.cookies.get(TOKEN_COOKIE_NAME)?.value;
  if (cookieToken) return cookieToken;

  // Then try from Authorization header
  const authHeader = req.headers.get('authorization');
  if (authHeader && authHeader.startsWith('Bearer ')) {
    return authHeader.substring(7);
  }

  return null;
}

export function verifyAuthRequest(req: NextRequest): TokenPayload | null {
  const token = getAuthTokenFromRequest(req);
  if (!token) return null;
  return verifyToken(token);
}

export { TOKEN_COOKIE_NAME };
