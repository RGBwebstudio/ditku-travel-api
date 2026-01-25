import { MigrationInterface, QueryRunner, Table } from 'typeorm'

export class AddRecommendedPostsToEntities1769365000000 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    // Category Recommended Posts
    await queryRunner.createTable(
      new Table({
        name: 'category_recommended_posts',
        columns: [
          {
            name: 'category_id',
            type: 'int',
            isPrimary: true,
          },
          {
            name: 'post_id',
            type: 'int',
            isPrimary: true,
          },
        ],
        foreignKeys: [
          {
            columnNames: ['category_id'],
            referencedTableName: 'category',
            referencedColumnNames: ['id'],
            onDelete: 'CASCADE',
          },
          {
            columnNames: ['post_id'],
            referencedTableName: 'post',
            referencedColumnNames: ['id'],
            onDelete: 'CASCADE',
          },
        ],
      }),
      true
    )

    // SeoFilter Recommended Posts
    await queryRunner.createTable(
      new Table({
        name: 'seo_filter_recommended_posts',
        columns: [
          {
            name: 'seo_filter_id',
            type: 'int',
            isPrimary: true,
          },
          {
            name: 'post_id',
            type: 'int',
            isPrimary: true,
          },
        ],
        foreignKeys: [
          {
            columnNames: ['seo_filter_id'],
            referencedTableName: 'seo_filter',
            referencedColumnNames: ['id'],
            onDelete: 'CASCADE',
          },
          {
            columnNames: ['post_id'],
            referencedTableName: 'post',
            referencedColumnNames: ['id'],
            onDelete: 'CASCADE',
          },
        ],
      }),
      true
    )

    // MainPage Recommended Posts
    await queryRunner.createTable(
      new Table({
        name: 'main_page_recommended_posts',
        columns: [
          {
            name: 'main_page_id',
            type: 'int',
            isPrimary: true,
          },
          {
            name: 'post_id',
            type: 'int',
            isPrimary: true,
          },
        ],
        foreignKeys: [
          {
            columnNames: ['main_page_id'],
            referencedTableName: 'main_page',
            referencedColumnNames: ['id'],
            onDelete: 'CASCADE',
          },
          {
            columnNames: ['post_id'],
            referencedTableName: 'post',
            referencedColumnNames: ['id'],
            onDelete: 'CASCADE',
          },
        ],
      }),
      true
    )
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable('main_page_recommended_posts', true)
    await queryRunner.dropTable('seo_filter_recommended_posts', true)
    await queryRunner.dropTable('category_recommended_posts', true)
  }
}
