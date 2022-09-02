import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { VieraClient } from 'panasonic-viera-ts';
import { DeviceService } from './device.service';

@Injectable()
export class VieraClientService {
  private readonly authClients = new Map<number, VieraClient>();
  private readonly unauthClients = new Map<number, VieraClient>();

  constructor(private readonly deviceService: DeviceService) {}

  async getAuthorized(deviceId: number): Promise<VieraClient> {
    if (this.authClients.has(deviceId)) {
      return this.authClients.get(deviceId);
    }

    const device = await this.deviceService.findOne(deviceId);
    if (!device) {
      throw new NotFoundException('Device not found.');
    }

    const { appId, encKey } = device;

    if (!appId || !encKey) {
      throw new ForbiddenException(
        'Authentication information is not registered.',
      );
    }

    const client = new VieraClient(device.host, {
      appId,
      encKey,
    });

    await client.connect();

    this.authClients.set(deviceId, client);

    return client;
  }

  async getUnauthorized(deviceId: number) {
    if (this.unauthClients.has(deviceId)) {
      return this.unauthClients.get(deviceId);
    }

    const device = await this.deviceService.findOne(deviceId);
    if (!device) {
      throw new NotFoundException('Device not found.');
    }

    const client = new VieraClient(device.host);

    this.unauthClients.set(deviceId, client);

    return client;
  }

  authorized(deviceId: number) {
    const client = this.unauthClients.get(deviceId);
    if (!client) throw new Error();

    this.authClients.set(deviceId, client);
    this.unauthClients.delete(deviceId);
  }

  delete(deviceId: number) {
    this.authClients.delete(deviceId);
    this.unauthClients.delete(deviceId);
  }
}
