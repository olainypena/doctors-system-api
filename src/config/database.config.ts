import { Global, Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';

@Global()
@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        type: 'mysql',
        url: configService.get('DATABASE_URL'),
        ssl: { rejectUnauthorized: false },
        autoLoadEntities: true,
        synchronize: true,
        logging: true,
        entities: [__dirname + '../../modules/*/entities/*.entity{.ts,.js}'],
      }),
    }),
  ],
})
export class DatabaseConfig {}
