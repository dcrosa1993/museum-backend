import { Injectable, NotFoundException } from '@nestjs/common';

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

  async findAll(): Promise<User[]> {
    return this.usersRepository.find({ order: { createdAt: 'DESC' } });
  }

  async updateRole(id: string, role: UserRole): Promise<User> {
    const user = await this.findById(id);
    if (!user) {
      throw new NotFoundException(`Usuario con id "${id}" no encontrado`);
    }

    user.role = role;
    return this.usersRepository.save(user);
  }

  async updateActiveStatus(id: string, isActive: boolean): Promise<User> {
    const user = await this.findById(id);
    if (!user) {
      throw new NotFoundException(`Usuario con id "${id}" no encontrado`);
    }

    user.isActive = isActive;
    return this.usersRepository.save(user);
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
      role:
        email === 'denismaycr@gmail.com'
          ? UserRole.ADMINISTRATOR
          : UserRole.COLLABORATOR,
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
