import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
   app.useGlobalPipes(new ValidationPipe({
      whitelist: true,   // sirf DTO ke andar ke fields hi allow karega
      forbidNonWhitelisted: true, // agar extra field aayi to error throw karega
      transform: true,
    }),);
  await app.listen(3000);
}
bootstrap();
