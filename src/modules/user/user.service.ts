import { InjectRepository } from '@nestjs/typeorm';
import { User, UserDoctorType, UserRole } from '@/modules/user/entities';
import { Repository } from 'typeorm';
import {
  ForbiddenException,
  HttpStatus,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import {
  ChangePasswordDto,
  CreateUserDto,
  ForgetPasswordDto,
  GetUsersDto,
  UpdateUserDto,
} from '@/modules/user/dtos';
import * as argon from 'argon2';
import * as crypto from 'crypto';
import { MailerService } from '@nestjs-modules/mailer';
import { InjectPinoLogger, PinoLogger } from 'nestjs-pino';
import * as moment from 'moment';

@Injectable()
export class UserService {
  constructor(
    private mailerService: MailerService,
    @InjectPinoLogger(UserService.name)
    private readonly logger: PinoLogger,
    @InjectRepository(User)
    private usersRepository: Repository<User>,
    @InjectRepository(UserRole)
    private userRolesRepository: Repository<UserRole>,
    @InjectRepository(UserDoctorType)
    private userDoctorTypesRepository: Repository<UserDoctorType>,
  ) {}

  async getUsers(getUsersDto?: GetUsersDto) {
    const search: any = {};

    if (getUsersDto.firstName) search.firstName = getUsersDto.firstName;
    if (getUsersDto.lastName) search.lastName = getUsersDto.lastName;
    if (getUsersDto.citizenId) search.citizenId = getUsersDto.citizenId;
    if (getUsersDto.phone) search.phone = getUsersDto.phone;
    if (getUsersDto.email) search.email = getUsersDto.email;
    if (getUsersDto.roleId) search.role = { id: getUsersDto.roleId };
    if (getUsersDto.doctorTypeId)
      search.doctorType = { id: getUsersDto.doctorTypeId };
    if (getUsersDto.isActive) search.isActive = getUsersDto.isActive;

    if (getUsersDto.id) {
      if (getUsersDto.id) search.id = getUsersDto.id;

      const user: User = await this.usersRepository.findOneBy(search);

      if (!user) {
        throw new NotFoundException(
          `Cannot find user with id ${getUsersDto.id}`,
        );
      }

      delete user.passwordHash;

      return {
        statusCode: HttpStatus.OK,
        message: 'User retrieved successfully',
        data: user,
      };
    } else {
      const users = await this.usersRepository.find(search);
      users.forEach((user) => delete user.passwordHash);

      return {
        statusCode: HttpStatus.OK,
        message: 'Users retrieved successfully',
        data: users,
      };
    }
  }

  async createUser(dto: CreateUserDto) {
    const user = await this.usersRepository.findOneBy({
      email: dto.email,
    });

    if (user) {
      throw new ForbiddenException('Email already registered');
    }

    const passwordHash = await argon.hash(dto.password);

    const newUser = await this.usersRepository.save({
      firstName: dto.firstName,
      lastName: dto.lastName,
      citizenId: dto.citizenId,
      birthDate: dto.birthDate,
      phone: dto.phone,
      email: dto.email,
      passwordHash,
      profilePicture: dto.profilePicture,
      role: {
        id: dto.roleId,
      },
      doctorType: {
        id: dto.doctorTypeId,
      },
    });

    delete newUser.passwordHash;

    await this.mailerService
      .sendMail({
        to: newUser.email,
        subject: 'Bienvenido',
        template: './user-created',
        context: {
          name: `${newUser.firstName} ${newUser.lastName}`,
          password: dto.password,
        },
      })
      .then((res) => this.logger.info(res, 'User Created Mail'));

    return {
      statusCode: HttpStatus.CREATED,
      message: 'User created successfully',
      data: newUser,
    };
  }

  async updateUser(id: number, dto: UpdateUserDto) {
    const user = await this.usersRepository.findOneBy({ id: 1 });

    if (!user) {
      throw new NotFoundException(`Cannot find user with id ${id}`);
    }

    await this.usersRepository.save(
      this.usersRepository.create({
        id: id,
        firstName: dto.firstName,
        lastName: dto.lastName,
        citizenId: dto.citizenId,
        birthDate: dto.birthDate,
        phone: dto.phone,
        email: dto.email,
        profilePicture: dto.profilePicture,
        role: {
          id: dto.roleId,
        },
        doctorType: {
          id: dto.doctorTypeId,
        },
        isActive: dto.isActive,
      }),
    );

    const updatedUser: User = await this.usersRepository.findOneBy({ id });
    delete updatedUser.passwordHash;

    if (dto.isActive !== undefined) {
      await this.mailerService
        .sendMail({
          to: updatedUser.email,
          subject: `Usuario ${
            updatedUser.isActive ? 'Activado' : 'Desactivado'
          }`,
          template: './user-change-status',
          context: {
            name: `${updatedUser.firstName} ${updatedUser.lastName}`,
            isActive: updatedUser.isActive,
          },
        })
        .then((res) => this.logger.info(res, 'User Status Mail'));
    }

    return {
      statusCode: HttpStatus.OK,
      message: 'User updated successfully',
      data: updatedUser,
    };
  }

  async changePassword(user: User, dto: ChangePasswordDto) {
    const getUser = await this.usersRepository.findOneBy({ id: user.id });

    const currentPasswordCorrect = await argon.verify(
      getUser.passwordHash,
      dto.currentPassword,
    );

    if (!currentPasswordCorrect) {
      throw new ForbiddenException('Invalid current password');
    }

    const newPasswordHash = await argon.hash(dto.newPassword);

    await this.usersRepository.save(
      this.usersRepository.create({
        id: user.id,
        passwordHash: newPasswordHash,
      }),
    );

    delete user.passwordHash;

    return {
      statusCode: HttpStatus.OK,
      message: 'Password changed successfully',
      data: user,
    };
  }

  async forgetPassword(dto: ForgetPasswordDto) {
    const user = await this.usersRepository.findOneBy({
      email: dto.email,
    });

    if (!user) {
      throw new NotFoundException(`Cannot find user with email ${dto.email}`);
    }

    const tempPassword = crypto.randomBytes(5).toString('hex');
    const tempPasswordHash = await argon.hash(tempPassword);

    await this.usersRepository.save(
      this.usersRepository.create({
        id: user.id,
        passwordHash: tempPasswordHash,
      }),
    );

    delete user.passwordHash;

    await this.mailerService
      .sendMail({
        to: user.email,
        subject: 'Contraseña Temporal',
        template: './user-forget-password',
        context: {
          name: `${user.firstName} ${user.lastName}`,
          date: moment().format('DD-MM-YYYY'),
          tempPassword: tempPassword,
        },
      })
      .then((res) => this.logger.info(res, 'Forget Password Mail'));

    return {
      statusCode: HttpStatus.OK,
      message: 'User updated with a temporal password',
      data: {
        ...user,
        temporalPassword: tempPassword,
      },
    };
  }

  async getParams() {
    const roles = await this.userRolesRepository.find();
    const doctorTypes = await this.userDoctorTypesRepository.find();

    return {
      statusCode: HttpStatus.OK,
      message: 'Params retrieved successfully',
      data: {
        roles,
        doctorTypes,
      },
    };
  }
}
