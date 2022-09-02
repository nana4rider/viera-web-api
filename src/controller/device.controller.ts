import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Post,
  Put,
} from '@nestjs/common';
import { ApiOperation, ApiParam, ApiResponse, ApiTags } from '@nestjs/swagger';
import { DeviceDetailDto, DeviceUpsertDto } from '../dto/device.dto';
import { Device } from '../entity/device.entity';
import { DevicePipe } from '../pipe/device.pipe';
import { DeviceService } from '../service/device.service';
import { VieraClientService } from '../service/viera-client.service';

@Controller('devices')
@ApiTags('device')
export class DeviceController {
  constructor(
    private readonly deviceService: DeviceService,
    private readonly vieraClientService: VieraClientService,
  ) {}

  @ApiResponse({ status: HttpStatus.OK, type: DeviceDetailDto, isArray: true })
  @ApiOperation({ summary: 'デバイスの一覧を取得' })
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
      this.vieraClientService.deleteClient(device);
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
  async remove(@Param('deviceId', DevicePipe) device: Device): Promise<void> {
    await this.deviceService.delete(device.deviceId);
    this.vieraClientService.deleteClient(device);
  }
}
