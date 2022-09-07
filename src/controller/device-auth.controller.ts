import {
  BadRequestException,
  Body,
  Controller,
  HttpStatus,
  Logger,
  Param,
  ParseIntPipe,
  Post,
  Put,
  ServiceUnavailableException,
} from '@nestjs/common';
import { ApiOperation, ApiParam, ApiResponse, ApiTags } from '@nestjs/swagger';
import { DeviceAuthDto } from '../dto/device-auth.dto';
import { Device } from '../entity/device.entity';
import { DevicePipe } from '../pipe/device.pipe';
import { DeviceService } from '../service/device.service';
import { VieraClientService } from '../service/viera-client.service';

@Controller('devices')
@ApiTags('auth')
export class DeviceAuthController {
  private readonly logger = new Logger(DeviceAuthController.name);

  constructor(
    private readonly deviceService: DeviceService,
    private readonly vieraClientService: VieraClientService,
  ) {}

  @ApiParam({
    name: 'deviceId',
    description: 'Device ID',
    required: true,
    type: Number,
  })
  @ApiResponse({ status: HttpStatus.OK })
  @ApiResponse({
    status: HttpStatus.SERVICE_UNAVAILABLE,
    description: 'デバイスの電源が入っていない場合',
  })
  @ApiOperation({ summary: 'PINコードをデバイスの画面に表示' })
  @Post(':deviceId/auth/displayPinCode')
  async displayPinCode(
    @Param('deviceId', ParseIntPipe, DevicePipe) device: Device,
  ): Promise<void> {
    const client = await this.vieraClientService.getClient(device, true);
    try {
      await client.displayPinCode();
    } catch (err) {
      this.logger.error(err);
      throw new ServiceUnavailableException();
    }
  }

  @ApiParam({
    name: 'deviceId',
    description: 'Device ID',
    required: true,
    type: Number,
  })
  @ApiResponse({ status: HttpStatus.OK, description: 'PINコードが正しい場合' })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: 'PINコードが誤っている場合',
  })
  @ApiOperation({ summary: 'PINコード認証' })
  @Put(':deviceId/auth')
  async auth(
    @Param('deviceId', ParseIntPipe, DevicePipe) device: Device,
    @Body() { pinCode }: DeviceAuthDto,
  ): Promise<void> {
    const client = await this.vieraClientService.getClient(device, true);

    try {
      const { appId, encKey } = await client.requestAuth(pinCode);

      device.appId = appId;
      device.encKey = encKey;
    } catch (err) {
      this.logger.error(err);
      throw new BadRequestException('Invalid PINCode.');
    }

    await this.deviceService.save(device);
  }
}
