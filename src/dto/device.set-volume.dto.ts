import { IsInt, Max, Min } from 'class-validator';

export class DeviceSetVolumeDto {
  @IsInt()
  @Min(0)
  @Max(100)
  readonly value: number;
}
