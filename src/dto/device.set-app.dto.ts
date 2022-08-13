import { IsNotEmpty } from 'class-validator';

export class DeviceSetAppDto {
  @IsNotEmpty()
  readonly value: string;
}
