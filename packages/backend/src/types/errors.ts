/**
 * すべての独自エラーの基底クラス
 */
export class CustomError extends Error {
  status: number;

  constructor(status: number, message: string) {
    super(message);
    this.status = 400;
    this.message = message;
  }
}

export class UnauthorizedError extends CustomError {
  constructor(message = 'Unauthorized') {
    super(401, message);
  }
}

export class BadRequestError extends CustomError {
  constructor(message = 'Bad request') {
    super(400, message);
  }
}

export class UserNotFoundError extends CustomError {
  constructor(message = 'User not found') {
    super(500, message);
  }
}
