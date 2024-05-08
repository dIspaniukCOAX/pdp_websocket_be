import { MigrationInterface, QueryRunner } from "typeorm";

export class AddTransactionTable1715107146127 implements MigrationInterface {
    name = 'AddTransactionTable1715107146127'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            CREATE TABLE "Transaction" (
                "id" BIGSERIAL NOT NULL, 
                "createdAt" TIMESTAMP, 
                "updatedAt" TIMESTAMP, 
                "amount" double precision NOT NULL, 
                "expiresIn" character varying NOT NULL DEFAULT true, 
                "expiresOut" character varying NOT NULL DEFAULT true, 
                "bikeId" integer NOT NULL, 
                "userId" integer NOT NULL, 
                CONSTRAINT "PK_Transaction" PRIMARY KEY ("id"),
                CONSTRAINT "FK_Transaction_User" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE NO ACTION ON UPDATE NO ACTION,
                CONSTRAINT "FK_Transaction_Bike" FOREIGN KEY ("bikeId") REFERENCES "Bikes"("id") ON DELETE NO ACTION ON UPDATE NO ACTION
            )
            `);
        await queryRunner.query(`ALTER TABLE "Transaction" ADD CONSTRAINT "FK_32a6e4065ab9d7275321271d3ae" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE`);
        await queryRunner.query(`ALTER TABLE "Transaction" ADD CONSTRAINT "FK_95df5765ab070a02eb29b82bd64" FOREIGN KEY ("bikeId") REFERENCES "Bikes"("id") ON DELETE CASCADE ON UPDATE CASCADE`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP TABLE "Transaction"`);
    }

}
