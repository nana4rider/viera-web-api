import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DeepPartial, Repository } from 'typeorm';
import { Device } from '../entity/device.entity';

@Injectable()
export class DeviceService {
  constructor(
    @InjectRepository(Device) private deviceRepository: Repository<Device>,
  ) {}

  create(params: DeepPartial<Device>): Device {
    return this.deviceRepository.create(params);
  }

  find(): Promise<Device[]> {
    return this.deviceRepository.find();
  }

  findOne(deviceId: number): Promise<Device> {
    return this.deviceRepository.findOne({ where: { deviceId } });
  }

  async save(device: Device): Promise<void> {
    await this.deviceRepository.save(device);
  }

  async delete(deviceId: number): Promise<void> {
    await this.deviceRepository.delete(deviceId);
  }
}
