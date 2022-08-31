import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class DeviceDetailDto {
  @ApiProperty()
  deviceId: number;

  @ApiProperty()
  deviceName: string;

  @ApiProperty()
  host: string;
}

export class DeviceUpsertDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  readonly deviceName: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  readonly host: string;
}
