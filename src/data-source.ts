import * as dotenv from 'dotenv'
import { DataSource } from 'typeorm'

dotenv.config()

export const AppDataSource = new DataSource({
  type: 'postgres',
  host: process.env.DB_HOSTING,
  port: parseInt(process.env.DB_POST || '5432'),
  username: process.env.DB_LOGIN,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  entities: [__dirname + '/**/*.entity{.ts,.js}'],
  migrations: [__dirname + '/common/database/migrations/**/*{.ts,.js}'],
  synchronize: false,
  ssl: false,
})
