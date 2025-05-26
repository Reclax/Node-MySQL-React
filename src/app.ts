import { envs } from './config';
import { MySQLDatabase } from './data/mysql';
import { AppRoutes } from './presentation/routes';
import { Server } from './presentation/server';

(async () => {
  await main();
})();

async function main() {
  // Obtenemos la instancia única de MySQLDatabase
  const mysqlInstance = MySQLDatabase.getInstance();

  // Intentamos conectar y sincronizar con la base de datos
  try {
    await mysqlInstance.authenticate();
    console.log('Conexión a MySQL exitosa');
    await mysqlInstance.sync({ alter: true }); // sincroniza los modelos (ajusta esquema si hace falta)
    console.log('Modelos sincronizados correctamente');
  } catch (error) {
    console.error('Error conectando a MySQL:', error);
    process.exit(1);
  }

  // Arrancamos el servidor con las rutas definidas
  Server.getInstance({
    port: envs.PORT,
    routes: AppRoutes.routes
  }).start();
}