import { Injectable, OnModuleInit } from '@nestjs/common';
import { DeepPartial, Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from '@/modules/user/entities';

@Injectable()
export class UserSeed implements OnModuleInit {
  constructor(
    @InjectRepository(User)
    private readonly usersRepository: Repository<User>,
  ) {}

  async onModuleInit() {
    const count = await this.usersRepository.count();
    if (count === 0) await this.loadInitialData();
  }

  private async loadInitialData() {
    const data: DeepPartial<User> = {
      firstName: 'John',
      lastName: 'Doe',
      citizenId: '12345678901',
      birthDate: new Date('1990-01-01'),
      phone: '1234567890',
      email: 'johndoe@example.com',
      passwordHash: 'hashed_password_here',
      profilePicture: 'https://example.com/profile-picture.jpg',
      role: { id: 1 },
    };

    await this.usersRepository.save(data);
  }
}
