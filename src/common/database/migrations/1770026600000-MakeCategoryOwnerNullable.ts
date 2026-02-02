import { MigrationInterface, QueryRunner } from 'typeorm'

export class MakeCategoryOwnerNullable1770026600000 implements MigrationInterface {
  name = 'MakeCategoryOwnerNullable1770026600000'

  public async up(queryRunner: QueryRunner): Promise<void> {
    const hasColumn = await queryRunner.hasColumn('category_category_item', 'category_owner_id')
    if (hasColumn) {
      await queryRunner.query(`ALTER TABLE "category_category_item" ALTER COLUMN "category_owner_id" DROP NOT NULL`)
    }
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DELETE FROM "category_category_item" WHERE "category_owner_id" IS NULL`)
    await queryRunner.query(`ALTER TABLE "category_category_item" ALTER COLUMN "category_owner_id" SET NOT NULL`)
  }
}
