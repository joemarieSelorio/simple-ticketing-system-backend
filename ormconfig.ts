import { DataSource, DataSourceOptions } from 'typeorm';
import { SeederOptions } from 'typeorm-extension';
import * as dotenv from 'dotenv';
import { User } from './src/users/users.entity';
import { Ticket } from './src/tickets/ticket.entity';
import { AuditLog } from './src/audits/audits.entity';
dotenv.config();

const options: DataSourceOptions & SeederOptions = {
  migrationsTableName: 'migrations',
  type: 'postgres',
  host: process.env.DB_HOST,
  port: process.env.DB_PORT ? parseInt(process.env.DB_PORT) : 5433,
  username: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_DATABASE,
  logging: true,
  synchronize: false,
  name: 'default',
  entities: [User, Ticket, AuditLog],
  migrations: ['src/db/migrations/**/*{.ts,.js}'],
  seeds: ['src/db/seeders/**/*{seeder.ts,seeder.js}'],
};
export const connectionSource = new DataSource(options);
