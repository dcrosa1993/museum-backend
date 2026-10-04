import { Injectable } from '@nestjs/common';

import { InjectRepository } from '@nestjs/typeorm';

import { Repository } from 'typeorm';

import { User, UserRole } from './entities/user.entity.js';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly usersRepository: Repository<User>,
  ) {}

  async findById(id: string): Promise<User | null> {
    return this.usersRepository.findOne({
      where: {
        id,
      },
    });
  }

  async findByEmailForAuthentication(email: string): Promise<User | null> {
    return this.usersRepository
      .createQueryBuilder('user')
      .addSelect('user.passwordHash')
      .where('user.email = :email', { email })
      .getOne();
  }

  async createLocalUser(
    email: string,
    displayName: string,
    passwordHash: string,
  ): Promise<User> {
    const user = this.usersRepository.create({
      googleId: null,
      email,
      displayName,
      photoUrl: null,
      passwordHash,
      role: UserRole.COLLABORATOR,
      isActive: true,
      lastLoginAt: new Date(),
    });

    return this.usersRepository.save(user);
  }

  async updateLastLogin(user: User): Promise<User> {
    user.lastLoginAt = new Date();
    return this.usersRepository.save(user);
  }
}
