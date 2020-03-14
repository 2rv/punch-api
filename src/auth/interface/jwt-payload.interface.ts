import { UserRole } from '../enum/user-role.enum';

export interface JwtPayload {
  id: number;
  role: keyof UserRole;
  balance: number;
  login: string;
}
