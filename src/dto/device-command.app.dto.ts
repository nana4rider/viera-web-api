import { ApiProperty } from '@nestjs/swagger';

export class DeviceCommandAppDetailDto {
  @ApiProperty()
  label: string;

  @ApiProperty()
  productId: string;

  @ApiProperty()
  icon: string;
}
