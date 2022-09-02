import {
  BadRequestException,
  Body,
  Controller,
  HttpStatus,
  Param,
  ParseIntPipe,
  Post,
  Put,
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
  @ApiOperation({ summary: 'PINコードをデバイスの画面に表示' })
  @Post(':deviceId/auth/displayPinCode')
  async displayPinCode(
    @Param('deviceId', ParseIntPipe) deviceId: number,
  ): Promise<void> {
    const client = await this.vieraClientService.getUnauthorized(deviceId);
    await client.displayPinCode();
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
    @Param('deviceId', DevicePipe) device: Device,
    @Body() { pinCode }: DeviceAuthDto,
  ): Promise<void> {
    const client = await this.vieraClientService.getUnauthorized(
      device.deviceId,
    );

    try {
      const auth = await client.requestAuth(pinCode);
      device.appId = auth.appId;
      device.encKey = auth.encKey;
      this.vieraClientService.authorized(device.deviceId);
    } catch (err) {
      console.error(err);
      throw new BadRequestException('Invalid PINCode.');
    }

    await this.deviceService.save(device);
  }
}
