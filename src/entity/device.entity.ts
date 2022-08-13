import { DateTime } from 'luxon';
import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  Unique,
  UpdateDateColumn,
} from 'typeorm';
import { DateTimeTransformer } from 'typeorm-util-ts';

@Entity()
@Unique(['appId'])
export class Device {
  @PrimaryGeneratedColumn({ type: 'integer' })
  id!: number;

  @Column('text')
  deviceName!: string;

  @Column('text')
  host!: string;

  @Column('text')
  appId!: string;

  @Column('text')
  encKey!: string;

  @Column('text', { nullable: true })
  lightWebhook!: string;

  @CreateDateColumn({
    transformer: DateTimeTransformer.instance,
    select: false,
  })
  readonly createdAt!: DateTime;

  @UpdateDateColumn({
    transformer: DateTimeTransformer.instance,
    select: false,
  })
  readonly updatedAt!: DateTime;
}
