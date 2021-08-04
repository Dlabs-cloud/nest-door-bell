import {SetMetadata} from '@nestjs/common';
import {ANONYMOUS_USER} from "../constants";

export const AnonymousUser = () => SetMetadata(ANONYMOUS_USER, ANONYMOUS_USER);
