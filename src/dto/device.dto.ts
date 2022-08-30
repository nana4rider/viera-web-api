import { ApiProperty } from '@nestjs/swagger';

export class DeviceDetailDto {
  @ApiProperty()
  deviceId: number;

  @ApiProperty()
  deviceName: string;
}
