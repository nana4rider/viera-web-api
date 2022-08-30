import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { VieraClient } from 'panasonic-viera-ts';
import { DeviceCommandController } from 'src/controller/device-command.controller';
import { DeviceController } from '../controller/device.controller';
import { Device } from '../entity/device.entity';
import { DeviceService } from '../service/device.service';

export interface VieraClientService {
  get(id: number): Promise<VieraClient>;
}

const clientFactory = {
  provide: 'VieraClientService',
  useFactory: (deviceService: DeviceService) => {
    const clients = new Map<number, VieraClient>();

    return {
      async get(id: number): Promise<VieraClient> {
        if (clients.has(id)) {
          return clients.get(id);
        }
        const device = await deviceService.findOne(id);
        if (!device) {
          throw new Error('device not found.');
        }

        const client = new VieraClient(device.host, {
          appId: device.appId,
          encKey: device.encKey,
        });

        await client.connect();

        clients.set(id, client);

        return client;
      },
    } as VieraClientService;
  },
  inject: [DeviceService],
};

@Module({
  imports: [TypeOrmModule.forFeature([Device])],
  providers: [DeviceService, clientFactory],
  controllers: [DeviceController, DeviceCommandController],
})
export class DeviceModule implements NestModule {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars, @typescript-eslint/no-empty-function
  configure(consumer: MiddlewareConsumer) {}
}
