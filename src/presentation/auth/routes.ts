import { Router } from 'express';
import { AuthController } from './controller';
import { AuthDatasourceImpl, AuthRepositoryImpl } from '../../infrastructure';
import { AuthMiddleware } from '../middlewares/auth.middleware';

export class AuthRoutes {
  private static instance: Router;

  private static initRoutes(): Router {
    const router = Router();

    // Instancias unicas
    const datasource = AuthDatasourceImpl.getInstance();
    const authRepository = AuthRepositoryImpl.getInstance(datasource);
    const controller = AuthController.getInstance(authRepository);
    const authMiddleware = AuthMiddleware.getInstance();

    // Definir rutas
    router.post('/login', controller.loginUser);
    router.post('/register', controller.registerUser);

    router.get('/', authMiddleware.validateJWT, controller.getUsers);
    return router;
  }

  static get routes(): Router {
    if (!AuthRoutes.instance) {
      AuthRoutes.instance = this.initRoutes();
    }
    return AuthRoutes.instance;
  }
}