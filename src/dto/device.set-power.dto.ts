import { IsIn } from 'class-validator';

export class DeviceSetPowerDto {
  @IsIn(['ON', 'OFF', 'TOGGLE'])
  readonly state: 'ON' | 'OFF' | 'TOGGLE';
}
