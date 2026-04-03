import 'dotenv';
import jwt from 'jsonwebtoken';
import { NextFunction, Request, Response } from 'express';

const authenticateToken = (req: Request, res: Response, next: NextFunction) => {
  const { authorization } = req.headers;
  const token = authorization && authorization.split(' ')[1];

  if (!token) {
    return res.sendStatus(401);
  }

  try {
    jwt.verify(token, process.env.SUPABASE_JWT_SECRET, (err, user) => {
      if (err) {
        return res.sendStatus(401);
      }

      const validSubs = process.env.SUPABASE_VALID_TOKEN_SUBS.split(',');
      if (typeof user.sub === 'string' && !validSubs.includes(user.sub)) {
        return res.sendStatus(401);
      }

      req.user = {
        email: (user as { email: string }).email,
      };

      next();
    });
  } catch (e) {
    res.status(500).send('Internal Server Error');
  }
};

export default authenticateToken;
