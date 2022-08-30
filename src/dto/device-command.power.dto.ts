import { ApiProperty } from '@nestjs/swagger';
import { IsIn } from 'class-validator';

const reqStates = ['ON', 'OFF', 'TOGGLE'] as const;

export class DeviceCommandPowerRequestDto {
  @ApiProperty({ enum: reqStates })
  @IsIn(reqStates)
  readonly state: typeof reqStates[number];
}

const detailStates = ['ON', 'OFF'] as const;

export class DeviceCommandDetailDto {
  @ApiProperty({ enum: detailStates })
  readonly state: typeof detailStates[number];
}
