import { MigrationInterface, QueryRunner } from 'typeorm'

export class RefactorNavigatorBlock1769365300000 implements MigrationInterface {
  name = 'RefactorNavigatorBlock1769365300000'

  public async up(queryRunner: QueryRunner): Promise<void> {
    // 1. Add navigator_title to seo_filter
    await queryRunner.query(`ALTER TABLE "seo_filter" ADD COLUMN IF NOT EXISTS "navigator_title" character varying`)

    // 2. Safely handle the table rename/creation
    // We check if the 'navigator_subcategories' table already exists
    const hasNewTable = await queryRunner.hasTable('tours_page_navigator_subcategories')

    if (!hasNewTable) {
      // Check if old table exists to rename
      const hasOldTable = await queryRunner.hasTable('tours_page_popular_filters')

      if (hasOldTable) {
        await queryRunner.query(
          `ALTER TABLE "tours_page_popular_filters" RENAME TO "tours_page_navigator_subcategories"`
        )
      } else {
        // Create the table fresh if neither exists
        await queryRunner.query(`
          CREATE TABLE "tours_page_navigator_subcategories" (
            "tours_page_id" integer NOT NULL, 
            "seo_filter_id" integer NOT NULL, 
            CONSTRAINT "PK_tours_page_navigator_subcategories" PRIMARY KEY ("tours_page_id", "seo_filter_id")
          )
        `)

        // Add Foreign Keys
        await queryRunner.query(`
          ALTER TABLE "tours_page_navigator_subcategories" 
          ADD CONSTRAINT "FK_tours_page_navigator_subcategories_tours_page" 
          FOREIGN KEY ("tours_page_id") REFERENCES "tours_page"("id") ON DELETE CASCADE ON UPDATE CASCADE
        `)

        await queryRunner.query(`
          ALTER TABLE "tours_page_navigator_subcategories" 
          ADD CONSTRAINT "FK_tours_page_navigator_subcategories_seo_filter" 
          FOREIGN KEY ("seo_filter_id") REFERENCES "seo_filter"("id") ON DELETE CASCADE ON UPDATE CASCADE
        `)

        // Add Indices
        await queryRunner.query(`
          CREATE INDEX "IDX_tours_page_navigator_subcategories_tours_page" 
          ON "tours_page_navigator_subcategories" ("tours_page_id")
        `)

        await queryRunner.query(`
          CREATE INDEX "IDX_tours_page_navigator_subcategories_seo_filter" 
          ON "tours_page_navigator_subcategories" ("seo_filter_id")
        `)
      }
    }
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    // 1. Revert table rename (or drop if we created it)
    // Simplest reversal is to rename back if it exists as the new name
    const hasNewTable = await queryRunner.hasTable('tours_page_navigator_subcategories')
    if (hasNewTable) {
      // We will just rename it back to popular_filters as that was the 'previous' state implied
      await queryRunner.query(`ALTER TABLE "tours_page_navigator_subcategories" RENAME TO "tours_page_popular_filters"`)
    }

    // 2. Drop column
    await queryRunner.query(`ALTER TABLE "seo_filter" DROP COLUMN IF EXISTS "navigator_title"`)
  }
}
