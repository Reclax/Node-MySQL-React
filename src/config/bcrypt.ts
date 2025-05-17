import { compareSync, hashSync } from 'bcryptjs';

export class BcryptAdapter {
  private static instance: BcryptAdapter;
  
  private constructor() {
  }

  public static getInstance(): BcryptAdapter {
    if (!BcryptAdapter.instance) {
      BcryptAdapter.instance = new BcryptAdapter();
    }
    return BcryptAdapter.instance;
  }

  hash(password: string): string {
    return hashSync(password);
  }

  compare(password: string, hashed: string): boolean {
    return compareSync(password, hashed);
  }
}