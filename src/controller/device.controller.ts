import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Inject,
  Param,
  Post,
  Put,
} from '@nestjs/common';
import { ApiOperation, ApiParam, ApiResponse, ApiTags } from '@nestjs/swagger';
import { DeviceDetailDto, DeviceUpsertDto } from 'src/dto/device.dto';
import { Device } from 'src/entity/device.entity';
import { VieraClientService } from 'src/module/device.module';
import { DevicePipe } from 'src/pipe/device.pipe';
import { DeviceService } from '../service/device.service';

@Controller('devices')
@ApiTags('device')
export class DeviceController {
  constructor(
    private readonly deviceService: DeviceService,
    @Inject('VieraClientService')
    private readonly vieraClientService: VieraClientService,
  ) {}

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

  @ApiResponse({ status: HttpStatus.CREATED })
  @ApiOperation({ summary: 'デバイスを登録' })
  @Post()
  @HttpCode(HttpStatus.CREATED)
  async create(@Body() data: DeviceUpsertDto): Promise<DeviceDetailDto> {
    const device = this.deviceService.create(data);
    await this.deviceService.save(device);

    const { deviceId, deviceName, host } = device;
    return { deviceId, deviceName, host };
  }

  @ApiParam({
    name: 'deviceId',
    description: 'Device ID',
    required: true,
    type: Number,
  })
  @ApiResponse({ status: HttpStatus.NO_CONTENT })
  @ApiOperation({ summary: 'デバイスを更新' })
  @Put(':deviceId')
  @HttpCode(HttpStatus.NO_CONTENT)
  async update(
    @Param('deviceId', DevicePipe) device: Device,
    @Body() data: DeviceUpsertDto,
  ): Promise<void> {
    device.deviceName = data.deviceName;
    if (device.host !== data.host) {
      device.host === data.host;
      device.appId = null;
      device.encKey = null;
      this.vieraClientService.delete(device.deviceId);
    }

    await this.deviceService.save(device);
  }

  @ApiParam({
    name: 'deviceId',
    description: 'Device ID',
    required: true,
    type: Number,
  })
  @ApiResponse({ status: HttpStatus.NO_CONTENT })
  @ApiOperation({ summary: 'デバイスを削除' })
  @Delete(':deviceId')
  @HttpCode(HttpStatus.NO_CONTENT)
  async remove(
    @Param('deviceId', DevicePipe) { deviceId }: Device,
  ): Promise<void> {
    await this.deviceService.delete(deviceId);
    this.vieraClientService.delete(deviceId);
  }
}
