import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { UserDoctorType, UserRole } from 'src/modules/user/entities';

@Entity({ name: 'USER' })
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'FISRT_NAME', type: 'varchar', length: 50 })
  firstName: string;

  @Column({ name: 'LAST_NAME', type: 'varchar', length: 50 })
  lastName: string;

  @Column({ name: 'CITIZEN_ID', type: 'varchar', length: 11 })
  citizenId: string;

  @Column({ name: 'BIRTH_DATE', type: 'date' })
  birthDate: Date;

  @Column({ name: 'PHONE', type: 'varchar', length: 10 })
  phone: string;

  @Column({ name: 'EMAIL', type: 'varchar', unique: true, length: 100 })
  email: string;

  @Column({ name: 'PASSWORD_HASH', type: 'varchar' })
  passwordHash: string;

  @Column({ name: 'PROFILE_PICTURE', type: 'varchar', nullable: true })
  profilePicture?: string;

  @ManyToOne(() => UserRole, (role) => role.users, {
    nullable: true,
    eager: true,
  })
  @JoinColumn({ name: 'ROLE_ID' })
  role?: UserRole;

  @ManyToOne(() => UserDoctorType, (doctorType) => doctorType.users, {
    nullable: true,
    eager: true,
  })
  @JoinColumn({ name: 'DOCTOR_TYPE_ID' })
  doctorType?: UserDoctorType;

  @Column({ name: 'IS_ACTIVE', default: true })
  isActive: boolean;

  @CreateDateColumn({ name: 'CREATED_AT' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'UPDATED_AT' })
  updatedAt: Date;
}
