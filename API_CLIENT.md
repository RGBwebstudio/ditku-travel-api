# Документация Клиентского API

Этот документ описывает эндпоинты, доступные для Клиентского приложения (Лендинг и Пользовательский интерфейс).

**Базовый URL**: `/api`

## Аутентификация и Пользователи (`/auth`, `/user`)

- `POST /auth/sign-in` - Вход пользователя
- `POST /auth/sign-up` - Регистрация нового пользователя
- `GET /user` - Получить всех пользователей (Публичный профиль, если применимо, или ограниченный доступ)
- `GET /user/data` - Получить данные пользователя по токену
- `GET /user/me` - Получить профиль текущего пользователя
- `PATCH /user/me` - Обновить профиль текущего пользователя
- `PATCH /user/:id` - Обновить пользователя по ID (Себя)

## Товары (`/product`)

- `GET /product` - Получить товары (с пагинацией)
- `GET /product/search` - Поиск товаров (краткий)
- `GET /product/search/title` - Поиск товаров по названию
- `GET /product/viewed/list` - Получить просмотренные товары
- `GET /product/filter` - Фильтрация товаров
- `GET /product/:id` - Получить товар по ID
- `GET /product/category/:categoryId/products` - Получить товары по категории
- `GET /product/url/:url` - Получить товар по URL
- `GET /product/:id/images` - Получить изображения товара

## Категории (`/category`)

- `GET /category` - Получить категории (с пагинацией)
- `GET /category/all` - Получить все категории
- `GET /category/search` - Поиск категорий по названию
- `GET /category/showroom` - Получить категории для шоурума
- `GET /category/:value` - Получить категорию по ID или URL
- `GET /category/:id/additional-filters` - Получить дополнительные фильтры
- `GET /category/tree/all` - Получить полное дерево категорий
- `GET /category/:value/subtree` - Получить поддерево категории

## Контент

### Посты / Блог (`/posts`)

- `GET /posts` - Получить посты (с пагинацией)
- `GET /posts/filter` - Получить посты с фильтром
- `GET /posts/:id` - Получить пост по ID
- `GET /posts/url/:url` - Получить пост по URL

### Баннеры (`/banner-group`)

- `GET /banner-group` - Получить группы баннеров
- `GET /banner-group/all` - Получить все группы баннеров
- `GET /banner-group/main-page` - Получить баннеры главной страницы
- `GET /banner-group/:id` - Получить группу баннеров по ID

### FAQ (Вопросы и ответы) (`/faq`)

- `GET /faq` - Получить список FAQ
- `GET /faq/:id` - Получить FAQ по ID

### Видео (`/video`)

- `GET /video` - Получить все видео
- `GET /video/:id` - Получить видео по ID
- `GET /video-category` - Получить все категории видео
- `GET /video-category/:id` - Получить категорию видео по ID

### Контакты (`/contacts`)

- `GET /contacts` - Получить все контакты
- `GET /contacts/:lang` - Получить контент контактов по языку

### Страницы и Условия

- `GET /terms-of-use` - Получить условия использования
- `GET /terms-of-use/:lang` - Получить условия по языку
- `GET /privacy-policy` - Получить политику конфиденциальности
- `GET /privacy-policy/:lang` - Получить политику по языку
- `GET /main-page` - Получить контент главной страницы

## Справочники и Утилиты

- `GET /city` - Получить города
- `GET /city/all` - Получить все города
- `GET /city/:id` - Получить город по ID
- `GET /country` - Получить страны
- `GET /country/:id` - Получить страну по ID
- `GET /roadmap` - Получить записи дорожной карты
- `GET /roadmap/:id` - Получить запись дорожной карты по ID
- `GET /section` - Получить секции
- `GET /section/:id` - Получить секцию по ID
- `GET /parameter` - Получить параметры
- `GET /parameter/:id` - Получить параметр по ID
- `GET /parameter-category` - Получить категории параметров
- `GET /parameter-category/:id` - Получить категорию по ID
- `GET /dap` - Получить информацию о Доставке и Оплате
- `GET /dap/:id` - Получить элемент DAP по ID
- `GET /menu` - Получить пункты меню
- `GET /menu/:id` - Получить пункт меню по ID
- `GET /rating` - Получить рейтинги
- `GET /rating/:id` - Получить рейтинг по ID

