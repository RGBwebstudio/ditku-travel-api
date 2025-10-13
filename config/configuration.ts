import { TypeOrmModuleOptions } from '@nestjs/typeorm'

export default () => ({
  db: {
    type: 'postgres',
    host: process.env.DB_HOSTING,
    port: process.env.DB_POST,
    username: process.env.DB_LOGIN,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    entities: [__dirname + '/../**/*.entity{.ts,.js}'],
    synchronize: true,
    logging: false
  } as TypeOrmModuleOptions,
  mail: {
    host: process.env.MAIL_HOST,
    login: process.env.MAIL_LOGIN,
    password: process.env.MAIL_PASSWORD,
    port: process.env.MAIL_PORT,
    secure: process.env.MAIL_SECURE,
    from: process.env.MAIL_FROM
  }
})
