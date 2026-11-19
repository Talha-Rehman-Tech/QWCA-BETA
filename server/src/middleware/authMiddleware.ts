import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

export interface AdminPayload {
  username: string;
  email: string;
  role: string;
  name: string;
}

export interface AuthenticatedRequest extends Request {
  admin?: AdminPayload;
}

export function requireAdminAuth(req: AuthenticatedRequest, res: Response, next: NextFunction): void {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    res.status(401).json({
      success: false,
      message: 'Unauthorized. Admin access token required to perform this action.',
    });
    return;
  }

  const token = authHeader.split(' ')[1];
  const jwtSecret = process.env.JWT_SECRET || 'qwca_jwt_secure_secret_key_987123_managing_partner';

  try {
    const decoded = jwt.verify(token, jwtSecret) as AdminPayload;
    req.admin = decoded;
    next();
  } catch (err: any) {
    res.status(401).json({
      success: false,
      message: 'Unauthorized or expired session. Please log in again.',
      error: err.message,
    });
  }
}
