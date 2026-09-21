import { Injectable, UnauthorizedException } from '@nestjs/common';

import { OAuth2Client } from 'google-auth-library';

import { GoogleUserProfile } from '../users/users.service.js';

@Injectable()
export class GoogleAuthService {
  private readonly client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

  async verifyIdToken(idToken: string): Promise<GoogleUserProfile> {
    try {
      const ticket = await this.client.verifyIdToken({
        idToken,
        audience: process.env.GOOGLE_CLIENT_ID,
      });

      const payload = ticket.getPayload();

      if (!payload) {
        throw new UnauthorizedException('Token de Google inválido.');
      }

      if (!payload.sub || !payload.email) {
        throw new UnauthorizedException(
          'El token de Google no contiene los datos necesarios.',
        );
      }

      if (payload.email_verified !== true) {
        throw new UnauthorizedException(
          'El correo de Google no está verificado.',
        );
      }

      if (
        payload.iss !== 'https://accounts.google.com' &&
        payload.iss !== 'accounts.google.com'
      ) {
        throw new UnauthorizedException('Emisor de token inválido.');
      }

      return {
        googleId: payload.sub,

        email: payload.email,

        displayName: payload.name ?? payload.email,

        photoUrl: payload.picture ?? null,
      };
    } catch (error) {
      if (error instanceof UnauthorizedException) {
        throw error;
      }

      throw new UnauthorizedException(
        'No se pudo verificar la identidad de Google.',
      );
    }
  }
}
