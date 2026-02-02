import { MigrationInterface, QueryRunner } from 'typeorm'

export class AddBadgeToProductProgram1770026700000 implements MigrationInterface {
  name = 'AddBadgeToProductProgram1770026700000'

  public async up(queryRunner: QueryRunner): Promise<void> {
    const hasColumn = await queryRunner.hasColumn('product_program', 'badge')
    if (!hasColumn) {
      await queryRunner.query(`ALTER TABLE "product_program" ADD "badge" character varying NOT NULL DEFAULT ''`)
    }
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "product_program" DROP COLUMN "badge"`)
  }
}
