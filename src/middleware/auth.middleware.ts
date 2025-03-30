import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import prisma from '../lib/prisma';
import config from '../config';
import { errorResponse } from '../utils/apiResponse';

export const authenticateJWT = async (req: Request, res: Response, next: NextFunction) => {
  const authHeader = req.headers.authorization;
  
  if (!authHeader) {
    return errorResponse(res, 'Authorization header missing', 401);
  }

  const token = authHeader.split(' ')[1];
  
  try {
    const decoded = jwt.verify(token, config.JWT_SECRET) as { userId: number };
    const user = await prisma.user.findUnique({ where: { id: decoded.userId } });
    
    if (!user) {
      return errorResponse(res, 'User not found', 401);
    }

    (req as any).user = user;
    next();
  } catch (error) {
    return errorResponse(res, 'Invalid token', 401, error);
  }
};

export const isAdmin = (req: Request, res: Response, next: NextFunction) => {
  const user = (req as any).user;
  
  if (!user || !user.isAdmin) {
    return errorResponse(res, 'Admin access required', 403);
  }
  
  next();
};