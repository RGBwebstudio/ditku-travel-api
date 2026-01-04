# Product API Documentation

> Base URL: `/product`

## Overview

The Product API manages tours, excursions, and related products. It supports multi-language content, image management, reviews/ratings, filtering, and recommendations.

---

## Multi-Language Support

Products use a translation system stored in the `ProductTranslate` entity. Each translation record contains:

- `field`: The name of the translated field (e.g., `title`, `subtitle`)
- `value`: The translated content
- `lang`: Language code (`ua` or `en`)

### How It Works

1. **Retrieval**: Pass `lang` query param (e.g., `?lang=en`) or use the `Accept-Language` header.
2. **Creation/Update**: Use flat fields (`title_ua`, `title_en`, `subtitle_ua`, etc.) in the request body. The backend extracts and saves them to `ProductTranslate`.

### Translatable Fields

| Field             | Description      |
| ----------------- | ---------------- |
| `title`           | Product title    |
| `subtitle`        | Product subtitle |
| `seo_title`       | SEO title        |
| `seo_description` | SEO description  |
| `discover`        | Discovery text   |
| `skills`          | Skills text      |

---

## Endpoints

### Products CRUD

#### `GET /product`

Get paginated list of products.

**Query Params:**
| Param | Type | Description |
|-------|------|-------------|
| `take` | `number` | Number of items to fetch |
| `skip` | `number` | Number of items to skip |

**Response:** `{ entities: Product[], count: number }`

---

#### `GET /product/:id`

Get single product by ID.

**Response:** Full `Product` object with translations, images, ratings, roadmaps, recommendations.

---

#### `GET /product/url/:url`

Get product by URL slug.

**Response:** `{ product: Product, children: Product[] }`

---

#### `POST /product`

Create a new product.

**Auth:** Admin only

**Body:** `ProductCreateDto`

```json
{
  "title": "Tour Title",
  "subtitle": "Tour Subtitle",
  "seo_title": "SEO Title",
  "seo_description": "SEO Description",
  "url": "tour-url-slug",
  "is_top": false,
  "is_hidden": false,
  "show_on_main_page": true,
  "category_id": 1,
  "price": "1500.00",
  "order_in_list": 0,

  "title_ua": "Тур Заголовок",
  "title_en": "Tour Title",
  "subtitle_ua": "Тур Підзаголовок",
  "subtitle_en": "Tour Subtitle",
  "seo_title_ua": "SEO Заголовок",
  "seo_title_en": "SEO Title",
  "seo_description_ua": "SEO Опис",
  "seo_description_en": "SEO Description"
}
```

---

#### `PUT /product/:id`

Update a product.

**Auth:** Admin only

**Body:** `ProductUpdateDto` (same as create, all fields optional)

---

#### `DELETE /product/:id`

Delete a product.

**Auth:** Admin only

---

### Filtering

#### `GET /product/filter`

Advanced product filtering.

**Query Params:**
| Param | Type | Description |
|-------|------|-------------|
| `categories` | `string` | Comma-separated category URLs |
| `parameters` | `string` | Comma-separated parameter IDs |
| `sections` | `string` | Comma-separated section IDs |
| `take` | `number` | Pagination limit |
| `skip` | `number` | Pagination offset |
| `start_point` | `number` | City ID for tour start |
| `end_point` | `number` | City ID for tour end |
| `startAt` | `string` | Date range start (ISO) |
| `endAt` | `string` | Date range end (ISO) |
| `seo_filter` | `number` | SEO filter ID |

**Response:** `{ entities: Product[], count: number }`

---

### Search

#### `GET /product/search?q=query`

Quick search (returns `id`, `title` only, max 20).

#### `GET /product/search/title?q=query`

Full search by title (returns full products, max 5).

---

### Translations

#### `POST /product/translates`

Create translations for products.

**Auth:** Admin only

**Body:** Array of `ProductCreateTranslateDto`

```json
[
  {
    "entity_id": 1,
    "field": "title",
    "value": "Translated Title",
    "lang": "en"
  }
]
```

