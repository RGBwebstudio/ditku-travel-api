import { MigrationInterface, QueryRunner } from 'typeorm'

export class AddBannersToProduct1768656000001 implements MigrationInterface {
  name = 'AddBannersToProduct1768656000001'

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "product" ADD COLUMN IF NOT EXISTS "banners" jsonb DEFAULT '[]'`)
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "product" DROP COLUMN "banners"`)
  }
}
