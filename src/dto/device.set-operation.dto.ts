import { IsIn } from 'class-validator';
import { VieraKey } from 'panasonic-viera-ts';

export class DeviceSetOperationDto {
  @IsIn(Object.values(VieraKey))
  readonly value: VieraKey;
}
