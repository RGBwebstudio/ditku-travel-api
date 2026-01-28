import { MigrationInterface, QueryRunner } from 'typeorm'

export class AddResponsivePathsToImages1769365200000 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    // Arrays of [tableName, columnName]
    const tables = ['product_image', 'category_image', 'post_image', 'banner_image', 'product_program_image']

    for (const table of tables) {
      const hasTable = await queryRunner.hasTable(table)
      if (hasTable) {
        await queryRunner.query(`ALTER TABLE "${table}" ADD COLUMN IF NOT EXISTS "path_md" varchar NULL`)
        await queryRunner.query(`ALTER TABLE "${table}" ADD COLUMN IF NOT EXISTS "path_sm" varchar NULL`)
      }
    }

    // post_section_image uses 'url' instead of 'path', so checking naming convention
    // If it follows the pattern, it might want path_md/sm or url_md/sm.
    // Given the request asks for "files for different screens", likely sm/md variants.
    // I will add path_md/path_sm to maintain consistency with others if possible,
    // or url_md/url_sm if strictly following the 'url' column.
    // Let's check post_section_image columns
    const hasPostSectionImage = await queryRunner.hasTable('post_section_image')
    if (hasPostSectionImage) {
      // existing is 'url'.
      await queryRunner.query(`ALTER TABLE "post_section_image" ADD COLUMN IF NOT EXISTS "url_md" varchar NULL`)
      await queryRunner.query(`ALTER TABLE "post_section_image" ADD COLUMN IF NOT EXISTS "url_sm" varchar NULL`)
    }
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    const tables = ['product_image', 'category_image', 'post_image', 'banner_image', 'product_program_image']

    for (const table of tables) {
      const hasTable = await queryRunner.hasTable(table)
      if (hasTable) {
        await queryRunner.query(`ALTER TABLE "${table}" DROP COLUMN IF EXISTS "path_md"`)
        await queryRunner.query(`ALTER TABLE "${table}" DROP COLUMN IF EXISTS "path_sm"`)
      }
    }

    const hasPostSectionImage = await queryRunner.hasTable('post_section_image')
    if (hasPostSectionImage) {
      await queryRunner.query(`ALTER TABLE "post_section_image" DROP COLUMN IF EXISTS "url_md"`)
      await queryRunner.query(`ALTER TABLE "post_section_image" DROP COLUMN IF EXISTS "url_sm"`)
    }
  }
}
