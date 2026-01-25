import { join } from 'path'

import { ValidationPipe, ClassSerializerInterceptor } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { NestFactory, Reflector } from '@nestjs/core'
import { NestExpressApplication } from '@nestjs/platform-express'
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger'

import * as bodyParser from 'body-parser'
import { useContainer } from 'class-validator'
import pgSession from 'connect-pg-simple'
import session from 'express-session'

import { LanguageInterceptor } from './common/interceptors/language.interceptor'
import { AppModule } from './core/app.module'

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule, {
    logger: ['log', 'fatal', 'error', 'warn'],
  })

  app.use(bodyParser.json({ limit: '100mb' }))
  app.use(bodyParser.urlencoded({ limit: '100mb', extended: true }))
  app.useGlobalInterceptors(new LanguageInterceptor(), new ClassSerializerInterceptor(app.get(Reflector)))

  const configService = app.get(ConfigService)

  useContainer(app.select(AppModule), { fallbackOnErrors: true })

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
      transformOptions: {
        enableImplicitConversion: true,
      },
    })
  )

  const PgSession = pgSession(session)

  app.set('trust proxy', 1)

  const originAllowlist = configService.get<string>('ORIGIN_ALLOWLIST')
  let origin: boolean | string[] = true

  if (originAllowlist) {
    origin = originAllowlist.split(',').map((url) => url.trim())
    console.log('CORS Allowed Origins:', origin)
  } else {
    console.log('CORS Allowed Origins: ALL (fallback)')
  }

  app.enableCors({
    origin: true,
    methods: 'GET, HEAD, PUT, PATCH, POST, DELETE, OPTIONS',
    credentials: true,
  })

  const dbConnectionString =
    configService.get<string>('DB_CONNECTION_STRING') ||
    `postgres://${configService.get('DB_LOGIN')}:${configService.get('DB_PASSWORD')}@${configService.get('DB_HOSTING')}:${configService.get('DB_POST') || 5432}/${configService.get('DB_NAME')}`

  app.use(
    session({
      store: new PgSession({
        conString: dbConnectionString,
      }),
      secret: process.env.SESSION_SECRET || 'secret_fallback_do_not_use_in_prod',
      resave: false,
      saveUninitialized: false,
      cookie: {
        maxAge: 30 * 24 * 60 * 60 * 1000,
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production' || process.env.MAIL_SECURE === 'true',
        sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
        path: '/',
      },
    })
  )

  app.useStaticAssets(join(process.cwd(), 'uploads'), {
    prefix: '/uploads/',
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
        example: 'ua',
      },
    })
    .addBearerAuth(
      {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
        name: 'JWT',
        description: 'Введіть JWT токен авторизації',
        in: 'header',
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
          'Блог',
          'Запитання та відповіді',
          'Контакти',
          'Private Policy',
          'Terms of use',
          'Cookie',
          'Налаштування',
        ]

        return order.indexOf(a) - order.indexOf(b)
      },
    },
  })

  await app.listen(configService.get<string>('PORT') ?? 4200, '0.0.0.0')
}

bootstrap()
