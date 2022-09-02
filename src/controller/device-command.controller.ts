import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  ParseEnumPipe,
  ParseIntPipe,
  Post,
  Put,
} from '@nestjs/common';
import { ApiOperation, ApiParam, ApiResponse, ApiTags } from '@nestjs/swagger';
import { VieraClient, VieraKey } from 'panasonic-viera-ts';
import { DeviceCommandAppDetailDto } from '../dto/device-command.app.dto';
import { DeviceCommandMuteDto } from '../dto/device-command.mute.dto';
import {
  DeviceCommandPowerDetailDto,
  DeviceCommandPowerRequestDto,
} from '../dto/device-command.power.dto';
import { DeviceCommandVolumeDto } from '../dto/device-command.volume.dto';
import { DevicePipe } from '../pipe/device.pipe';
import { VieraClientPipe } from '../pipe/viera-client.pipe';
import { DeviceService } from '../service/device.service';

@Controller('devices')
@ApiTags('command')
export class DeviceCommandController {
  constructor(private readonly deviceService: DeviceService) {}

  @ApiParam({
    name: 'deviceId',
    description: 'Device ID',
    required: true,
    type: Number,
  })
  @ApiResponse({ status: HttpStatus.OK, type: DeviceCommandPowerDetailDto })
  @ApiOperation({ summary: '電源状態を取得' })
  @Get(':deviceId/command/power')
  async getPower(
    @Param('deviceId', ParseIntPipe, DevicePipe, VieraClientPipe)
    client: VieraClient,
  ): Promise<DeviceCommandPowerDetailDto> {
    const powerOn = await client.isPowerOn();
    return { state: powerOn ? 'ON' : 'OFF' };
  }

  @ApiParam({
    name: 'deviceId',
    description: 'Device ID',
    required: true,
    type: Number,
  })
  @ApiResponse({ status: HttpStatus.NO_CONTENT })
  @ApiOperation({ summary: '電源状態を変更' })
  @Put(':deviceId/command/power')
  @HttpCode(HttpStatus.NO_CONTENT)
  async setPower(
    @Param('deviceId', ParseIntPipe, DevicePipe, VieraClientPipe)
    client: VieraClient,
    @Body() data: DeviceCommandPowerRequestDto,
  ): Promise<void> {
    const powerOn = await client.isPowerOn();
    if (
      (data.state === 'ON' && powerOn) ||
      (data.state === 'OFF' && !powerOn)
    ) {
      return;
    }

    await client.sendKey(VieraKey.power);
  }

  @ApiParam({
    name: 'deviceId',
    description: 'Device ID',
    required: true,
    type: Number,
  })
  @ApiResponse({ status: HttpStatus.OK, type: DeviceCommandVolumeDto })
  @ApiOperation({ summary: '音量を取得' })
  @Get(':deviceId/command/volume')
  async getVolume(
    @Param('deviceId', ParseIntPipe, DevicePipe, VieraClientPipe)
    client: VieraClient,
  ): Promise<DeviceCommandVolumeDto> {
    const volume = await client.getVolume();

    return { value: volume };
  }

  @ApiParam({
    name: 'deviceId',
    description: 'Device ID',
    required: true,
    type: Number,
  })
  @ApiResponse({ status: HttpStatus.NO_CONTENT })
  @ApiOperation({ summary: '音量を変更' })
  @Put(':deviceId/command/volume')
  @HttpCode(HttpStatus.NO_CONTENT)
  async setVolume(
    @Param('deviceId', ParseIntPipe, DevicePipe, VieraClientPipe)
    client: VieraClient,
    @Body() data: DeviceCommandVolumeDto,
  ): Promise<void> {
    await client.setVolume(data.value);
  }

  @ApiParam({
    name: 'deviceId',
    description: 'Device ID',
    required: true,
    type: Number,
  })
  @ApiResponse({ status: HttpStatus.OK, type: DeviceCommandMuteDto })
  @ApiOperation({ summary: 'ミュート状態を取得' })
  @Get(':deviceId/command/mute')
  async getMute(
    @Param('deviceId', ParseIntPipe, DevicePipe, VieraClientPipe)
    client: VieraClient,
  ): Promise<DeviceCommandMuteDto> {
    const mute = await client.getMute();
    return { value: mute };
  }

  @ApiParam({
    name: 'deviceId',
    description: 'Device ID',
    required: true,
    type: Number,
  })
  @ApiResponse({ status: HttpStatus.NO_CONTENT })
  @ApiOperation({ summary: 'ミュート状態を変更' })
  @Put(':deviceId/command/mute')
  @HttpCode(HttpStatus.NO_CONTENT)
  async setMute(
    @Param('deviceId', ParseIntPipe, DevicePipe, VieraClientPipe)
    client: VieraClient,
    @Body() data: DeviceCommandMuteDto,
  ): Promise<void> {
    await client.setMute(data.value);
  }

  @ApiParam({
    name: 'deviceId',
    description: 'Device ID',
    required: true,
    type: Number,
  })
  @ApiResponse({
    status: HttpStatus.OK,
    type: DeviceCommandAppDetailDto,
    isArray: true,
  })
  @ApiOperation({ summary: 'アプリの一覧を取得' })
  @Get(':deviceId/command/apps')
  async getApps(
    @Param('deviceId', ParseIntPipe, DevicePipe, VieraClientPipe)
    client: VieraClient,
  ): Promise<DeviceCommandAppDetailDto[]> {
    const apps = await client.getApps();

    return apps.map((app) => ({
      label: app.name,
      productId: app.productId,
      icon: app.iconUrl,
    }));
  }

  @ApiParam({
    name: 'deviceId',
    description: 'Device ID',
    required: true,
    type: Number,
  })
  @ApiResponse({
    status: HttpStatus.OK,
  })
  @ApiOperation({ summary: 'アプリを起動' })
  @Post(':deviceId/command/launchApp/:productId')
  @HttpCode(HttpStatus.OK)
  async setApp(
    @Param('deviceId', ParseIntPipe, DevicePipe, VieraClientPipe)
    client: VieraClient,
    @Param('productId') productId: string,
  ): Promise<void> {
    await client.launchApp(productId);
  }

  @ApiParam({
    name: 'deviceId',
    description: 'Device ID',
    required: true,
    type: Number,
  })
  @ApiParam({
    name: 'vieraKey',
    description: 'Viera Key',
    required: true,
    type: String,
    enum: Object.values(VieraKey),
  })
  @ApiResponse({
    status: HttpStatus.OK,
  })
  @ApiOperation({ summary: 'キーを送信' })
  @Post(':deviceId/command/sendKey/:vieraKey')
  @HttpCode(HttpStatus.OK)
  async setKey(
    @Param('deviceId', ParseIntPipe, DevicePipe, VieraClientPipe)
    client: VieraClient,
    @Param('vieraKey', new ParseEnumPipe(Object.values(VieraKey)))
    key: VieraKey,
  ): Promise<void> {
    await client.sendKey(key);
  }
}
