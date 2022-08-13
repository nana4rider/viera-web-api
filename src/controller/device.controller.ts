import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Post,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { VieraClient, VieraKey } from 'panasonic-viera-ts';
import { DeviceSetMuteDto } from 'src/dto/device.set-mute.dto';
import { DeviceSetOperationDto } from 'src/dto/device.set-operation.dto';
import { DeviceSetPowerDto } from 'src/dto/device.set-power.dto';
import { DeviceSetVolumeDto } from 'src/dto/device.set-volume.dto';
import { Device } from 'src/entity/device.entity';
import { DevicePipe } from 'src/pipe/device.pipe';
import { VieraClientPipe } from 'src/pipe/viera-client.pipe';
import { DeviceService } from '../service/device.service';

@Controller('devices')
@ApiTags('devices')
export class DeviceController {
  constructor(private readonly deviceService: DeviceService) {}

  @Get()
  async index() {
    const devices = await this.deviceService.find();
    return devices.map((device) => ({
      id: device.id,
      deviceName: device.deviceName,
    }));
  }

  @Get(':id')
  async findOne(@Param('id', DevicePipe) device: Device) {
    return {
      id: device.id,
      deviceName: device.deviceName,
    };
  }

  @Get(':id/command/power')
  async getPower(@Param('id', VieraClientPipe) client: VieraClient) {
    const powerOn = await client.isPowerOn();
    return { state: powerOn ? 'ON' : 'OFF' };
  }

  @Post(':id/command/power')
  @HttpCode(HttpStatus.NO_CONTENT)
  async setPower(
    @Param('id', VieraClientPipe) client: VieraClient,
    @Body() data: DeviceSetPowerDto,
  ) {
    const powerOn = await client.isPowerOn();
    if (
      (data.state === 'ON' && powerOn) ||
      (data.state === 'OFF' && !powerOn)
    ) {
      return;
    }

    await client.sendKey(VieraKey.power);
  }

  @Get(':id/command/volume')
  async getVolume(@Param('id', VieraClientPipe) client: VieraClient) {
    const volume = await client.getVolume();
    return { value: volume };
  }

  @Post(':id/command/volume')
  @HttpCode(HttpStatus.NO_CONTENT)
  async setVolume(
    @Param('id', VieraClientPipe) client: VieraClient,
    @Body() data: DeviceSetVolumeDto,
  ) {
    await client.setVolume(data.value);
  }

  @Get(':id/command/mute')
  async getMute(@Param('id', VieraClientPipe) client: VieraClient) {
    const mute = await client.getMute();
    return { value: mute };
  }

  @Post(':id/command/mute')
  @HttpCode(HttpStatus.NO_CONTENT)
  async setMute(
    @Param('id', VieraClientPipe) client: VieraClient,
    @Body() data: DeviceSetMuteDto,
  ) {
    await client.setMute(data.value);
  }

  @Post(':id/command/operation')
  @HttpCode(HttpStatus.NO_CONTENT)
  async sendKey(
    @Param('id', VieraClientPipe) client: VieraClient,
    @Body() data: DeviceSetOperationDto,
  ) {
    await client.sendKey(data.value);
  }
}
