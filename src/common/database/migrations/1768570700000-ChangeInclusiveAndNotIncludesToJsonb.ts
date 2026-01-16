import { MigrationInterface, QueryRunner } from 'typeorm'

export class ChangeInclusiveAndNotIncludesToJsonb1768570700000 implements MigrationInterface {
  name = 'ChangeInclusiveAndNotIncludesToJsonb1768570700000'

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "product" ALTER COLUMN "inclusive" TYPE jsonb USING "inclusive"::jsonb`)

    await queryRunner.query(`ALTER TABLE "product" ALTER COLUMN "notIncludes" TYPE jsonb USING "notIncludes"::jsonb`)
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "product" ALTER COLUMN "inclusive" TYPE text USING "inclusive"::text`)

    await queryRunner.query(`ALTER TABLE "product" ALTER COLUMN "notIncludes" TYPE text USING "notIncludes"::text`)
  }
}
