import { MigrationInterface, QueryRunner, TableColumn } from 'typeorm'

export class DropNonMultilingualFieldsFromBlogPage1769342200001 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    const table = await queryRunner.getTable('blog_page')
    if (!table) return

    const columnsToDrop = ['title', 'meta_title', 'meta_description']

    for (const columnName of columnsToDrop) {
      if (table.findColumnByName(columnName)) {
        await queryRunner.dropColumn('blog_page', columnName)
      }
    }
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    const table = await queryRunner.getTable('blog_page')
    if (!table) return

    const columnsToAdd = [
      new TableColumn({
        name: 'title',
        type: 'varchar',
        isNullable: true,
        default: "''",
      }),
      new TableColumn({
        name: 'meta_title',
        type: 'varchar',
        isNullable: true,
        default: "''",
      }),
      new TableColumn({
        name: 'meta_description',
        type: 'varchar',
        isNullable: true,
        default: "''",
      }),
    ]

    for (const column of columnsToAdd) {
      if (!table.findColumnByName(column.name)) {
        await queryRunner.addColumn('blog_page', column)
      }
    }
  }
}
