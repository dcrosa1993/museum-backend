import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { User, UserRole } from './entities/user.entity.js';

import { DecodedIdToken } from 'firebase-admin/auth';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly usersRepository: Repository<User>,
  ) {}

  async findByFirebaseUid(firebaseUid: string): Promise<User | null> {
    return this.usersRepository.findOne({
      where: {
        firebaseUid,
      },
    });
  }

  async findOrCreateFromFirebase(token: DecodedIdToken): Promise<User> {
    let user = await this.findByFirebaseUid(token.uid);

    if (!user) {
      const email = token.email ?? '';

      const isInitialAdmin =
        !!process.env.INITIAL_ADMIN_EMAIL &&
        email.toLowerCase() === process.env.INITIAL_ADMIN_EMAIL.toLowerCase();

      user = this.usersRepository.create({
        firebaseUid: token.uid,

        email,

        displayName: token.name ?? email,

        photoUrl: token.picture ?? null,

        role: isInitialAdmin ? UserRole.ADMINISTRATOR : UserRole.COLLABORATOR,

        isActive: true,

        lastLoginAt: new Date(),
      });
    } else {
      user.email = token.email ?? user.email;

      user.displayName = token.name ?? user.displayName;

      user.photoUrl = token.picture ?? user.photoUrl;

      user.lastLoginAt = new Date();
    }

    return this.usersRepository.save(user);
  }
}
