import { MigrationInterface, QueryRunner } from 'typeorm'

export class AddCategoryNavigatorSubcategories1769604735331 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    const tableExists = await queryRunner.hasTable('category_navigator_subcategories')

    if (!tableExists) {
      await queryRunner.query(`
            CREATE TABLE "category_navigator_subcategories" (
                "category_id" integer NOT NULL,
                "seo_filter_id" integer NOT NULL,
                CONSTRAINT "PK_category_navigator_subcategories" PRIMARY KEY ("category_id", "seo_filter_id")
            )
        `)
      await queryRunner.query(`
            CREATE INDEX "IDX_category_navigator_subcategories_category_id" ON "category_navigator_subcategories" ("category_id")
        `)
      await queryRunner.query(`
            CREATE INDEX "IDX_category_navigator_subcategories_seo_filter_id" ON "category_navigator_subcategories" ("seo_filter_id")
        `)
      await queryRunner.query(`
            ALTER TABLE "category_navigator_subcategories" ADD CONSTRAINT "FK_category_navigator_subcategories_category_id" FOREIGN KEY ("category_id") REFERENCES "category"("id") ON DELETE CASCADE ON UPDATE CASCADE
        `)
      await queryRunner.query(`
            ALTER TABLE "category_navigator_subcategories" ADD CONSTRAINT "FK_category_navigator_subcategories_seo_filter_id" FOREIGN KEY ("seo_filter_id") REFERENCES "seo_filter"("id") ON DELETE CASCADE ON UPDATE CASCADE
        `)
    }
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "category_navigator_subcategories" DROP CONSTRAINT "FK_category_navigator_subcategories_seo_filter_id"`
    )
    await queryRunner.query(
      `ALTER TABLE "category_navigator_subcategories" DROP CONSTRAINT "FK_category_navigator_subcategories_category_id"`
    )
    await queryRunner.query(`DROP INDEX "public"."IDX_category_navigator_subcategories_seo_filter_id"`)
    await queryRunner.query(`DROP INDEX "public"."IDX_category_navigator_subcategories_category_id"`)
    await queryRunner.query(`DROP TABLE "category_navigator_subcategories"`)
  }
}
