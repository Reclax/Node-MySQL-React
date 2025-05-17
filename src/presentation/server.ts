import express, { Router } from 'express';

interface Options {
  port?: number;
  routes: Router;
}

export class Server {
  private static instance: Server;
  public readonly app = express();
  private readonly port: number;
  private readonly routes: Router;

  private constructor(options: Options) {
    const { port = 3100, routes } = options;

    this.port = port;
    this.routes = routes;
  }

  public static getInstance(options: Options): Server {
    if (!Server.instance) {
      Server.instance = new Server(options);
    }
    return Server.instance;
  }

  async start() {
    // Middlewares
    this.app.use(express.json());
    this.app.use(express.urlencoded({ extended: true }));

    // Usar las rutas definidas
    this.app.use(this.routes);

    // Escuchar el puerto
    this.app.listen(this.port, () => {
      console.log(`Servidor corriendo por el puerto ${this.port}`);
    });
  }
}