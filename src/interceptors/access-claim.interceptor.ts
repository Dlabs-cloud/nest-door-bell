import {
    CallHandler,
    ExecutionContext,
    Inject,
    Injectable,
    NestInterceptor,
    UnauthorizedException,
} from '@nestjs/common';
import {Reflector} from '@nestjs/core';
import {ACCESS_CLAIMS_EXTRACTOR, ANONYMOUS_USER} from "../constants";
import {AccessClaimsExtractor} from "../contracts";

@Injectable()
export class AccessClaimInterceptor implements NestInterceptor {
    private tokenPrefix = 'Bearer ';

    constructor(private readonly reflector: Reflector,
                @Inject(ACCESS_CLAIMS_EXTRACTOR) private readonly accessClaimsExtractor: AccessClaimsExtractor) {
    }

    async intercept(context: ExecutionContext, next: CallHandler<any>) {

        const request = context.switchToHttp().getRequest();

        const publicAccessType = this.reflector.getAll(ANONYMOUS_USER, [
            context.getHandler(), context.getClass(),
        ]);
        if (publicAccessType.includes(ANONYMOUS_USER)) {
            return next.handle();
        }

        const accessClaims = await this.accessClaimsExtractor.getClaims(this.getAccessToken(request));
        if (!accessClaims) {
            throw new UnauthorizedException();
        }
        request.accessClaims = accessClaims;
        return next.handle();
    }

    private getAccessToken(request: any): string | null {

        const authorisationToken = request.header('Authorization');


        if (authorisationToken) {
            if (authorisationToken.startsWith(this.tokenPrefix)) {
                return authorisationToken.substring(this.tokenPrefix.length);
            }
        }
        return null;
    }

}
