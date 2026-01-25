import { MigrationInterface, QueryRunner, Table } from 'typeorm'

export class CreateProductTopToursTable1737560000000 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: 'product_top_tours',
        columns: [
          {
            name: 'product_id',
            type: 'integer',
            isNullable: false,
            isPrimary: true,
          },
          {
            name: 'top_tour_product_id',
            type: 'integer',
            isNullable: false,
            isPrimary: true,
          },
        ],
        foreignKeys: [
          {
            name: 'FK_product_top_tours_product_id',
            columnNames: ['product_id'],
            referencedTableName: 'product',
            referencedColumnNames: ['id'],
            onDelete: 'CASCADE',
          },
          {
            name: 'FK_product_top_tours_top_tour_product_id',
            columnNames: ['top_tour_product_id'],
            referencedTableName: 'product',
            referencedColumnNames: ['id'],
            onDelete: 'CASCADE',
          },
        ],
        indices: [
          {
            name: 'IDX_product_top_tours_product_id',
            columnNames: ['product_id'],
          },
          {
            name: 'IDX_product_top_tours_top_tour_product_id',
            columnNames: ['top_tour_product_id'],
          },
        ],
      }),
      true
    )
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable('product_top_tours', true)
  }
}
