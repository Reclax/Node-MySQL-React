import { envs } from './config';
import { MongoDatabase } from './data/mongodb';
import { AppRoutes } from './presentation/routes';
import { Server } from './presentation/server';

(()=> {
  main();
})()

async function main() {
  // Obtenemos la instancia unica de MongoDatabase
  const mongoInstance = MongoDatabase.getInstance();
  
  // Conectamos usando esa instancia
  await mongoInstance.connect({
    dbName: envs.MONGO_DB_NAME,
    mongoUrl: envs.MONGO_URL,
  });

  // El resto del código permanece igual
  Server.getInstance({
    port: envs.PORT,
    routes: AppRoutes.routes
  })
    .start();
}