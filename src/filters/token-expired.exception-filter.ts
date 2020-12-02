import { ArgumentsHost, Catch, ExceptionFilter, HttpStatus } from '@nestjs/common';
import { Response } from 'express';
import {TokenExpiredException} from "../exceptions";


@Catch(TokenExpiredException)
export class TokenExpiredExceptionFilter implements ExceptionFilter {
  catch(exception: TokenExpiredException, host: ArgumentsHost): any {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    response.status(HttpStatus.UNAUTHORIZED)
      .json({
        message: exception.message,
      });

  }

}