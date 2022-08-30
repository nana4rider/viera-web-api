import { ApiProperty } from '@nestjs/swagger';
import { IsInt, Max, Min } from 'class-validator';

export class DeviceCommandVolumeDto {
  @ApiProperty()
  @IsInt()
  @Min(0)
  @Max(100)
  readonly value: number;
}
