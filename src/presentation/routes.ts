import { Router } from 'express';
import { AuthRoutes } from './auth/routes';

export class AppRoutes {
  private static instance: Router;

  private static initRoutes(): Router {
    const router = Router();

    // Definir todas mis rutas principales
    router.use('/api/auth', AuthRoutes.routes);
    // router.use('/api/user')
    // router.use('/api/products')
    // router.use('/api/clients')
    // router.use('/api/orders')

    return router;
  }

  static get routes(): Router {
    if (!AppRoutes.instance) {
      AppRoutes.instance = this.initRoutes();
    }
    return AppRoutes.instance;
  }
}