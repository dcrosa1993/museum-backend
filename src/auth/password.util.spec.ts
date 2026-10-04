import { describe, expect, it } from 'vitest';
import { hashPassword, verifyPassword } from './password.util.js';

describe('password utilities', () => {
  it('hashes passwords and verifies only the matching password', async () => {
    const hash = await hashPassword('correct horse battery staple');

    expect(hash).not.toContain('correct horse battery staple');
    await expect(verifyPassword('correct horse battery staple', hash)).resolves.toBe(true);
    await expect(verifyPassword('incorrect password', hash)).resolves.toBe(false);
  });
});