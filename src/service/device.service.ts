import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Device } from '../entity/device.entity';

@Injectable()
export class DeviceService {
  constructor(
    @InjectRepository(Device) private deviceRepository: Repository<Device>,
  ) {}

  find(): Promise<Device[]> {
    return this.deviceRepository.find();
  }

  findOne(deviceId: number): Promise<Device> {
    return this.deviceRepository.findOne({ where: { deviceId } });
  }
}
