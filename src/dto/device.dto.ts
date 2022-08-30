import { ApiProperty } from '@nestjs/swagger';

export class DeviceDetailDto {
  @ApiProperty()
  id: number;

  @ApiProperty()
  deviceName: string;
}
