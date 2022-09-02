import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DeviceAuthController } from '../controller/device-auth.controller';
import { DeviceCommandController } from '../controller/device-command.controller';
import { DeviceController } from '../controller/device.controller';
import { Device } from '../entity/device.entity';
import { VieraClientRepository } from '../repository/viera-client.repository';
import { DeviceService } from '../service/device.service';
import { VieraClientService } from '../service/viera-client.service';
@Module({
  imports: [TypeOrmModule.forFeature([Device])],
  providers: [DeviceService, VieraClientService, VieraClientRepository],
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
