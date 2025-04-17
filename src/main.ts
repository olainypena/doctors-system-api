import { NestFactory } from '@nestjs/core';
import { AppModule } from '@/app.module';
import { ValidationPipe } from '@nestjs/common/pipes';
import { Logger, LoggerErrorInterceptor } from 'nestjs-pino';
import { configureSwaggerMiddleware } from '@/common/middlewares';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, { bufferLogs: true });

  app.setGlobalPrefix(AppModule.globalPrefix);
  app.enableCors();
  app.useLogger(app.get(Logger));
  app.useGlobalInterceptors(new LoggerErrorInterceptor());
  app.useGlobalPipes(new ValidationPipe({ transform: true }));

  configureSwaggerMiddleware(app);

  await app.listen(AppModule.port);
}
bootstrap();
