import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  //validator
  app.useGlobalPipes(new ValidationPipe());
  //swagger
  const config = new DocumentBuilder()
    .setTitle('Crm document api')
    .setDescription('The crm API description')
    .setVersion('1.0')
    .addTag('Crm')
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('docs', app, document);

  await app.listen(3000);
}
bootstrap();
