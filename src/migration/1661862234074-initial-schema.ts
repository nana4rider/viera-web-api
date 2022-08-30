import { MigrationInterface, QueryRunner } from "typeorm";

export class initialSchema1661862234074 implements MigrationInterface {
    name = 'initialSchema1661862234074'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE \`devices\` (\`id\` int NOT NULL AUTO_INCREMENT, \`device_name\` text NOT NULL, \`host\` text NOT NULL, \`app_id\` text NOT NULL, \`enc_key\` text NOT NULL, \`created_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`updated_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), UNIQUE INDEX \`IDX_8013a5d211b67a517d20687b30\` (\`app_id\`), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP INDEX \`IDX_8013a5d211b67a517d20687b30\` ON \`devices\``);
        await queryRunner.query(`DROP TABLE \`devices\``);
    }

}
