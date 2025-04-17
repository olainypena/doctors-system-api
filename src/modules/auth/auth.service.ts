import {
  ForbiddenException,
  HttpStatus,
  Injectable,
  NotAcceptableException,
} from '@nestjs/common';
import {
  GenerateOTPDto,
  SignInDto,
  SignUpDto,
  ValidateOTPDto,
} from '@/modules/auth/dtos';
import { ConfigService } from '@nestjs/config';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from '@/modules/user/entities';
import { Between, Repository } from 'typeorm';
import { MailerService } from '@nestjs-modules/mailer';
import { InjectPinoLogger, PinoLogger } from 'nestjs-pino';
import { totp } from 'otplib';
import { OTP } from '@/modules/auth/entities';
import { JwtService } from '@nestjs/jwt';
import { RoleEnum } from '@/modules/user/enums';
import * as argon from 'argon2';
import * as moment from 'moment';

@Injectable()
export class AuthService {
  constructor(
    private config: ConfigService,
    private mailerService: MailerService,
    private jwt: JwtService,
    @InjectPinoLogger(AuthService.name)
    private readonly logger: PinoLogger,
    @InjectRepository(User)
    private usersRepository: Repository<User>,
    @InjectRepository(OTP)
    private otpsRepository: Repository<OTP>,
  ) {}

  private async signToken(userId: number, email: string): Promise<string> {
    const payload = { id: userId, email };

    return this.jwt.sign(payload, {
      expiresIn: '1d',
      secret: this.config.get('JWT_SECRET'),
    });
  }

  async signUp(dto: SignUpDto) {
    const userExists = await this.usersRepository.findOneBy({
      email: dto.email,
    });

    if (userExists) throw new ForbiddenException('User already exists');

    dto.password = await argon.hash(dto.password);

    await this.usersRepository.save({
      firstName: dto.firstName,
      lastName: dto.lastName,
      citizenId: dto.citizenId,
      phone: dto.phone,
      email: dto.email,
      passwordHash: dto.password,
      role: {
        id: RoleEnum.Patient,
      },
    });

    await this.mailerService
      .sendMail({
        to: dto.email,
        subject: 'Registro de Usuario',
        template: './auth-sign-up',
        context: {
          name: `${dto.firstName} ${dto.lastName}`,
        },
      })
      .then((res) => this.logger.info(res, 'New User Mail'));

    const newUser: User = await this.usersRepository.findOneBy({
      email: dto.email,
    });

    delete newUser.passwordHash;

    return {
      statusCode: HttpStatus.CREATED,
      message: 'User created successfully',
      data: {
        token: await this.signToken(newUser.id, newUser.email),
        user: newUser,
      },
    };
  }

  async signIn(dto: SignInDto) {
    const user = await this.usersRepository.findOneBy({
      email: dto.email,
    });

    if (!user) throw new ForbiddenException('Invalid credentials');
    if (!user.isActive) throw new ForbiddenException('User inactive');

    const passwordCorrect = await argon.verify(user.passwordHash, dto.password);

    if (!passwordCorrect) throw new ForbiddenException('Invalid credentials');

    delete user.passwordHash;

    return {
      statusCode: HttpStatus.OK,
      message: 'User sign in successfully',
      data: { token: await this.signToken(user.id, user.email), user },
    };
  }

  async generateOTP(dto: GenerateOTPDto) {
    const userAttempts: number = await this.otpsRepository.countBy({
      email: dto.email,
      createdAt: Between(
        new Date(moment().subtract(2, 'd').toDate()),
        new Date(moment().add(1, 'd').toDate()),
      ),
    });

    if (userAttempts >= 3) {
      throw new NotAcceptableException(
        'OTP attempts exceeded, contact client services',
      );
    }

    const otp = totp.generate(dto.email);

    await this.otpsRepository.save({
      code: otp,
      email: dto.email,
    });

    await this.mailerService
      .sendMail({
        to: dto.email,
        subject: 'Código OTP',
        template: './auth-otp-generate',
        context: {
          otp: otp,
        },
      })
      .then((res) => this.logger.info(res, 'OTP Generated Mail'));

    return {
      statusCode: HttpStatus.OK,
      message: 'OTP generated successfully, check email to get code',
    };
  }

  async validateOTP(dto: ValidateOTPDto) {
    const otpOnDB = await this.otpsRepository.findOneBy({
      code: dto.otp,
      email: dto.email,
      // createdAt: Between(
      //   new Date(moment().subtract(10, 'minutes').toDate()),
      //   new Date(moment().add(10, 'minutes').toDate()),
      // ),
    });

    if (!otpOnDB) throw new NotAcceptableException('Invalid OTP');
    if (otpOnDB.isVerified) throw new NotAcceptableException('Invalid OTP');

    await this.otpsRepository.save(
      this.otpsRepository.create({
        id: otpOnDB.id,
        isVerified: true,
      }),
    );

    return {
      statusCode: HttpStatus.OK,
      message: 'OTP validated successfully',
    };
  }
}
