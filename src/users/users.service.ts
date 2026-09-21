import { Injectable } from '@nestjs/common';

import { InjectRepository } from '@nestjs/typeorm';

import { Repository } from 'typeorm';

import { User, UserRole } from './entities/user.entity.js';

export interface GoogleUserProfile {
  googleId: string;
  email: string;
  displayName: string;
  photoUrl: string | null;
}

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly usersRepository: Repository<User>,
  ) {}

  async findByGoogleId(googleId: string): Promise<User | null> {
    return this.usersRepository.findOne({
      where: {
        googleId,
      },
    });
  }

  async findById(id: string): Promise<User | null> {
    return this.usersRepository.findOne({
      where: {
        id,
      },
    });
  }

  async findOrCreateFromGoogle(profile: GoogleUserProfile): Promise<User> {
    let user = await this.findByGoogleId(profile.googleId);

    if (!user) {
      const initialAdminEmail = process.env.INITIAL_ADMIN_EMAIL;

      const isInitialAdmin =
        !!initialAdminEmail &&
        profile.email.toLowerCase() === initialAdminEmail.toLowerCase();

      user = this.usersRepository.create({
        googleId: profile.googleId,
        email: profile.email,
        displayName: profile.displayName,
        photoUrl: profile.photoUrl,

        role: isInitialAdmin ? UserRole.ADMINISTRATOR : UserRole.COLLABORATOR,

        isActive: true,
        lastLoginAt: new Date(),
      });
    } else {
      user.email = profile.email;
      user.displayName = profile.displayName;
      user.photoUrl = profile.photoUrl;
      user.lastLoginAt = new Date();
    }

    return this.usersRepository.save(user);
  }
}
