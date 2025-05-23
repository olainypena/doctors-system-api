import { forwardRef, Module } from '@nestjs/common';
import { AuthController } from '@/modules/auth/auth.controller';
import { AuthService } from '@/modules/auth/auth.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { JwtStrategy } from '@/modules/auth/strategies';
import { JwtModule, JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import * as Entities from '@/modules/auth/entities';
import { UserModule } from '@/modules';

@Module({
  imports: [
    JwtModule.register({}),
    forwardRef(() => UserModule),
    TypeOrmModule.forFeature([...Object.values(Entities)]),
  ],
  controllers: [AuthController],
  providers: [ConfigService, JwtStrategy, JwtService, AuthService],
  exports: [AuthService],
})
export class AuthModule {}
