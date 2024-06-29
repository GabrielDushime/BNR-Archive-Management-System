import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as dotenv from 'dotenv';
import { setupSwagger } from './swagger.config';
import { Logger, ValidationPipe } from '@nestjs/common';
import * as multer from 'multer'; 

async function bootstrap() {

  dotenv.config();

  const app = await NestFactory.create(AppModule);
  setupSwagger(app);

  app.useGlobalPipes(new ValidationPipe({
    whitelist:true,
  }))
 

  await app.listen(3000);
  console.log(`Welcome to BNR-Archive-Management-System!`);
}
bootstrap();
