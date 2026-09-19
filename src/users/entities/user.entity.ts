import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

export enum UserRole {
  COLLABORATOR = 'collaborator',
  ADMINISTRATOR = 'administrator',
}

@Entity('users')
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({
    type: 'varchar',
    length: 128,
    unique: true,
  })
  firebaseUid: string;

  @Column({
    type: 'varchar',
    length: 320,
    unique: true,
  })
  email: string;

  @Column({
    type: 'varchar',
    length: 200,
  })
  displayName: string;

  @Column({
    type: 'varchar',
    length: 500,
    nullable: true,
  })
  photoUrl: string | null;

  @Column({
    type: 'enum',
    enum: UserRole,
    default: UserRole.COLLABORATOR,
  })
  role: UserRole;

  @Column({
    type: 'boolean',
    default: true,
  })
  isActive: boolean;

  @Column({
    type: 'timestamp',
    nullable: true,
  })
  lastLoginAt: Date | null;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
