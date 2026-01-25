import { MigrationInterface, QueryRunner, Table } from 'typeorm'

export class AddRecommendedPostsToPost1769364600000 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: 'post_recommended_posts',
        columns: [
          {
            name: 'post_id',
            type: 'int',
            isPrimary: true,
          },
          {
            name: 'recommended_post_id',
            type: 'int',
            isPrimary: true,
          },
        ],
        foreignKeys: [
          {
            columnNames: ['post_id'],
            referencedTableName: 'post',
            referencedColumnNames: ['id'],
            onDelete: 'CASCADE',
          },
          {
            columnNames: ['recommended_post_id'],
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
    await queryRunner.dropTable('post_recommended_posts', true)
  }
}
