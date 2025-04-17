import { DynamicModule } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { LoggerModule } from 'nestjs-pino';
import { pino } from 'pino';

export const LoggerMiddleware: DynamicModule = LoggerModule.forRootAsync({
  imports: [ConfigModule],
  inject: [ConfigService],
  useFactory: (configService: ConfigService) => ({
    pinoHttp: {
      transport: {
        timestamp: pino.stdTimeFunctions.isoTime,
        target: 'pino-pretty',
        options: {
          singleLine: configService.get('NODE_ENV') === 'prod',
          colorize: true,
          translateTime: "yyyy-mm-dd'T'HH:MM:ss.l'Z'",
        },
      },
      redact: {
        paths: ['req.body.password'],
      },
      serializers: {
        req: (req) => ({ ...req, body: req.raw.body }),
      },
    },
  }),
});
