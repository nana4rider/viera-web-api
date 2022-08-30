import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import fs from 'fs';
import { dump } from 'js-yaml';
import { AppModule } from './module/app.module';

async function bootstrap() {
  const basePath = 'v2';
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(new ValidationPipe({ whitelist: true, transform: true }));
  app.setGlobalPrefix(basePath);

  const options = new DocumentBuilder()
    .setTitle('VIERA Web API')
    .setDescription('VIERA Unofficial Web API')
    .setVersion('2.0')
    .setBasePath(basePath)
    .addBearerAuth()
    .build();

  const document = SwaggerModule.createDocument(app, options);

  fs.writeFileSync('./docs/swagger.yaml', dump(document, {}));

  await app.listen(process.env.PORT ? Number(process.env.PORT) : 3000);
}

bootstrap();
