import { MigrationInterface, QueryRunner } from 'typeorm'

export class AddSafeCarouselToProduct1769161671171 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    const hasColumn = await queryRunner.hasColumn('product', 'safe_carousel')
    if (!hasColumn) {
      await queryRunner.query(`ALTER TABLE "product" ADD "safe_carousel" jsonb DEFAULT '{}'`)
    }
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    const hasColumn = await queryRunner.hasColumn('product', 'safe_carousel')
    if (hasColumn) {
      await queryRunner.query(`ALTER TABLE "product" DROP COLUMN "safe_carousel"`)
    }
  }
}
