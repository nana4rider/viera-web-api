import { Injectable, PipeTransform } from '@nestjs/common';
import { VieraClient } from 'panasonic-viera-ts';
import { Device } from '../entity/device.entity';
import { VieraClientService } from '../service/viera-client.service';

@Injectable()
export class VieraClientPipe
  implements PipeTransform<Device, Promise<VieraClient>>
{
  constructor(private readonly vieraClientService: VieraClientService) {}

  async transform(device: Device): Promise<VieraClient> {
    const client = await this.vieraClientService.getClient(device);

    return client;
  }
}
