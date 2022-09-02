import { Injectable } from '@nestjs/common';
import { VieraClient } from 'panasonic-viera-ts';
import { Device } from '../entity/device.entity';

@Injectable()
export class VieraClientRepository {
  private readonly clients = new Map<number, VieraClient>();

  async getClient({
    deviceId,
    host,
    appId,
    encKey,
  }: Device): Promise<VieraClient> {
    if (this.clients.has(deviceId)) {
      return this.clients.get(deviceId);
    }

    const client = new VieraClient(host, { appId, encKey });
    this.clients.set(deviceId, client);

    if (appId && encKey) {
      await client.connect();
    }

    return client;
  }

  deleteClient(device: Device) {
    this.clients.delete(device.deviceId);
  }
}
