import { MigrationInterface, QueryRunner, TableColumn } from 'typeorm'

export class AddPhotoReportToProduct1769150000000 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    const table = await queryRunner.getTable('product')

    if (table && !table.findColumnByName('photo_report')) {
      await queryRunner.addColumn(
        'product',
        new TableColumn({
          name: 'photo_report',
          type: 'jsonb',
          isNullable: true,
        })
      )
    }
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    const table = await queryRunner.getTable('product')

    if (table && table.findColumnByName('photo_report')) {
      await queryRunner.dropColumn('product', 'photo_report')
    }
  }
}
