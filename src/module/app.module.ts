import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { NamingStrategy } from 'typeorm-util-ts';
import configuration from '../config/yaml';
import { AppController } from '../controller/app.controller';
import { DeviceModule } from './device.module';

const typeormModule = TypeOrmModule.forRootAsync({
  useFactory: (configService: ConfigService) => {
    return Object.assign({}, configService.get('typeorm'), {
      namingStrategy: new NamingStrategy(),
      autoLoadEntities: true,
    });
  },
  inject: [ConfigService],
});

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [configuration],
    }),
    typeormModule,
    DeviceModule,
  ],
  controllers: [AppController],
  providers: [],
})
export class AppModule {}
