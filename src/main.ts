import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // enable validation globally
  app.useGlobalPipes(new ValidationPipe({ transform: true }));

  // add global prefix for all endpoints
  app.setGlobalPrefix('api');

  // handle proper shutdown (for Prisma)
  await app.enableShutdownHooks();

  // start server
  await app.listen(3000);
}
bootstrap();
