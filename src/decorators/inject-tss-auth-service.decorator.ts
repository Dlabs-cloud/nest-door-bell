import { Inject } from '@nestjs/common';
import {TSS_AUTH_API} from "../constants";

export const InjectTssAuthService = () => {
  return Inject(TSS_AUTH_API);
};