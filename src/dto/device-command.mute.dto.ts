import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean } from 'class-validator';

export class DeviceCommandMuteDto {
  @ApiProperty()
  @IsBoolean()
  readonly value: boolean;
}
