import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddBalanceToUserTable1715016048030 implements MigrationInterface {
  name = 'AddBalanceToUserTable1715016048030';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "User" ADD "balance" FLOAT DEFAULT NULL`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "User" DROP COLUMN "balance"`);
  }
}
