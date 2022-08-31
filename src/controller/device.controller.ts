import { Controller, Get, HttpStatus, Param } from '@nestjs/common';
import { ApiOperation, ApiParam, ApiResponse, ApiTags } from '@nestjs/swagger';
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
  async index(): Promise<DeviceDetailDto[]> {
    const devices = await this.deviceService.find();
    return devices.map(({ deviceId, deviceName, host }) => ({
      deviceId,
      deviceName,
      host,
    }));
  }

  @ApiParam({
    name: 'deviceId',
    description: 'Device ID',
    required: true,
    type: Number,
  })
  @ApiResponse({ status: HttpStatus.OK, type: DeviceDetailDto })
  @ApiOperation({ summary: 'デバイスの詳細を取得' })
  @Get(':deviceId')
  async findOne(
    @Param('deviceId', DevicePipe) { deviceId, deviceName, host }: Device,
  ): Promise<DeviceDetailDto> {
    return { deviceId, deviceName, host };
  }
}
