import { describe, expect, test } from '@jest/globals';

import { loginHandler } from '~/handlers/auth';
import { BadRequestError } from '~/types/errors';

describe('loginHandler', () => {
  test('email が殻の場合はバリデーションエラーとなる', async () => {
    // Arrange
    const req: any = { body: { email: '', password: 'pass' } }; // eslint-disable-line @typescript-eslint/no-explicit-any

    try {
      // Act
      await loginHandler(req);
      fail('No error occurs.');
    } catch (error) {
      // Assert
      expect(error).toBeInstanceOf(BadRequestError);
      expect((error as BadRequestError).status).toBe(400);
      expect((error as BadRequestError).message).toBe('email is required.');
    }
  });

  test('password が殻の場合はバリデーションエラーとなる', async () => {
    // Arrange
    const req: any = { body: { email: 'mail', password: '' } }; // eslint-disable-line @typescript-eslint/no-explicit-any

    try {
      // Act
      await loginHandler(req);
      fail('No error occurs.');
    } catch (error) {
      // Assert
      expect(error).toBeInstanceOf(BadRequestError);
      expect((error as BadRequestError).status).toBe(400);
      expect((error as BadRequestError).message).toBe('password is required.');
    }
  });
});
