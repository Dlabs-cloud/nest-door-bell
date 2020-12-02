import { createParamDecorator, InternalServerErrorException } from '@nestjs/common';

export const RequestPrincipal = createParamDecorator((data, context) => {
  const accessClaims = context.switchToHttp().getRequest().accessClaims;
  if (!accessClaims) {
    throw new InternalServerErrorException();
  }
  return accessClaims;
});
