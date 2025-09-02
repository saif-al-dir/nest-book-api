import { NestFactory } from '@nestjs/core';
// import { ValidationPipe } from '@nestjs/common';
import { AppModule } from './app.module';
import cookieParser from 'cookie-parser';
import { ConfigService } from '@nestjs/config';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // enable validation globally
  // app.useGlobalPipes(new ValidationPipe({ transform: true }));

  // add global prefix for all endpoints
  // app.setGlobalPrefix('api');

  // handle proper shutdown (for Prisma)
  // await app.enableShutdownHooks();

  app.use(cookieParser());

  // start server
  const configService = app.get(ConfigService);

  const port = configService.get<number>('port') || 3000;
  await app.listen(port, () => {
    console.log(`🚀 Server running on http://localhost:${port}`);
  });
}
bootstrap();
