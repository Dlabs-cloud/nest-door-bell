import {ArgumentsHost, Catch, ExceptionFilter} from '@nestjs/common';
import {Response} from 'express';
import {AxiosResponseException} from "../exceptions";

@Catch(AxiosResponseException)
export class AxiosResponseExceptionFilter implements ExceptionFilter {
    catch(exception: AxiosResponseException, host: ArgumentsHost): any {
        const ctx = host.switchToHttp();
        const response = ctx.getResponse<Response>();
        response.status(exception.status)
            .json(exception.data);

    }

}
