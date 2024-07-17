import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateUser1702978077934 implements MigrationInterface {
  name = 'CreateUser1702978077934';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "User" (
        "id" SERIAL NOT NULL, 
        "createdAt" TIMESTAMP NOT NULL DEFAULT ('now'::text)::timestamp(6) with time zone, 
        "updatedAt" TIMESTAMP NOT NULL DEFAULT ('now'::text)::timestamp(6) with time zone, 
        "email" character varying NOT NULL, 
        "phoneNumber" character varying, 
        "fullName" character varying, 
        "isEmailConfirmed" boolean, 
        "password" character varying, 
        CONSTRAINT "UQ_4a257d2c9837248d70640b3e36e" UNIQUE ("email"), 
        CONSTRAINT "PK_9862f679340fb2388436a5ab3e4" PRIMARY KEY ("id"))`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE "User"`);
  }
}
