import { ApiProperty } from '@nestjs/swagger';
import { IsIn } from 'class-validator';
import { VieraKey } from 'panasonic-viera-ts';

export class DeviceCommandKeyDto {
  @ApiProperty({ enum: Object.values(VieraKey) })
  @IsIn(Object.values(VieraKey))
  readonly value: VieraKey;
}
