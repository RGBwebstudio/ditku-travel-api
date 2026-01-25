import { MigrationInterface, QueryRunner, TableColumn } from 'typeorm'

export class AddMultilingualFieldsToBlogPage1769342200000 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    const tableUser = await queryRunner.getTable('blog_page')
    if (!tableUser) return

    const columnsToAdd = [
      new TableColumn({
        name: 'title_ua',
        type: 'varchar',
        isNullable: true,
        default: "''",
      }),
      new TableColumn({
        name: 'title_en',
        type: 'varchar',
        isNullable: true,
        default: "''",
      }),
      new TableColumn({
        name: 'meta_title_ua',
        type: 'varchar',
        isNullable: true,
        default: "''",
      }),
      new TableColumn({
        name: 'meta_title_en',
        type: 'varchar',
        isNullable: true,
        default: "''",
      }),
      new TableColumn({
        name: 'meta_description_ua',
        type: 'varchar',
        isNullable: true,
        default: "''",
      }),
      new TableColumn({
        name: 'meta_description_en',
        type: 'varchar',
        isNullable: true,
        default: "''",
      }),
    ]

    for (const column of columnsToAdd) {
      const hasColumn = tableUser.findColumnByName(column.name)
      if (!hasColumn) {
        await queryRunner.addColumn('blog_page', column)
      }
    }
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    const tableUser = await queryRunner.getTable('blog_page')
    if (!tableUser) return

    const columnsToRemove = [
      'title_ua',
      'title_en',
      'meta_title_ua',
      'meta_title_en',
      'meta_description_ua',
      'meta_description_en',
    ]

    for (const columnName of columnsToRemove) {
      const hasColumn = tableUser.findColumnByName(columnName)
      if (hasColumn) {
        await queryRunner.dropColumn('blog_page', columnName)
      }
    }
  }
}
