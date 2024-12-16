import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as dotenv from 'dotenv';
import { setupSwagger } from './swagger.config';
import { ValidationPipe } from '@nestjs/common';


async function bootstrap() {
  dotenv.config();

  const app = await NestFactory.create(AppModule);
  setupSwagger(app);

  app.useGlobalPipes(new ValidationPipe({
    whitelist: true,
  }));

 
  app.enableCors({
    origin: '*', 
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    credentials: true,
  });

  await app.listen(8000);
  console.log(`Welcome to BNR-Archive-Management-System!`);
}
bootstrap();
