import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';

export class DeviceCommandAppRequestDto {
  @ApiProperty()
  @IsNotEmpty()
  readonly value: string;
}

export class DeviceCommandAppDetailDto {
  @ApiProperty()
  label: string;

  @ApiProperty()
  productId: string;

  @ApiProperty()
  icon: string;
}
