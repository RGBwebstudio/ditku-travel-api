import { MigrationInterface, QueryRunner } from 'typeorm'

export class CreateCategoryAndSeoFilterItems1769700000001 implements MigrationInterface {
  name = 'CreateCategoryAndSeoFilterItems1769700000001'

  public async up(queryRunner: QueryRunner): Promise<void> {
    const hasCategoryCategoryItem = await queryRunner.hasTable('category_category_item')

    if (!hasCategoryCategoryItem) {
      await queryRunner.query(
        `CREATE TABLE "category_category_item" ("id" SERIAL NOT NULL, "order" integer NOT NULL, "type" "public"."tours_page_category_item_type_enum" NOT NULL, "category_owner_id" integer NOT NULL, "category_id" integer, "seo_filter_id" integer, CONSTRAINT "PK_category_category_item_id" PRIMARY KEY ("id"))`
      )
      await queryRunner.query(
        `ALTER TABLE "category_category_item" ADD CONSTRAINT "FK_category_category_item_category_owner_id" FOREIGN KEY ("category_owner_id") REFERENCES "category"("id") ON DELETE CASCADE ON UPDATE NO ACTION`
      )
      await queryRunner.query(
        `ALTER TABLE "category_category_item" ADD CONSTRAINT "FK_category_category_item_category_id" FOREIGN KEY ("category_id") REFERENCES "category"("id") ON DELETE CASCADE ON UPDATE NO ACTION`
      )
      await queryRunner.query(
        `ALTER TABLE "category_category_item" ADD CONSTRAINT "FK_category_category_item_seo_filter_id" FOREIGN KEY ("seo_filter_id") REFERENCES "seo_filter"("id") ON DELETE CASCADE ON UPDATE NO ACTION`
      )
    }

    const hasSeoFilterCategoryItem = await queryRunner.hasTable('seo_filter_category_item')
    if (!hasSeoFilterCategoryItem) {
      await queryRunner.query(
        `CREATE TABLE "seo_filter_category_item" ("id" SERIAL NOT NULL, "order" integer NOT NULL, "type" "public"."tours_page_category_item_type_enum" NOT NULL, "seo_filter_owner_id" integer NOT NULL, "category_id" integer, "seo_filter_id" integer, CONSTRAINT "PK_seo_filter_category_item_id" PRIMARY KEY ("id"))`
      )
      await queryRunner.query(
        `ALTER TABLE "seo_filter_category_item" ADD CONSTRAINT "FK_seo_filter_category_item_seo_filter_owner_id" FOREIGN KEY ("seo_filter_owner_id") REFERENCES "seo_filter"("id") ON DELETE CASCADE ON UPDATE NO ACTION`
      )
      await queryRunner.query(
        `ALTER TABLE "seo_filter_category_item" ADD CONSTRAINT "FK_seo_filter_category_item_category_id" FOREIGN KEY ("category_id") REFERENCES "category"("id") ON DELETE CASCADE ON UPDATE NO ACTION`
      )
      await queryRunner.query(
        `ALTER TABLE "seo_filter_category_item" ADD CONSTRAINT "FK_seo_filter_category_item_seo_filter_id" FOREIGN KEY ("seo_filter_id") REFERENCES "seo_filter"("id") ON DELETE CASCADE ON UPDATE NO ACTION`
      )
    }
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    const hasSeoFilterCategoryItem = await queryRunner.hasTable('seo_filter_category_item')
    if (hasSeoFilterCategoryItem) {
      await queryRunner.query(
        `ALTER TABLE "seo_filter_category_item" DROP CONSTRAINT IF EXISTS "FK_seo_filter_category_item_seo_filter_id"`
      )
      await queryRunner.query(
        `ALTER TABLE "seo_filter_category_item" DROP CONSTRAINT IF EXISTS "FK_seo_filter_category_item_category_id"`
      )
      await queryRunner.query(
        `ALTER TABLE "seo_filter_category_item" DROP CONSTRAINT IF EXISTS "FK_seo_filter_category_item_seo_filter_owner_id"`
      )
      await queryRunner.query(`DROP TABLE IF EXISTS "seo_filter_category_item"`)
    }

    const hasCategoryCategoryItem = await queryRunner.hasTable('category_category_item')
    if (hasCategoryCategoryItem) {
      await queryRunner.query(
        `ALTER TABLE "category_category_item" DROP CONSTRAINT IF EXISTS "FK_category_category_item_seo_filter_id"`
      )
      await queryRunner.query(
        `ALTER TABLE "category_category_item" DROP CONSTRAINT IF EXISTS "FK_category_category_item_category_id"`
      )
      await queryRunner.query(
        `ALTER TABLE "category_category_item" DROP CONSTRAINT IF EXISTS "FK_category_category_item_category_owner_id"`
      )
      await queryRunner.query(`DROP TABLE IF EXISTS "category_category_item"`)
    }
  }
}
