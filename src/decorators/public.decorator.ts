import { SetMetadata } from '@nestjs/common';
import {PUBLIC_ACCESS} from "../constants";

export const Public = () => SetMetadata(PUBLIC_ACCESS, PUBLIC_ACCESS);