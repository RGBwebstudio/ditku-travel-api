# Ditku Travel API

Ditku Travel API предоставляет бэкенд-сервисы для приложения Ditku Travel. Он обрабатывает аутентификацию, управление пользователями, товарами, заказами и контентом.

## Документация API

API задокументировано с использованием Swagger. После запуска приложения вы можете получить доступ к документации по адресу:

**[http://localhost:4200/api](http://localhost:4200/api)**

(Замените `4200` на ваш настроенный `PORT`).

Подробное описание эндпоинтов также доступно в:

- [Client API (API_CLIENT.md)](./API_CLIENT.md)
- [Admin API (API_ADMIN.md)](./API_ADMIN.md)

## Руководство разработчика (Developer Guide)

Подробное руководство по стандартам кодирования, архитектуре и рабочим процессам доступно в [DEVELOPER_GUIDE.md](./DEVELOPER_GUIDE.md).

## Технологии

- **Фреймворк**: [NestJS](https://nestjs.com/)
- **Язык**: [TypeScript](https://www.typescriptlang.org/)
- **База данных**: [PostgreSQL](https://www.postgresql.org/)
- **ORM**: [TypeORM](https://typeorm.io/)
- **Документация API**: [Swagger](https://swagger.io/)
- **Очереди**: [BullMQ](https://docs.bullmq.io/)

## Предварительные требования

Убедитесь, что на вашем локальном компьютере установлены:

- **Node.js** (v18 или выше)
- **npm** (или yarn/pnpm)
- **PostgreSQL** база данных

## Структура проекта

Код проекта организован в директории `src` со следующей структурой:

- **`src/core`**: Содержит основную логику приложения, включая корневой `AppModule`, `AppController`, `AppService` и модуль `Auth`.
- **`src/modules`**: Содержит все функциональные модули (например, `user`, `product`, `order` и т.д.). Каждый модуль содержит свой контроллер, сервис, сущности и DTO.
- **`src/common`**: Содержит общие утилиты, DTO, перечисления (enums), перехватчики (interceptors), пайпы (pipes) и типы, используемые во всем приложении.
- **`src/main.ts`**: Точка входа в приложение.

## Установка

1.  Клонируйте репозиторий:

    ```bash
    git clone <repository-url>
    cd api
    ```

2.  Установите зависимости:
    ```bash
    npm install
    ```

## Настройка

1.  Создайте файл `.env` в корневой директории. Вы можете использовать `.env.example` в качестве шаблона.
2.  Заполните файл `.env` вашими значениями конфигурации:

    ```env
    # Порт приложения
    PORT=4200

    # JWT Аутентификация
    JWT_SECRET=ваш_jwt_secret

    # Сессии
    SESSION_SECRET=ваш_session_secret

    # Настройки базы данных
    DB_HOSTING=localhost
    DB_LOGIN=postgres
    DB_PASSWORD=postgres
    DB_POST=5432
    DB_NAME=ditku_travel_db
    DB_CONNECTION_STRING=postgresql://postgres:postgres@localhost:5432/ditku_travel_db

    # Настройки почты
    MAIL_HOST=smtp.example.com
    MAIL_LOGIN=ваш_email_login
    MAIL_PASSWORD=ваш_email_password
    MAIL_PORT=465
    MAIL_SECURE=true
    MAIL_FROM='"Ditku Travel" <noreply@ditkutravel.com>'

    # S3 Хранилище (если применимо)
    S3_ENDPOINT=
    S3_REGION=
    S3_BUCKET=
    S3_ACCESS_KEY_ID=
    S3_SECRET_ACCESS_KEY=
    S3_FORCE_PATH_STYLE=

    # CORS
    ORIGIN_ALLOWLIST=http://localhost:3000

    # Ключи сторонних сервисов
    TURBO_SMS_API_KEY=
    ```

## Запуск приложения

### Разработка

Чтобы запустить приложение в режиме разработки с отслеживанием изменений:

```bash
npm run start:dev
```

API будет доступно по адресу `http://localhost:4200`.

### Продакшн

Чтобы собрать и запустить приложение в режиме продакшн:

```bash
npm run build
npm run start:prod
```

## Скрипты

- `npm run build`: Компилирует приложение.
- `npm run start`: Запускает приложение.
- `npm run start:dev`: Запускает приложение в режиме отслеживания изменений (watch mode).
- `npm run start:prod`: Запускает скомпилированное приложение.
- `npm run lint`: Проверяет код линтером.
- `npm run test`: Запускает юнит-тесты.
- `npm run test:e2e`: Запускает end-to-end тесты.

