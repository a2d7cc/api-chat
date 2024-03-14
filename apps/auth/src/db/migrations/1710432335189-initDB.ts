import { MigrationInterface, QueryRunner } from 'typeorm';

export class InitDB1710432335189 implements MigrationInterface {
  name = 'InitDB1710432335189';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "user" ADD "age" integer NOT NULL`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "user" DROP COLUMN "age"`);
  }
}
