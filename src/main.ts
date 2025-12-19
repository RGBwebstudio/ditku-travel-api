/* eslint-disable @typescript-eslint/no-floating-promises */

import { join } from 'path'

import { NestFactory } from '@nestjs/core'
import { ConfigService } from '@nestjs/config'
import { ValidationPipe } from '@nestjs/common'
import { NestExpressApplication } from '@nestjs/platform-express'
import * as bodyParser from 'body-parser'
import { useContainer } from 'class-validator'
import * as session from 'express-session'
import * as pgSession from 'connect-pg-simple'
import { AppModule } from './core/app.module'
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger'
import { LanguageInterceptor } from './common/interceptors/language.interceptor'

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule, {
    logger: ['log', 'fatal', 'error', 'warn']
  })

  app.use(bodyParser.json({ limit: '100mb' }))
  app.use(bodyParser.urlencoded({ limit: '100mb', extended: true }))

  app.useGlobalInterceptors(new LanguageInterceptor())

  const configService = app.get(ConfigService)

  useContainer(app.select(AppModule), { fallbackOnErrors: true })

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
      transformOptions: {
        enableImplicitConversion: true
      }
    })
  )

  const PgSession = pgSession(session)

  app.enableCors({
    origin: true,
    methods: 'GET, HEAD, PUT, PATCH, POST, DELETE, OPTIONS',
    credentials: true
  })

  app.use(
    session({
      store: new PgSession({
        conString: configService.get<string>('DB_CONNECTION_STRING')
      }),
      secret: process.env.SESSION_SECRET as string,
      resave: false,
      saveUninitialized: false,
      cookie: {
        maxAge: 30 * 24 * 60 * 60 * 1000,
        httpOnly: true,
        secure: false,
        sameSite: 'lax',
        path: '/'
      }
    })
  )

  app.useStaticAssets(join(__dirname, '../..', 'uploads'), {
    prefix: '/uploads/'
  })

  const config = new DocumentBuilder()
    .setTitle('Ditku travel API')
    .setDescription('The Ditku travel API documentation')
    .setVersion('1.0')
    .addGlobalParameters({
      in: 'header',
      name: 'X-Language',
      description: 'Код мови (ua, ru, en)',
      schema: {
        example: 'ua'
      }
    })
    .addBearerAuth(
      {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
        name: 'JWT',
        description: 'Введіть JWT токен авторизації',
        in: 'header'
      },
      'jwt'
    )
    .addSecurityRequirements('jwt')
    .build()

  const documentFactory = () => SwaggerModule.createDocument(app, config)

  SwaggerModule.setup('api', app, documentFactory, {
    swaggerOptions: {
      tagsSorter: (a, b) => {
        const order = [
          'Авторизація',
          'Користувачі',
          'Адреси користувачів',
          'SMS-розсилка',
          'Відправка листів',
          'Шаблони листів',
          'Корзина',
          'Доставка',
          'Тарифи доставки',
          'Замовлення',
          'Країна',
          'Бренд',
          'Категорії параметрів',
          'Параметри',
          'Одиниці виміру',
          'Категорії',
          'Акції категорій',
          'Товари',
          'Акції товарів',
          'Резерви товарів',
          'Рейтинг товарів',
          'Групи банерів',
          'Про нас',
          'SEO (контентні сторінки)',
          'Доставка та оплата',
          'Запитання та відповіді',
          'Контакти',
          'Private Policy',
          'Terms of use',
          'Cookie',
          'Налаштування'
        ]
        return order.indexOf(a) - order.indexOf(b)
      }
    }
  })

  await app.listen(configService.get<string>('PORT') ?? 3000)
}

bootstrap()
