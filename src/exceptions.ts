export class BaseException extends Error {
  status: number
  message: string
}

export class NotFoundException extends BaseException {
  status = 404

  constructor(msg?: string) {
    super()
    this.message = msg || 'not found'
  }
}

export class UnauthorizedException extends BaseException {
  status = 401

  constructor(msg?: string) {
    super()
    this.message = msg || 'not logged in'
  }
}
