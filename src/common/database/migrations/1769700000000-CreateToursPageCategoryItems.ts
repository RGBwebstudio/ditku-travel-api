import { MigrationInterface, QueryRunner } from 'typeorm'

export class CreateToursPageCategoryItems1769700000000 implements MigrationInterface {
  name = 'CreateToursPageCategoryItems1769700000000'

  public async up(queryRunner: QueryRunner): Promise<void> {
    const tableExists = await queryRunner.hasTable('tours_page_category_item')

    if (!tableExists) {
      await queryRunner.query(
        `DO $$ BEGIN
          CREATE TYPE "public"."tours_page_category_item_type_enum" AS ENUM('category', 'subcategory');
        EXCEPTION
          WHEN duplicate_object THEN null;
        END $$;`
      )
      await queryRunner.query(
        `CREATE TABLE "tours_page_category_item" ("id" SERIAL NOT NULL, "order" integer NOT NULL, "type" "public"."tours_page_category_item_type_enum" NOT NULL, "tours_page_id" integer NOT NULL, "category_id" integer, "seo_filter_id" integer, CONSTRAINT "PK_tours_page_category_item_id" PRIMARY KEY ("id"))`
      )
      await queryRunner.query(
        `ALTER TABLE "tours_page_category_item" ADD CONSTRAINT "FK_tours_page_category_item_tours_page_id" FOREIGN KEY ("tours_page_id") REFERENCES "tours_page"("id") ON DELETE CASCADE ON UPDATE NO ACTION`
      )
      await queryRunner.query(
        `ALTER TABLE "tours_page_category_item" ADD CONSTRAINT "FK_tours_page_category_item_category_id" FOREIGN KEY ("category_id") REFERENCES "category"("id") ON DELETE CASCADE ON UPDATE NO ACTION`
      )
      await queryRunner.query(
        `ALTER TABLE "tours_page_category_item" ADD CONSTRAINT "FK_tours_page_category_item_seo_filter_id" FOREIGN KEY ("seo_filter_id") REFERENCES "seo_filter"("id") ON DELETE CASCADE ON UPDATE NO ACTION`
      )
    }
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    const tableExists = await queryRunner.hasTable('tours_page_category_item')

    if (tableExists) {
      await queryRunner.query(
        `ALTER TABLE "tours_page_category_item" DROP CONSTRAINT "FK_tours_page_category_item_seo_filter_id"`
      )
      await queryRunner.query(
        `ALTER TABLE "tours_page_category_item" DROP CONSTRAINT "FK_tours_page_category_item_category_id"`
      )
      await queryRunner.query(
        `ALTER TABLE "tours_page_category_item" DROP CONSTRAINT "FK_tours_page_category_item_tours_page_id"`
      )
      await queryRunner.query(`DROP TABLE "tours_page_category_item"`)
      await queryRunner.query(`DROP TYPE IF EXISTS "public"."tours_page_category_item_type_enum"`)
    }
  }
}
