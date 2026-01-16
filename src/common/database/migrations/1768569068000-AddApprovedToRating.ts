import { MigrationInterface, QueryRunner } from 'typeorm'

export class AddApprovedToRating1768569068000 implements MigrationInterface {
  name = 'AddApprovedToRating1768569068000'

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "rating" ADD COLUMN IF NOT EXISTS "approved" boolean NOT NULL DEFAULT false`)
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "rating" DROP COLUMN IF EXISTS "approved"`)
  }
}
