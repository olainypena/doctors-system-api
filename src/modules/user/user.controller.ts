import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Query,
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
  ForgetPasswordDto,
  GetUsersDto,
  UpdateUserDto,
} from '@/modules/user/dtos';
import { JwtGuard } from '@/modules/auth/guards';
import { GetUser } from '@/modules/auth/decorators';
import { User } from '@/modules/user/entities';

@Controller('user')
@ApiTags('user')
export class UserController {
  constructor(private userService: UserService) {}

  @Get()
  @HttpCode(HttpStatus.OK)
  @UseGuards(JwtGuard)
  @ApiBearerAuth()
  @ApiOperation({
    description: 'Get single or all users',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Ok',
    schema: {
      example: {
        statusCode: HttpStatus.OK,
        message: 'Users retrieved successfully',
        data: [
          {
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
        ],
      },
    },
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Not Found',
    schema: {
      example: {
        statusCode: HttpStatus.NOT_FOUND,
        message: 'Cannot find user with id {id}}',
        error: 'Not Found',
      },
    },
  })
  getUsers(@Query() dto: GetUsersDto) {
    return this.userService.getUsers(dto);
  }

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @UseGuards(JwtGuard)
  @ApiBearerAuth()
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
  @UseGuards(JwtGuard)
  @ApiBearerAuth()
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
  updateUser(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateUserDto,
  ) {
    return this.userService.updateUser(id, dto);
  }

  @Patch('forget-password')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    description: 'Update user with a temporal password',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Ok',
    schema: {
      example: {
        statusCode: HttpStatus.OK,
        message: 'User updated with a temporal password',
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
        message: 'Cannot find user with email jdoe@em.com',
        error: 'Not Found',
      },
    },
  })
  forgetPassword(@Body() dto: ForgetPasswordDto) {
    return this.userService.forgetPassword(dto);
  }

  @Patch('change-password')
  @HttpCode(HttpStatus.OK)
  @UseGuards(JwtGuard)
  @ApiBearerAuth()
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
  changePassword(@GetUser() user: User, @Body() dto: ChangePasswordDto) {
    return this.userService.changePassword(user, dto);
  }

  @Get('params')
  @HttpCode(HttpStatus.OK)
  @UseGuards(JwtGuard)
  @ApiBearerAuth()
  @ApiOperation({
    description: 'Get all users params',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Ok',
    schema: {
      example: {
        statusCode: HttpStatus.OK,
        message: 'Params retrieved successfully',
        data: {
          roles: [
            {
              id: 1,
              description: 'Admin',
              createdAt: '2023-07-23T20:49:01.771Z',
              updatedAt: null,
              isActive: true,
            },
          ],
          doctorTypes: [
            {
              id: 1,
              type: 'Cardiologist',
              description:
                'Specializes in heart-related conditions and treatments.',
              createdAt: '2023-07-24T00:24:49.682Z',
              updatedAt: null,
              isActive: true,
            },
          ],
        },
      },
    },
  })
  params() {
    return this.userService.getParams();
  }
}
