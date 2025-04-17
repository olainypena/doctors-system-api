import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { User } from '@/modules/user/entities';

@Entity()
export class UserDoctorType {
  @PrimaryGeneratedColumn({ name: 'ID' })
  id: number;

  @Column({ name: 'NAME', type: 'varchar', unique: true, length: 80 })
  name: string;

  @Column({ name: 'DESCRIPTION', type: 'varchar', length: 250 })
  description: string;

  @Column({ name: 'IS_ACTIVE', default: true })
  isActive: boolean;

  @CreateDateColumn({ name: 'CREATED_AT' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'UPDATED_AT' })
  updatedAt: Date;

  @OneToMany(() => User, (user) => user.doctorType)
  @JoinColumn({ name: 'USER_ID' })
  users: User[];
}
