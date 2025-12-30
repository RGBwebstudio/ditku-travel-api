# Документация Административного API

Этот документ описывает эндпоинты, доступные для Панели Администратора / CMS. Эти эндпоинты обычно требуют роли Администратора.

**Базовый URL**: `/api`

## Управление Контентом

### Товары (`/product`)

- `POST /product` - Создать товар
- `PUT /product/:id` - Обновить товар
- `DELETE /product/:id` - Удалить товар
- `GET /product/:id/recommendations` - Получить рекомендации товара (Админ)
- `PATCH /product/parameters/:id` - Обновить параметры товара
- `PATCH /product/:id/recommendations` - Обновить рекомендации товара
- `POST /product/translates` - Создать переводы товара
- `PUT /product/:id/translates` - Обновить переводы товара
- `DELETE /product/:id/translate` - Удалить перевод товара
- `POST /product/upload/:id` - Загрузить изображения товара
- `DELETE /product/image/:id` - Удалить изображение товара
- `DELETE /product/images` - Удалить несколько изображений
- `DELETE /product/images/bulk` - Массовое удаление изображений

### Категории (`/category`)

- `POST /category` - Создать категорию
- `PUT /category/:id` - Обновить категорию
- `DELETE /category/:id` - Удалить категорию
- `POST /category/translates` - Создать переводы категории
- `PUT /category/:id/translates` - Обновить переводы категории
- `DELETE /category/:id/translate` - Удалить перевод категории
- `POST /category/upload/:id` - Загрузить изображение категории
- `DELETE /category/image/:id` - Удалить изображение категории

### Посты (`/posts`)

- `POST /posts` - Создать пост
- `PUT /posts/:id` - Обновить пост
- `DELETE /posts/:id` - Удалить пост
- `POST /posts/:id/translates` - Создать перевод поста
- `PUT /posts/translates/:translateId` - Обновить перевод поста
- `DELETE /posts/translates/:translateId` - Удалить перевод поста
- `POST /posts/:id/images/upload` - Загрузить изображения поста
- `POST /posts/:id/images` - Создать изображение поста
- `PUT /posts/images/:imageId` - Обновить изображение поста
- `DELETE /posts/:id/images` - Удалить несколько изображений поста
- `DELETE /posts/images/:imageId` - Удалить изображение поста

### Баннеры (`/banner-group`)

- `POST /banner-group/create` - Создать группу баннеров
- `PUT /banner-group/:id` - Обновить группу баннеров
- `DELETE /banner-group/:id` - Удалить группу баннеров
- `POST /banner-group/upload/:id` - Загрузить изображение баннера
- `DELETE /banner-group/image/:id` - Удалить изображение баннера
- `PATCH /banner-group/image/order/:id` - Обновить порядок изображений
- `PUT /banner-group/image/:id` - Обновить ссылку изображения баннера

### FAQ (`/faq`)

- `POST /faq` - Создать FAQ
- `PUT /faq/:id` - Обновить FAQ
- `DELETE /faq/:id` - Удалить FAQ
- `POST /faq/translates` - Создать переводы FAQ
- `PUT /faq/:id/translates` - Обновить переводы FAQ
- `DELETE /faq/:id/translate` - Удалить перевод FAQ

### Видео (`/video`, `/video-category`)

- `POST /video` - Создать видео
- `PUT /video/:id` - Обновить видео
- `DELETE /video/:id` - Удалить видео
- `POST /video-category` - Создать категорию видео
- `PUT /video-category/:id` - Обновить категорию видео
- `DELETE /video-category/:id` - Удалить категорию видео

### Контакты (`/contacts`)

- `POST /contacts` - Создать контент контактов
- `PATCH /contacts` - Обновить контент контактов
- `DELETE /contacts/:id` - Удалить контакт

### SEO (`/seo-blocks`, `/seo-filter`)

- `GET /seo-blocks` - Получить SEO-блоки (Админ список)
- `POST /seo-blocks` - Создать SEO-блок
- `PUT /seo-blocks/:id` - Обновить SEO-блок
- `DELETE /seo-blocks/:id` - Удалить SEO-блок
- `GET /seo-filter` - Получить SEO-фильтры (Админ список)
- `POST /seo-filter` - Создать SEO-фильтр
- `PUT /seo-filter/:id` - Обновить SEO-фильтр
- `DELETE /seo-filter/:id` - Удалить SEO-фильтр

