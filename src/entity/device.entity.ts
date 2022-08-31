import { ApiProperty } from '@nestjs/swagger';
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
  @ApiProperty()
  @PrimaryGeneratedColumn({ type: 'integer' })
  deviceId!: number;

  @ApiProperty()
  @Column('text')
  deviceName!: string;

  @ApiProperty()
  @Column('text')
  host!: string;

  @ApiProperty()
  @Column({ nullable: true, type: 'text' })
  appId: string | null;

  @ApiProperty()
  @Column({ nullable: true, type: 'text' })
  encKey: string | null;

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
