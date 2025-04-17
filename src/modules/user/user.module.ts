import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserController } from '@/modules/user/user.controller';
import { UserService } from '@/modules/user/user.service';
import * as Entities from '@/modules/user/entities';

@Module({
  imports: [TypeOrmModule.forFeature([...Object.values(Entities)])],
  controllers: [UserController],
  providers: [UserService],
})
export class UserModule {}