## Управление Справочниками

### Города и Страны

- `POST /city` - Создать город
- `PUT /city/:id` - Обновить город
- `DELETE /city/:id` - Удалить город
- `POST /country` - Создать страну
- `PUT /country/:id` - Обновить страну
- `DELETE /country/:id` - Удалить страну
- `POST /country/translates` - Создать переводы
- `PUT /country/:id/translates` - Обновить переводы
- `DELETE /country/:id/translate` - Удалить перевод

### Параметры (`/parameter`, `/parameter-category`)

- `POST /parameter` - Создать параметр
- `PUT /parameter/:id` - Обновить параметр
- `DELETE /parameter/:id` - Удалить параметр
- `POST /parameter/translates` - Создать переводы
- `PUT /parameter/:id/translates` - Обновить переводы
- `DELETE /parameter/:id/translate` - Удалить перевод
- `POST /parameter-category` - Создать категорию
- `PUT /parameter-category/:id` - Обновить категорию
- `DELETE /parameter-category/:id` - Удалить категорию
- `POST /parameter-category/translates` - Создать переводы
- `PUT /parameter-category/:id/translates` - Обновить переводы
- `DELETE /parameter-category/:id/translate` - Удалить перевод

### Прочее

- `POST /roadmap` - Создать запись дорожной карты
- `POST /roadmap/create-from-array` - Создать несколько записей дорожной карты
- `PUT /roadmap/update/from-array` - Обновить несколько записей дорожной карты
- `PUT /roadmap/:id` - Обновить запись дорожной карты
- `DELETE /roadmap/:id` - Удалить запись дорожной карты
- `POST /section` - Создать секцию
- `PUT /section/:id` - Обновить секцию
- `DELETE /section/:id` - Удалить секцию
- `POST /section/translates` - Создать переводы секции
- `PUT /section/:id/translates` - Обновить переводы секции
- `DELETE /section/:id/translate` - Удалить перевод секции
- `POST /terms-of-use` - Создать условия использования
- `PATCH /terms-of-use` - Обновить условия использования
- `DELETE /terms-of-use/:id` - Удалить условия использования
- `POST /privacy-policy` - Создать политику конфиденциальности
- `PATCH /privacy-policy` - Обновить политику конфиденциальности
- `DELETE /privacy-policy/:id` - Удалить политику конфиденциальности
- `POST /dap` - Создать элемент DAP
- `PUT /dap/:id` - Обновить элемент DAP
- `DELETE /dap/:id` - Удалить элемент DAP
- `POST /dap/translates` - Создать переводы DAP
- `PUT /dap/:id/translates` - Обновить переводы DAP
- `DELETE /dap/:id/translate` - Удалить перевод DAP
- `POST /menu` - Создать пункт меню
- `PUT /menu/:id` - Обновить пункт меню
- `DELETE /menu/:id` - Удалить пункт меню
- `POST /format-group` - Создать группу форматов
- `PUT /format-group/:id` - Обновить группу форматов
- `DELETE /format-group/:id` - Удалить группу форматов

## Маркетинг и Пользователи

### Промокоды (`/promocode`)

- `GET /promocode` - Получить все промокоды (Админ список)
- `GET /promocode/:id` - Получить промокод по ID
- `POST /promocode` - Создать промокод
- `PATCH /promocode/:id` - Обновить промокод
- `DELETE /promocode/:id` - Удалить промокод

### Управление Пользователями

- `GET /user/search` - Поиск пользователей (Админ)
- `DELETE /user/:id` - Удалить пользователя (Админ)
- `POST /auth/set-password` - Установить пароль пользователю (Админ)

### Почта (`/mail-sender`, `/mail-layout`)

- `POST /mail-sender/send` - Отправить email
- `GET /mail-layout` - Получить шаблоны писем
- `GET /mail-layout/:id` - Получить шаблон по ID
- `POST /mail-layout` - Создать шаблон
- `PUT /mail-layout/:id` - Обновить шаблон
- `DELETE /mail-layout/:id` - Удалить шаблон

### Конструктор Страниц (`/page-constructor`)

- `GET /page-constructor` - Получить все элементы
- `POST /page-constructor` - Создать элемент
- `PUT /page-constructor/:id` - Обновить элемент
- `DELETE /page-constructor/:id` - Удалить элемент
- `PUT /page-constructor/order` - Обновить порядок

