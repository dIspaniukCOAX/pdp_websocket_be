import { config } from 'dotenv';
import path, { resolve } from 'path';

config({ path: resolve(process.cwd(), '.env') });

export const databaseConfig = {
  type: 'postgres',
  host: process.env.POSTGRES_HOST,
  port: parseInt(process.env.POSTGRES_PORT, 10) || 3000,
  username: process.env.POSTGRES_USER,
  password: process.env.POSTGRES_PASSWORD,
  database: process.env.POSTGRES_DB,
  synchronize: false,
  logging: false,
  useNewUrlParser: true,
  dateStrings: true,
  useUTC: true,
  entities: [path.join(__dirname, '..', '**', '*.entity.{ts,js}')],
  migrations: [`${__dirname}/migrations/*.ts`],
  cli: {
    migrationsDir: '/database/migrations',
  },
};
