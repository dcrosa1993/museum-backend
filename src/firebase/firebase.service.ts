import { Injectable } from '@nestjs/common';
import { cert, getApps, initializeApp } from 'firebase-admin/app';
import { getAuth, Auth, DecodedIdToken } from 'firebase-admin/auth';

@Injectable()
export class FirebaseService {
  private readonly auth: Auth;

  constructor() {
    const firebaseApp =
      getApps().length > 0
        ? getApps()[0]
        : initializeApp({
            credential: cert({
              projectId: process.env.FIREBASE_PROJECT_ID,

              clientEmail: process.env.FIREBASE_CLIENT_EMAIL,

              privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(
                /\\n/g,
                '\n',
              ),
            }),
          });

    this.auth = getAuth(firebaseApp);
  }

  verifyIdToken(token: string): Promise<DecodedIdToken> {
    return this.auth.verifyIdToken(token);
  }
}
