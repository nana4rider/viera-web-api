import { MigrationInterface, QueryRunner } from "typeorm";

export class initialSchema1660370772304 implements MigrationInterface {
    name = 'initialSchema1660370772304'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "devices" ("id" integer PRIMARY KEY AUTOINCREMENT NOT NULL, "device_name" text NOT NULL, "host" text NOT NULL, "app_id" text NOT NULL, "enc_key" text NOT NULL, "light_webhook" text, "created_at" datetime NOT NULL DEFAULT (datetime('now')), "updated_at" datetime NOT NULL DEFAULT (datetime('now')), CONSTRAINT "UQ_8013a5d211b67a517d20687b307" UNIQUE ("app_id"))`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP TABLE "devices"`);
    }

}
