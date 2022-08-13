import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AppModule } from './module/app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(new ValidationPipe({ whitelist: true, transform: true }));
  app.setGlobalPrefix('v2');

  const options = new DocumentBuilder()
    .setTitle('VIERA Web API')
    .setDescription('VIERA Unofficial Web API')
    .setVersion('2.0')
    .setBasePath('v2')
    .addBearerAuth()
    .build();

  const document = SwaggerModule.createDocument(app, options);
  SwaggerModule.setup('/docs', app, document);

  await app.listen(process.env.PORT ? Number(process.env.PORT) : 3000);
}

bootstrap();
