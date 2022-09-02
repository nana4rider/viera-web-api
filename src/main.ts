import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import fs from 'fs';
import { dump } from 'js-yaml';
import { AppModule } from './module/app.module';

async function bootstrap() {
  const basePath = 'v2';
  const port = process.env.PORT ? Number(process.env.PORT) : 3000;
  const app = await NestFactory.create(AppModule);

  app.useGlobalPipes(new ValidationPipe({ whitelist: true, transform: true }));

  if (process.env.NODE_ENV === 'development') {
    const options = new DocumentBuilder()
      .setTitle('VIERA Unofficial Web API')
      .setDescription('VIERA Unofficial Web API')
      .setVersion('2.0')
      .setLicense('ISC', 'https://licenses.opensource.jp/ISC/ISC.html')
      .addServer(`http://raspberrypi1.local:3003/${basePath}`)
      .build();

    const document = SwaggerModule.createDocument(app, options);

    SwaggerModule.setup('/docs', app, document);

    fs.writeFileSync('./docs/swagger.yaml', dump(document, {}));
  }

  app.setGlobalPrefix(basePath);

  await app.listen(port);
}

void bootstrap();
