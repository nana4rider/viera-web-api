import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class DeviceAuthDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  readonly pinCode: string;
}
