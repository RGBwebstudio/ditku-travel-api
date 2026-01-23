import { MigrationInterface, QueryRunner } from 'typeorm'

export class AddStructureToProduct1737560000001 implements MigrationInterface {
  name = 'AddStructureToProduct1737560000001'

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      DO $$
      BEGIN
        IF NOT EXISTS (
          SELECT 1
          FROM information_schema.columns
          WHERE table_name = 'product'
          AND column_name = 'structure'
        ) THEN
          ALTER TABLE "product" ADD COLUMN "structure" JSONB;
        END IF;
      END
      $$;
    `)
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "product" DROP COLUMN IF EXISTS "structure"`)
  }
}
