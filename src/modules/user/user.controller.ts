import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiParam,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { UserService } from '@/modules/user/user.service';
import {
  ChangePasswordDto,
  CreateUserDto,
  UpdateUserDto,
} from '@/modules/user/dtos';
import { JwtGuard } from '@/modules/auth/guards';
import { AuthUser } from '@/modules/auth/decorators';
import { User } from '@/modules/user/entities';
import { ApiAnyResponse } from '@/common/decorators';
import { IResponse } from '@/common/interfaces';

@Controller('user')
@UseGuards(JwtGuard)
@ApiTags('user')
@ApiBearerAuth()
export class UserController {
  constructor(private userService: UserService) {}

  @Get()
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Get logged user',
    description: 'Get logged in user info',
  })
  @ApiAnyResponse({
    status: HttpStatus.OK,
    message: 'User retrieved',
    entity: User,
  })
  get(@AuthUser() user: User): Promise<IResponse<User>> {
    return this.userService.get(user);
  }

  @Get('all')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Get All Users',
    description: 'Get all users',
  })
  @ApiAnyResponse({
    status: HttpStatus.OK,
    message: 'Users retrieved',
    entity: [User],
  })
  @ApiAnyResponse({
    status: HttpStatus.BAD_REQUEST,
    message: 'No users found',
    error: true,
  })
  findAll(@AuthUser() user: User): Promise<IResponse<User[]>> {
    return this.userService.findAll(user);
  }

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({
    description: 'Create a new user',
  })
  @ApiResponse({
    status: HttpStatus.CREATED,
    description: 'Created',
    schema: {
      example: {
        statusCode: HttpStatus.CREATED,
        message: 'User created successfully',
        data: {
          id: 3,
          firstName: 'John',
          lastName: 'Doe',
          citizenId: '40212345678',
          birthDate: null,
          phone: '8099904040',
          email: 'jdoe@domain.com',
          profilePicture: null,
          createdAt: '2023-07-24T00:08:04.473Z',
          updatedAt: null,
          isActive: true,
          role: {
            id: 3,
            description: 'Patient',
            createdAt: '2023-07-23T20:49:02.225Z',
            updatedAt: null,
            isActive: true,
          },
          doctorType: null,
        },
      },
    },
  })
  @ApiResponse({
    status: HttpStatus.FORBIDDEN,
    description: 'Forbidden',
    schema: {
      example: {
        statusCode: HttpStatus.FORBIDDEN,
        message: 'Email already registered',
        error: 'Forbidden',
      },
    },
  })
  createUser(@Body() dto: CreateUserDto) {
    return this.userService.createUser(dto);
  }

  @Patch(':id')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    description: 'Update user info',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Ok',
    schema: {
      example: {
        statusCode: HttpStatus.OK,
        message: 'User updated successfully',
        data: {
          id: 3,
          firstName: 'John',
          lastName: 'Doe',
          citizenId: '40212345678',
          birthDate: null,
          phone: '8099904040',
          email: 'jdoe@domain.com',
          profilePicture: null,
          createdAt: '2023-07-24T00:08:04.473Z',
          updatedAt: null,
          isActive: true,
          role: {
            id: 3,
            description: 'Patient',
            createdAt: '2023-07-23T20:49:02.225Z',
            updatedAt: null,
            isActive: true,
          },
          doctorType: null,
        },
      },
    },
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: 'Bad Request',
    schema: {
      example: {
        statusCode: HttpStatus.BAD_REQUEST,
        message: ['email must be an email'],
        error: 'Bad Request',
      },
    },
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Not Found',
    schema: {
      example: {
        statusCode: HttpStatus.NOT_FOUND,
        message: 'Cannot find user with id 25',
        error: 'Not Found',
      },
    },
  })
  @ApiParam({
    name: 'id',
    type: Number,
    example: 1,
    description: 'User ID',
  })
  updateUser(@Param('id') id: string, @Body() dto: UpdateUserDto) {
    return this.userService.updateUser(id, dto);
  }

  @Patch('change-password')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    description: 'Change user current password',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Ok',
    schema: {
      example: {
        statusCode: HttpStatus.OK,
        message: 'Password changed successfully',
        data: {
          id: 3,
          firstName: 'John',
          lastName: 'Doe',
          citizenId: '40212345678',
          birthDate: null,
          phone: '8099904040',
          email: 'jdoe@domain.com',
          profilePicture: null,
          createdAt: '2023-07-24T00:08:04.473Z',
          updatedAt: null,
          isActive: true,
          role: {
            id: 3,
            description: 'Patient',
            createdAt: '2023-07-23T20:49:02.225Z',
            updatedAt: null,
            isActive: true,
          },
          doctorType: null,
        },
      },
    },
  })
  @ApiResponse({
    status: HttpStatus.FORBIDDEN,
    description: 'Forbidden',
    schema: {
      example: {
        statusCode: HttpStatus.FORBIDDEN,
        message: 'Invalid current password',
        error: 'Forbidden',
      },
    },
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Not Found',
    schema: {
      example: {
        statusCode: HttpStatus.NOT_FOUND,
        message: 'Cannot find user with id 25',
        error: 'Not Found',
      },
    },
  })
  changePassword(@AuthUser() user: User, @Body() dto: ChangePasswordDto) {
    return this.userService.changePassword(user, dto);
  }
}
