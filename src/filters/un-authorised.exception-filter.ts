import { ArgumentsHost, Catch, ExceptionFilter, HttpStatus } from '@nestjs/common';
import { Response } from 'express';
import {UnAuthorisedException} from "../exceptions";

@Catch(UnAuthorisedException)
export class UnAuthorisedExceptionFilter implements ExceptionFilter {
  catch(exception: UnAuthorisedException, host: ArgumentsHost): any {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    response.status(HttpStatus.UNAUTHORIZED)
      .json({
        message: exception.message,
      });
  }

}

