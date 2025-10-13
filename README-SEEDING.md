# Database Seeding Setup

This project includes a comprehensive seeding system for generating 3000 products with Ukrainian translations and all related entities.

## Features

- **3000 Products** with Ukrainian, Russian, and English translations
- **Categories** with proper hierarchy and translations
- **Brands** linked to countries
- **Parameters** and Parameter Categories with translations
- **Measurements** with translations
- **Stock** management for products
- **Product relationships** including categories, brands, parameters, and measurements

## Running Seeds

To seed the database with sample data:

```bash
npm run seed
```

## Seeding Structure

### Data Sources
- Product names based on `app/public/products` directory structure
- Ukrainian translations for all entities
- Comprehensive product variations and categories

### Entities Seeded
1. **Countries** (5 countries with translations)
2. **Measurements** (6 measurement types with translations) 
3. **Categories** (8 categories with translations)
4. **Brands** (15 brands linked to countries)
5. **Parameter Categories** (6 categories with translations)
6. **Parameters** (Multiple parameters per category with translations)
7. **Products** (3000 products with full translations and relationships)

### Features
- **Multi-language Support**: Ukrainian, Russian, and English translations
- **Product Variations**: Creates variations of base products to reach 3000 total
- **Random Relationships**: Products linked to random brands, categories, parameters
- **Stock Management**: Each product gets associated stock information
- **Progress Tracking**: Console output shows seeding progress

## File Structure

```
src/database/
├── seeds/
│   ├── data/
│   │   └── products.ts          # Product data with translations
│   ├── factories/               # TypeORM factories (optional)
│   └── seeders/                 # Main seeding logic
│       ├── 01-countries.seeder.ts
│       ├── 02-measurements.seeder.ts
│       ├── 03-categories.seeder.ts
│       ├── 04-brands.seeder.ts
│       ├── 05-parameter-categories.seeder.ts
│       ├── 06-parameters.seeder.ts
│       └── 07-products.seeder.ts
└── seed.ts                      # Main seed runner
```

## Notes

- Seeding will create realistic e-commerce data
- Products include proper SEO fields and descriptions
- All translations are in Ukrainian, Russian, and English
- The system handles relationships between all entities properly
- Stock levels are randomized but realistic