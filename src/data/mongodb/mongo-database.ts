import mongoose from 'mongoose';

interface Options {
  mongoUrl: string;
  dbName: string;
}

export class MongoDatabase {
  private static instance: MongoDatabase;
  private isConnected: boolean = false;

  private constructor() {
  }

  public static getInstance(): MongoDatabase {
    if (!MongoDatabase.instance) {
      MongoDatabase.instance = new MongoDatabase();
    }
    return MongoDatabase.instance;
  }

  async connect(options: Options): Promise<boolean> {
    const { dbName, mongoUrl } = options;

    if (this.isConnected) {
      console.log('Ya existe una conexión a MongoDB');
      return true;
    }

    try {
      await mongoose.connect(mongoUrl, {
        dbName: dbName,
      });

      this.isConnected = true;
      console.log('Mongo Conectado :)');
      return true;
    } catch (error) {
      console.log('Mongo Error en la Conexión :(');
      throw error;
    }
  }

  async disconnect(): Promise<void> {
    if (!this.isConnected) return;
    
    await mongoose.disconnect();
    this.isConnected = false;
    console.log('Mongo Desconectado');
  }
}