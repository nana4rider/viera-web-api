import { MigrationInterface, QueryRunner } from "typeorm";

export class appIdEncKeyNullable1661943349268 implements MigrationInterface {
    name = 'appIdEncKeyNullable1661943349268'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`devices\` CHANGE \`app_id\` \`app_id\` text NULL`);
        await queryRunner.query(`ALTER TABLE \`devices\` CHANGE \`enc_key\` \`enc_key\` text NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`devices\` CHANGE \`enc_key\` \`enc_key\` text NOT NULL`);
        await queryRunner.query(`ALTER TABLE \`devices\` CHANGE \`app_id\` \`app_id\` text NOT NULL`);
    }

}
