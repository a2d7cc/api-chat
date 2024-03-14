import { MigrationInterface, QueryRunner } from "typeorm";

export class SecondMigration1710433449614 implements MigrationInterface {
    name = 'SecondMigration1710433449614'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "user" RENAME COLUMN "name" TO "namePerson"`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "user" RENAME COLUMN "namePerson" TO "name"`);
    }

}
