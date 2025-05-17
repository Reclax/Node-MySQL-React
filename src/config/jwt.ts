import jwt from 'jsonwebtoken';
import { envs } from './envs';

export class JwtAdapter {
  private static instance: JwtAdapter;
  private readonly jwtSeed: string;

  private constructor() {
    this.jwtSeed = envs.JWT_SEED;
  }

  public static getInstance(): JwtAdapter {
    if (!JwtAdapter.instance) {
      JwtAdapter.instance = new JwtAdapter();
    }
    return JwtAdapter.instance;
  }

  async generateToken(payload: Object, duration: string = '2h'): Promise<string|null> {
    return new Promise((resolve) => {
      jwt.sign(payload, this.jwtSeed, { expiresIn: duration }, (err, token) => {
        if (err) return resolve(null);
        resolve(token!);
      });
    });
  }

  validateToken<T>(token: string): Promise<T | null> {
    return new Promise((resolve) => {
      jwt.verify(token, this.jwtSeed, (err, decoded) => {
        if (err) return resolve(null);
        resolve(decoded as T);
      });
    });
  }
}