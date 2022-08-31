import {
  ForbiddenException,
  MiddlewareConsumer,
  Module,
  NestModule,
  NotFoundException,
} from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { VieraClient } from 'panasonic-viera-ts';
import { DeviceAuthController } from 'src/controller/device-auth.controller';
import { DeviceCommandController } from 'src/controller/device-command.controller';
import { DeviceController } from '../controller/device.controller';
import { Device } from '../entity/device.entity';
import { DeviceService } from '../service/device.service';

export interface VieraClientService {
  getAuthorized(id: number): Promise<VieraClient>;

  getUnauthorized(id: number): Promise<VieraClient>;

  authorized(id: number);

  delete(id: number);
}

const clientFactory = {
  provide: 'VieraClientService',
  useFactory: (deviceService: DeviceService) => {
    const authClients = new Map<number, VieraClient>();
    const unauthClients = new Map<number, VieraClient>();

    return {
      async getAuthorized(deviceId: number): Promise<VieraClient> {
        if (authClients.has(deviceId)) {
          return authClients.get(deviceId);
        }

        const device = await deviceService.findOne(deviceId);
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

        authClients.set(deviceId, client);

        return client;
      },

      async getUnauthorized(deviceId: number) {
        if (unauthClients.has(deviceId)) {
          return unauthClients.get(deviceId);
        }

        const device = await deviceService.findOne(deviceId);
        if (!device) {
          throw new NotFoundException('Device not found.');
        }

        const client = new VieraClient(device.host);

        unauthClients.set(deviceId, client);

        return client;
      },

      authorized(deviceId: number) {
        const client = unauthClients.get(deviceId);
        if (!client) throw new Error();

        authClients.set(deviceId, client);
        unauthClients.delete(deviceId);
      },

      delete(deviceId: number) {
        authClients.delete(deviceId);
        unauthClients.delete(deviceId);
      },
    } as VieraClientService;
  },
  inject: [DeviceService],
};

@Module({
  imports: [TypeOrmModule.forFeature([Device])],
  providers: [DeviceService, clientFactory],
  controllers: [
    DeviceController,
    DeviceCommandController,
    DeviceAuthController,
  ],
})
export class DeviceModule implements NestModule {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars, @typescript-eslint/no-empty-function
  configure(consumer: MiddlewareConsumer) {}
}
