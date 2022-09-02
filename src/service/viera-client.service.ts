import { ForbiddenException, Injectable } from '@nestjs/common';
import { VieraClient } from 'panasonic-viera-ts';
import { Device } from '../entity/device.entity';
import { VieraClientRepository } from '../repository/viera-client.repository';

@Injectable()
export class VieraClientService {
  constructor(private readonly vieraClientRepository: VieraClientRepository) {}

  async getClient(
    device: Device,
    allowUnauthorized = false,
  ): Promise<VieraClient> {
    if (!allowUnauthorized && (!device.appId || !device.encKey)) {
      throw new ForbiddenException(
        'Authentication information is not registered.',
      );
    }

    const client = await this.vieraClientRepository.getClient(device);

    return client;
  }

  deleteClient(device: Device) {
    this.vieraClientRepository.deleteClient(device);
  }
}
