import { TypeOrmModuleAsyncOptions } from '@nestjs/typeorm';
import { entities } from './entities';
import { migrations } from './migrations';

export const databaseConfig: TypeOrmModuleAsyncOptions = {
  useFactory: () => ({
    type: 'postgres',
    host: process.env.DB_HOST,
    port: process.env.DB_PORT ? Number(process.env.DB_PORT) : 5432,
    username: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    ssl: process.env.DB_SSL_MODE === 'true' ? { rejectUnauthorized: false } : false,
    entities: entities,
    migrations: migrations,
    migrationsRun: true,
    synchronize: false,
    autoLoadEntities: true,
  }),
};
