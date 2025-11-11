import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-change-in-production';

export interface DecodedToken {
  userId: number;
  email: string;
  role: string;
}

export function decodeToken(token: string): DecodedToken | null {
  try {
    const decoded = jwt.verify(token, JWT_SECRET) as DecodedToken;
    return decoded;
  } catch (error) {
    console.error('Token decode error:', error);
    return null;
  }
}
