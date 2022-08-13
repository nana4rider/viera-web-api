import { IsBoolean } from 'class-validator';

export class DeviceSetMuteDto {
  @IsBoolean()
  readonly value: boolean;
}
