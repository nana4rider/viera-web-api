import {
  ArgumentMetadata,
  Inject,
  Injectable,
  NotFoundException,
  PipeTransform,
} from '@nestjs/common';
import { VieraClientService } from 'src/module/device.module';

@Injectable()
export class VieraClientPipe implements PipeTransform<string> {
  constructor(
    @Inject('VieraClientService')
    private readonly vieraClientService: VieraClientService,
  ) {}

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  async transform(value: string, metadata: ArgumentMetadata) {
    const client = await this.vieraClientService.getAuthorized(Number(value));
    if (!client) throw new NotFoundException();
    return client;
  }
}
