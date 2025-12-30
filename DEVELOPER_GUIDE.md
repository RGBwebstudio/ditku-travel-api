# Руководство разработчика (Developer Guide)

В этом документе описаны архитектурные принципы, стандарты кодирования и рабочий процесс для разработки Ditku Travel API.

## 1. Архитектура приложения

Приложение построено на базе фреймворка [NestJS](https://nestjs.com/) и следует модульной архитектуре.

### 1.1 Структура директорий

Мы используем кастомную структуру `src`, разделенную на три основные части:

- **`src/core`**: Ядро приложения.
  - `AppModule`, `AppController`, `AppService`
  - `AuthModule` (Аутентификация)
  - Глобальные фильтры, гарды (Guards), если они относятся к ядру.

- **`src/modules`**: Функциональные модули (Feature Modules).
  - Здесь находятся все бизнес-сущности: `User`, `Product`, `Order`, `Category` и т.д.
  - Каждый модуль должен быть изолированным и содержать свои:
    - `controllers`: Обработка HTTP запросов.
    - `services`: Бизнес-логика.
    - `entities`: TypeORM сущности.
    - `dto`: Data Transfer Objects для валидации входных данных.

- **`src/common`**: Общий код.
  - `dto`: Общие DTO (например, пагинация).
  - `enums`: Глобальные перечисления.
  - `helpers`: Вспомогательные функции.
  - `interceptors`: Глобальные перехватчики.
  - `types`: Типы TypeScript.

## 2. Стандарты кодирования

### 2.1 Именование (Naming Conventions)

- **Файлы**: Используйте `kebab-case`.
  - Пример: `user-profile.controller.ts`, `auth.service.ts`.
- **Классы**: Используйте `PascalCase`.
  - Пример: `UserProfileController`, `AuthService`.
- **Методы и переменные**: Используйте `camelCase`.
  - Пример: `getUserProfile`, `isLoggedIn`.
- **Интерфейсы**: `PascalCase`, без префикса `I`.
  - Пример: `UserPayload`, `JwtSignOptions`.

### 2.2 Модули

Каждый функциональный модуль должен регистрировать свои компоненты (контроллеры, провайдеры) и экспортировать только то, что нужно другим модулям (обычно сервис).

```typescript
@Module({
  imports: [TypeOrmModule.forFeature([User])],
  controllers: [UserController],
  providers: [UserService],
  exports: [UserService] // Экспортируем сервис для использования в других модулях
})
export class UserModule {}
```

### 2.3 Configuration (Конфигурация)

Используйте `ConfigService` для доступа к переменным окружения. Не используйте `process.env` напрямую в бизнес-логике.

```typescript
constructor(private configService: ConfigService) {}

someMethod() {
  const dbHost = this.configService.get<string>('DB_HOSTING');
}
```

### 2.4 DTO (Data Transfer Objects)

Используйте классы для DTO и библиотеку `class-validator` для валидации.

```typescript
export class CreateUserDto {
  @IsString()
  @IsNotEmpty()
  name: string

  @IsEmail()
  email: string
}
```

## 3. Git Workflow

1.  **Main Branch**: `main` (или `master`) содержит стабильный код для продакшена.
2.  **Feature Branches**: Для каждой новой задачи создавайте отдельную ветку от `main`.
    - Именование: `feature/название-задачи` или `fix/описание-бага`.
    - Пример: `feature/add-user-profile`, `fix/login-error`.
3.  **Pull Requests**: Все изменения должны проходить через Pull Request (PR) и Code Review.
4.  **Commit Messages**: Пишите понятные сообщения коммитов.

## 4. Полезные команды

- `npm run format`: Форматирование кода с помощью Prettier.
- `npm run lint`: Проверка кода с помощью ESLint.
- `npm run start:dev`: Запуск в режиме разработки.

