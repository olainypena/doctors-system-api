import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { packageJson } from '@/common/utils';
import { LoggerMiddleware } from '@/common/middlewares';
import { DatabaseConfig, MailConfig } from '@/config';
import * as Modules from '@/modules';

@Module({
  imports: [
    LoggerMiddleware,
    DatabaseConfig,
    MailConfig,
    ConfigModule.forRoot({
      isGlobal: true,
      load: [packageJson],
    }),
    ...Object.values(Modules),
  ],
})
export class AppModule {
  static port: number;
  static globalPrefix: string;
  static swaggerUsername: string;
  static swaggerPassword: string;
  static packageName: string;
  static packageVersion: string;
  static packageDescription: string;

  constructor(private readonly configService: ConfigService) {
    const version = this.configService.get<string>('version');

    AppModule.globalPrefix = `v${version.split('.')[0]}`;
    AppModule.packageName = this.configService.get<string>('name');
    AppModule.packageVersion = version;
    AppModule.packageDescription =
      this.configService.get<string>('description');
    AppModule.port = this.configService.get<number>('PORT');
    AppModule.swaggerUsername =
      this.configService.get<string>('SWAGGER_USERNAME');
    AppModule.swaggerPassword =
      this.configService.get<string>('SWAGGER_PASSWORD');
  }
}
