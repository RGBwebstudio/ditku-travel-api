import { MigrationInterface, QueryRunner } from 'typeorm'

export class MakeSeoFilterOwnerNullable1770026800000 implements MigrationInterface {
  name = 'MakeSeoFilterOwnerNullable1770026800000'

  public async up(queryRunner: QueryRunner): Promise<void> {
    const hasColumn = await queryRunner.hasColumn('seo_filter_category_item', 'seo_filter_owner_id')
    if (hasColumn) {
      await queryRunner.query(`ALTER TABLE "seo_filter_category_item" ALTER COLUMN "seo_filter_owner_id" DROP NOT NULL`)
    }
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DELETE FROM "seo_filter_category_item" WHERE "seo_filter_owner_id" IS NULL`)
    await queryRunner.query(`ALTER TABLE "seo_filter_category_item" ALTER COLUMN "seo_filter_owner_id" SET NOT NULL`)
  }
}
