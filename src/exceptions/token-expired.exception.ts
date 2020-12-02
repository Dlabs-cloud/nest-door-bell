export class TokenExpiredException extends Error {


  constructor() {
    super('Token is already expired');
  }
}