---

#### `PUT /product/:id/translates`

Update translations for a product.

**Auth:** Admin only

**Body:** Array of `ProductUpdateTranslateDto`

---

#### `DELETE /product/:id/translate`

Delete a translation by translation ID.

**Auth:** Admin only

---

### Images

#### `GET /product/:id/images`

Get all images for a product.

---

#### `POST /product/add-image/:id`

Add image to product (from Gallery).

**Auth:** Admin only

**Body:**

```json
{
  "path": "/uploads/gallery/image.jpg"
}
```

---

#### `DELETE /product/image/:id`

Delete a single product image by image ID.

**Auth:** Admin only

---

#### `DELETE /product/images`

Bulk delete product images.

**Auth:** Admin only

**Body:**

```json
{
  "ids": [1, 2, 3]
}
```

---

### Reviews

#### `GET /product/:id/reviews`

Get all reviews for a product.

**Response:**

```json
{
  "rating": 4.5,
  "rating_count": 10,
  "ratings": [
    {
      "id": 1,
      "name": "John",
      "review": "Great tour!",
      "rating": 5
    }
  ]
}
```

---

#### `POST /product/:id/reviews`

Create a review.

**Body:**

```json
{
  "name": "John",
  "rating": 5,
  "text_ua": "Чудовий тур!",
  "text_en": "Great tour!"
}
```

---

#### `PUT /product/reviews/:id`

Update a review.

---

#### `DELETE /product/reviews/:id`

Delete a review.

---

### Recommendations

#### `GET /product/:id/recommendations`

Get recommended products for a product.

**Auth:** Admin only

---

#### `PATCH /product/:id/recommendations`

Update recommended products.

**Auth:** Admin only

**Body:**

```json
{
  "productIds": [2, 3, 4]
}
```

---

### Parameters

#### `PATCH /product/parameters/:id`

Update product parameters.

**Auth:** Admin only

**Body:**

```json
{
  "parameters": [1, 2, 3]
}
```

---

### Viewed Products

#### `GET /product/viewed/list`

Get products viewed in the current session.

---

### By Category

#### `GET /product/category/:categoryId/products`

Get all products in a category (includes children categories).

---

## Data Models

### Product Entity (Key Fields)

| Field               | Type                 | Description           |
| ------------------- | -------------------- | --------------------- |
| `id`                | `number`             | Primary key           |
| `title`             | `string`             | Product title         |
| `subtitle`          | `string`             | Subtitle              |
| `url`               | `string`             | URL slug              |
| `seo_title`         | `string`             | SEO title             |
| `seo_description`   | `string`             | SEO description       |
| `price`             | `string`             | Price (decimal)       |
| `is_top`            | `boolean`            | Featured product      |
| `is_hidden`         | `boolean`            | Hidden from public    |
| `show_on_main_page` | `boolean`            | Show on homepage      |
| `category_id`       | `Category`           | Related category      |
| `parameters`        | `Parameter[]`        | Related parameters    |
| `sections`          | `Section[]`          | Related sections      |
| `seo_filters`       | `SeoFilter[]`        | SEO filter tags       |
| `images`            | `ProductImage[]`     | Product images        |
| `translates`        | `ProductTranslate[]` | Translations          |
| `ratings`           | `Rating[]`           | Reviews               |
| `roadmaps`          | `Roadmap[]`          | Tour stops            |
| `start_at`          | `Date`               | Tour start date       |
| `end_at`            | `Date`               | Tour end date         |
| `created_at`        | `Date`               | Creation timestamp    |
| `updated_at`        | `Date`               | Last update timestamp |

---

## Error Responses

| Status | Message       | Description                         |
| ------ | ------------- | ----------------------------------- |
| `400`  | `NOT_CREATED` | Validation failed                   |
| `404`  | `NOT_FOUND`   | Product not found                   |
| `400`  | `HAS_CHILDS`  | Cannot delete product with children |
