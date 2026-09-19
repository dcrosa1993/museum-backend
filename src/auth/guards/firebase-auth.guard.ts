import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';

import { Request } from 'express';

import { FirebaseService } from '../../firebase/firebase.service.js';
import { UsersService } from '../../users/users.service.js';

@Injectable()
export class FirebaseAuthGuard implements CanActivate {
  constructor(
    private readonly firebaseService: FirebaseService,
    private readonly usersService: UsersService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest<Request>();

    const authorization = request.headers.authorization;

    if (!authorization || !authorization.startsWith('Bearer ')) {
      throw new UnauthorizedException('Token de autenticación requerido.');
    }

    const token = authorization.substring(7);

    try {
      const decodedToken = await this.firebaseService.verifyIdToken(token);

      if (decodedToken.email_verified === false) {
        throw new UnauthorizedException(
          'El correo electrónico no está verificado.',
        );
      }

      const user =
        await this.usersService.findOrCreateFromFirebase(decodedToken);

      if (!user.isActive) {
        throw new UnauthorizedException('El usuario está desactivado.');
      }

      (request as any).firebaseUser = decodedToken;

      (request as any).user = user;

      return true;
    } catch (error) {
      if (error instanceof UnauthorizedException) {
        throw error;
      }

      throw new UnauthorizedException('Token inválido o expirado.');
    }
  }
}
