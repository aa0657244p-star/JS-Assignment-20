import { SetMetadata } from '@nestjs/common';
import { Roles } from '../enum/role.enum';

export var AUTH_KEY = 'auth';
export const Auth = (...roles: Roles[]) => SetMetadata(AUTH_KEY, roles);