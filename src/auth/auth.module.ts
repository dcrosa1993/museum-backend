import { Module } from '@nestjs/common';

import { FirebaseModule } from '../firebase/firebase.module.js';
import { UsersModule } from '../users/users.module.js';

import { AuthController } from './auth.controller.js';
import { FirebaseAuthGuard } from './guards/firebase-auth.guard.js';
import { RolesGuard } from './guards/roles.guard.js';

@Module({
  imports: [FirebaseModule, UsersModule],
  controllers: [AuthController],
  providers: [FirebaseAuthGuard, RolesGuard],
  exports: [FirebaseAuthGuard, RolesGuard],
})
export class AuthModule {}
