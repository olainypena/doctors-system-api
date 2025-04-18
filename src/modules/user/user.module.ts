import { forwardRef, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserController } from '@/modules/user/user.controller';
import { UserService } from '@/modules/user/user.service';
import { MailConfig } from '@/config';
import { LoggerMiddleware } from '@/common/middlewares';
import { ConfigService } from '@nestjs/config';
import { AuthModule } from '@/modules';
import * as Entities from '@/modules/user/entities';
import * as Seeds from '@/modules/user/seeds';

@Module({
  imports: [
    LoggerMiddleware,
    MailConfig,
    TypeOrmModule.forFeature([...Object.values(Entities)]),
    forwardRef(() => AuthModule),
  ],
  controllers: [UserController],
  providers: [
    UserService,
    ConfigService,
    ...Object.values(Seeds),
    // ...Object.values(Utils),
  ],
  exports: [UserService, TypeOrmModule],
})
export class UserModule {}
