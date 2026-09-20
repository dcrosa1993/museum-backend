import { Injectable } from '@nestjs/common';
import { cert, getApps, initializeApp } from 'firebase-admin/app';
import { getAuth, Auth, DecodedIdToken } from 'firebase-admin/auth';
import { readFileSync } from 'fs';

@Injectable()
export class FirebaseService {
  private readonly auth: Auth;

  constructor() {
    const serviceAccountPath = process.env.FIREBASE_SERVICE_ACCOUNT_PATH;

    if (!serviceAccountPath) {
      throw new Error(
        'FIREBASE_SERVICE_ACCOUNT_PATH environment variable is not defined',
      );
    }

    const serviceAccount = JSON.parse(readFileSync(serviceAccountPath, 'utf8'));

    const firebaseApp =
      getApps().length > 0
        ? getApps()[0]
        : initializeApp({
            credential: cert(serviceAccount),
          });

    this.auth = getAuth(firebaseApp);
  }

  verifyIdToken(token: string): Promise<DecodedIdToken> {
    return this.auth.verifyIdToken(token);
  }
}
