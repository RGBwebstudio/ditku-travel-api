import { MigrationInterface, QueryRunner } from 'typeorm'

export class FixProductProgramDay1770026900000 implements MigrationInterface {
  name = 'FixProductProgramDay1770026900000'

  public async up(queryRunner: QueryRunner): Promise<void> {
    const hasColumn = await queryRunner.hasColumn('product_program', 'day')
    if (hasColumn) {
      await queryRunner.query(`ALTER TABLE "product_program" DROP COLUMN "day"`)
    }
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    const hasColumn = await queryRunner.hasColumn('product_program', 'day')
    if (!hasColumn) {
      // Restore as nullable to be safe, or default 0
      await queryRunner.query(`ALTER TABLE "product_program" ADD "day" integer NOT NULL DEFAULT 0`)
    }
  }
}
