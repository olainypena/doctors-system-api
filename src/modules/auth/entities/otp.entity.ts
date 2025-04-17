import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity()
export class OTP {
  @PrimaryGeneratedColumn('uuid', { name: 'ID' })
  id: string;

  @Column({ name: 'CODE', type: 'varchar', length: 6 })
  code: string;

  @Column({ name: 'EMAIL', type: 'varchar', length: 100 })
  email: string;

  @Column({ name: 'IS_VERIFIED', default: false })
  isVerified: boolean;

  @CreateDateColumn({ name: 'CREATED_AT' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'UPDATED_AT' })
  updatedAt: Date;
}
