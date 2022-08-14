import { IsIn } from 'class-validator';
import { VieraKey } from 'panasonic-viera-ts';

export class DeviceSetKeyDto {
  @IsIn(Object.values(VieraKey))
  readonly value: VieraKey;
}
