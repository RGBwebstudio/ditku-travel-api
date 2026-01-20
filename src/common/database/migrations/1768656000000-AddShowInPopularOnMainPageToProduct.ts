import { MigrationInterface, QueryRunner, TableColumn } from 'typeorm'

export class AddShowInPopularOnMainPageToProduct1768656000000 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    const table = await queryRunner.getTable('product')
    if (table) {
      const column = table.findColumnByName('show_in_popular_on_main_page')

      if (!column) {
        await queryRunner.addColumn(
          'product',
          new TableColumn({
            name: 'show_in_popular_on_main_page',
            type: 'boolean',
            default: false,
          })
        )
      }
    }
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropColumn('product', 'show_in_popular_on_main_page')
  }
}
