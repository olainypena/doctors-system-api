import { forwardRef, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserController } from '@/modules/user/user.controller';
import { UserService } from '@/modules/user/user.service';
import * as Entities from '@/modules/user/entities';
import { MailConfig } from '@/config';
import { LoggerMiddleware } from '@/common/middlewares';
import { ConfigService } from '@nestjs/config';
import { AuthModule } from '@/modules';

@Module({
  imports: [
    LoggerMiddleware,
    MailConfig,
    TypeOrmModule.forFeature([...Object.values(Entities)]),
    forwardRef(() => AuthModule),
  ],
  controllers: [UserController],
  providers: [UserService, ConfigService],
  exports: [UserService, TypeOrmModule],
})
export class UserModule {}
