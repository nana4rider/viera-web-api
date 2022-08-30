import { Controller, Get, HttpStatus, Param } from '@nestjs/common';
import { ApiParam, ApiResponse, ApiTags } from '@nestjs/swagger';
import { DeviceDetailDto } from 'src/dto/device.dto';
import { Device } from 'src/entity/device.entity';
import { DevicePipe } from 'src/pipe/device.pipe';
import { DeviceService } from '../service/device.service';

@Controller('devices')
@ApiTags('devices')
export class DeviceController {
  constructor(private readonly deviceService: DeviceService) {}

  @ApiResponse({ status: HttpStatus.OK, type: DeviceDetailDto, isArray: true })
  @Get()
  async index() {
    const devices = await this.deviceService.find();
    return devices.map((device) => ({
      id: device.id,
      deviceName: device.deviceName,
    }));
  }

  @ApiParam({
    name: 'id',
    description: 'Device ID',
    required: true,
    type: Number,
  })
  @ApiResponse({ status: HttpStatus.OK, type: DeviceDetailDto })
  @Get(':id')
  async findOne(@Param('id', DevicePipe) device: Device) {
    return {
      id: device.id,
      deviceName: device.deviceName,
    };
  }
}
