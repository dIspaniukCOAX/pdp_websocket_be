import { MigrationInterface, QueryRunner } from "typeorm";

export class AddTableBike1714818572537 implements MigrationInterface {
    name = 'AddTableBike1714818572537'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            CREATE TABLE "Bikes" (
                "id" BIGSERIAL NOT NULL, 
                "createdAt" TIMESTAMP, 
                "updatedAt" TIMESTAMP, 
                "model" character varying NOT NULL, 
                "latitude" FLOAT NOT NULL, 
                "longitude" FLOAT NOT NULL, 
                "available" boolean NOT NULL, 
                "rentalPricePerHour" FLOAT NOT NULL, 
                CONSTRAINT "PK_d84b33182c71a48f4bd6edc0601" PRIMARY KEY ("id"))
            `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP TABLE "Bikes"`);
    }

}
