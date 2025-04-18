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
  FindAllUsersDto,
  UpdateUserDto,
} from '@/modules/user/dtos';
import * as argon from 'argon2';
import { MailerService } from '@nestjs-modules/mailer';
import { IResponse } from '@/common/interfaces';
import { PaginationUtil } from '@/common/utils';

@Injectable()
export class UserService {
  constructor(
    private mailerService: MailerService,
    private readonly paginationUtil: PaginationUtil,
    // @InjectPinoLogger(UserService.name)
    // private readonly logger: PinoLogger,
    @InjectRepository(User)
    private usersRepository: Repository<User>,
    @InjectRepository(UserRole)
    private userRolesRepository: Repository<UserRole>,
    @InjectRepository(UserDoctorType)
    private userDoctorTypesRepository: Repository<UserDoctorType>,
  ) {}

  async findAll(dto: FindAllUsersDto): Promise<IResponse> {
    const { page, pageSize, ...filter } = dto;
    const usersCount: number = await this.usersRepository.count({
      where: filter,
    });

    if (usersCount === 0) {
      throw new NotFoundException(`No users found`);
    }

    const users: User[] = await this.usersRepository.find({
      ...this.paginationUtil.setPagination(page, pageSize),
      where: filter,
      order: { createdAt: 'DESC' },
    });

    users.forEach((user) => delete user.passwordHash);

    return {
      statusCode: HttpStatus.OK,
      message: 'Users retrieved',
      data: {
        ...this.paginationUtil.setPaginationRes(page, pageSize, usersCount),
        items: users,
      },
    };
  }

  async get(authUser: User): Promise<IResponse<User>> {
    const user: User = await this.usersRepository.findOneBy({
      id: authUser.id,
    });

    delete user.passwordHash;

    return {
      statusCode: HttpStatus.OK,
      message: 'User retrieved successfully',
      data: user,
    };
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

    await this.mailerService.sendMail({
      to: newUser.email,
      subject: 'Bienvenido',
      template: './user-created',
      context: {
        name: `${newUser.firstName} ${newUser.lastName}`,
        password: dto.password,
      },
    });
    // .then((res) => this.logger.info(res, 'User Created Mail'));

    return {
      statusCode: HttpStatus.CREATED,
      message: 'User created successfully',
      data: newUser,
    };
  }

  async updateUser(id: string, dto: UpdateUserDto) {
    const user = await this.usersRepository.findOneBy({ id });

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
      await this.mailerService.sendMail({
        to: updatedUser.email,
        subject: `User ${updatedUser.isActive ? 'Enabled' : 'Disabled'}`,
        template: './user-change-status',
        context: {
          name: `${updatedUser.firstName} ${updatedUser.lastName}`,
          isActive: updatedUser.isActive,
        },
      });
      // .then((res) => this.logger.info(res, 'User Status Mail'));
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
}
