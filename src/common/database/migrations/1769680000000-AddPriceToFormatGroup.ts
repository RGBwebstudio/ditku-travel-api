import { MigrationInterface, QueryRunner, TableColumn } from 'typeorm'

export class AddPriceToFormatGroup1769680000000 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    const table = await queryRunner.getTable('format_group')
    if (table) {
      const column = table.findColumnByName('price')
      if (!column) {
        await queryRunner.addColumn(
          'format_group',
          new TableColumn({
            name: 'price',
            type: 'decimal',
            precision: 10,
            scale: 2,
            isNullable: true,
          })
        )
      }
    }
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropColumn('format_group', 'price')
  }
}
