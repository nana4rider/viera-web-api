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
    let client = this.clients.get(deviceId);
    if (client) {
      return client;
    }

    const auth = appId && encKey;
    client = new VieraClient(host, auth ? { appId, encKey } : undefined);
    this.clients.set(deviceId, client);

    if (auth) {
      await client.connect();
    }

    return client;
  }

  deleteClient(device: Device) {
    this.clients.delete(device.deviceId);
  }
}
