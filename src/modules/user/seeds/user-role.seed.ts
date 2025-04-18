import { Injectable, OnModuleInit } from '@nestjs/common';
import { DeepPartial, Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { UserRole } from '@/modules/user/entities';

@Injectable()
export class UserRoleSeed implements OnModuleInit {
  constructor(
    @InjectRepository(UserRole)
    private readonly userRolesRepository: Repository<UserRole>,
  ) {}

  async onModuleInit() {
    const count = await this.userRolesRepository.count();
    if (count === 0) await this.loadInitialData();
  }

  private async loadInitialData() {
    const data: DeepPartial<UserRole>[] = [
      {
        id: 1,
        name: 'Admin',
        description: 'Administrator with full access to the system.',
      },
      {
        id: 2,
        name: 'Doctor',
        description: 'Medical professional providing healthcare services.',
      },
      {
        id: 3,
        name: 'Patient',
        description: 'Individual receiving medical care.',
      },
      {
        id: 4,
        name: 'Secretary',
        description: 'Administrative staff managing appointments and records.',
      },
    ];

    await this.userRolesRepository.save(data);
  }
}
