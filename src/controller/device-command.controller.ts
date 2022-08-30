import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Post,
} from '@nestjs/common';
import { ApiParam, ApiResponse, ApiTags } from '@nestjs/swagger';
import { VieraClient, VieraKey } from 'panasonic-viera-ts';
import {
  DeviceCommandAppDetailDto,
  DeviceCommandAppRequestDto,
} from 'src/dto/device-command.app.dto';
import { DeviceCommandKeyDto } from 'src/dto/device-command.key.dto';
import { DeviceCommandMuteDto } from 'src/dto/device-command.mute.dto';
import {
  DeviceCommandPowerDetailDto,
  DeviceCommandPowerRequestDto,
} from 'src/dto/device-command.power.dto';
import { DeviceCommandVolumeDto } from 'src/dto/device-command.volume.dto';
import { VieraClientPipe } from 'src/pipe/viera-client.pipe';
import { DeviceService } from '../service/device.service';

@Controller('devices')
@ApiTags('command')
export class DeviceCommandController {
  constructor(private readonly deviceService: DeviceService) {}

  @ApiParam({
    name: 'id',
    description: 'Device ID',
    required: true,
    type: Number,
  })
  @ApiResponse({ status: HttpStatus.OK, type: DeviceCommandPowerDetailDto })
  @Get(':id/command/power')
  async getPower(
    @Param('id', VieraClientPipe) client: VieraClient,
  ): Promise<DeviceCommandPowerDetailDto> {
    const powerOn = await client.isPowerOn();
    return { state: powerOn ? 'ON' : 'OFF' };
  }

  @ApiParam({
    name: 'id',
    description: 'Device ID',
    required: true,
    type: Number,
  })
  @ApiResponse({ status: HttpStatus.OK, type: DeviceCommandPowerDetailDto })
  @Post(':id/command/power')
  async setPower(
    @Param('id', VieraClientPipe) client: VieraClient,
    @Body() data: DeviceCommandPowerRequestDto,
  ): Promise<DeviceCommandPowerDetailDto> {
    const powerOn = await client.isPowerOn();
    if (
      (data.state === 'ON' && powerOn) ||
      (data.state === 'OFF' && !powerOn)
    ) {
      return { state: powerOn ? 'ON' : 'OFF' };
    }

    await client.sendKey(VieraKey.power);

    return { state: powerOn ? 'OFF' : 'ON' };
  }

  @ApiParam({
    name: 'id',
    description: 'Device ID',
    required: true,
    type: Number,
  })
  @ApiResponse({ status: HttpStatus.OK, type: DeviceCommandVolumeDto })
  @Get(':id/command/volume')
  async getVolume(
    @Param('id', VieraClientPipe) client: VieraClient,
  ): Promise<DeviceCommandVolumeDto> {
    const volume = await client.getVolume();

    return { value: volume };
  }

  @ApiParam({
    name: 'id',
    description: 'Device ID',
    required: true,
    type: Number,
  })
  @ApiResponse({ status: HttpStatus.NO_CONTENT })
  @Post(':id/command/volume')
  @HttpCode(HttpStatus.NO_CONTENT)
  async setVolume(
    @Param('id', VieraClientPipe) client: VieraClient,
    @Body() data: DeviceCommandVolumeDto,
  ): Promise<void> {
    await client.setVolume(data.value);
  }

  @ApiParam({
    name: 'id',
    description: 'Device ID',
    required: true,
    type: Number,
  })
  @ApiResponse({ status: HttpStatus.OK, type: DeviceCommandMuteDto })
  @Get(':id/command/mute')
  async getMute(
    @Param('id', VieraClientPipe) client: VieraClient,
  ): Promise<DeviceCommandMuteDto> {
    const mute = await client.getMute();
    return { value: mute };
  }

  @ApiParam({
    name: 'id',
    description: 'Device ID',
    required: true,
    type: Number,
  })
  @ApiResponse({ status: HttpStatus.NO_CONTENT })
  @Post(':id/command/mute')
  @HttpCode(HttpStatus.NO_CONTENT)
  async setMute(
    @Param('id', VieraClientPipe) client: VieraClient,
    @Body() data: DeviceCommandMuteDto,
  ): Promise<void> {
    await client.setMute(data.value);
  }

  @ApiParam({
    name: 'id',
    description: 'Device ID',
    required: true,
    type: Number,
  })
  @ApiResponse({
    status: HttpStatus.OK,
    type: DeviceCommandAppDetailDto,
    isArray: true,
  })
  @Get(':id/command/apps')
  async getApps(
    @Param('id', VieraClientPipe) client: VieraClient,
  ): Promise<DeviceCommandAppDetailDto[]> {
    const apps = await client.getApps();

    return apps.map((app) => ({
      label: app.name,
      productId: app.productId,
      icon: app.iconUrl,
    }));
  }

  @ApiParam({
    name: 'id',
    description: 'Device ID',
    required: true,
    type: Number,
  })
  @ApiResponse({
    status: HttpStatus.NO_CONTENT,
  })
  @Post(':id/command/app')
  @HttpCode(HttpStatus.NO_CONTENT)
  async setApp(
    @Param('id', VieraClientPipe) client: VieraClient,
    @Body() data: DeviceCommandAppRequestDto,
  ): Promise<void> {
    await client.launchApp(data.value);
  }

  @ApiParam({
    name: 'id',
    description: 'Device ID',
    required: true,
    type: Number,
  })
  @ApiResponse({
    status: HttpStatus.NO_CONTENT,
  })
  @Post(':id/command/key')
  @HttpCode(HttpStatus.NO_CONTENT)
  async setKey(
    @Param('id', VieraClientPipe) client: VieraClient,
    @Body() data: DeviceCommandKeyDto,
  ): Promise<void> {
    await client.sendKey(data.value);
  }
}
