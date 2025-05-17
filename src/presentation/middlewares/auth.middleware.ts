import { NextFunction, Request, Response } from 'express';
import { JwtAdapter } from '../../config';
import { UserModel } from '../../data/mongodb';

export class AuthMiddleware {
  private static instance: AuthMiddleware;

  private constructor() {}

  public static getInstance(): AuthMiddleware {
    if (!AuthMiddleware.instance) {
      AuthMiddleware.instance = new AuthMiddleware();
    }
    return AuthMiddleware.instance;
  }

  public validateJWT = async (req: Request, res: Response, next: NextFunction) => {
    const authorization = req.header('Authorization');
    if (!authorization) return res.status(401).json({ error: 'Token no proporcionado' });
    if (!authorization.startsWith('Bearer ')) return res.status(401).json({ error: 'Bearer token no válido' });

    const token = authorization.split(' ').at(1) || '';

    try {
      const jwt = JwtAdapter.getInstance();
      const payload = await jwt.validateToken<{ id: string }>(token);
      if (!payload) return res.status(401).json({ error: 'Token inválido' });

      const user = await UserModel.findById(payload.id);
      if (!user) return res.status(401).json({ error: 'Token inválido - usuario no encontrado' });

      req.body.user = user;
      next();
    } catch (error) {
      console.log(error);
      res.status(500).json({ error: 'Internal server error' });
    }
  }
}

