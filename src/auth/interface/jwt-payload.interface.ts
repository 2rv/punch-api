import { UserRole } from '../enum/user-role.enum';

export interface JwtPayload {
  id: number;
  key: string;
  login: string;
  role: keyof UserRole;
  balance: number;
}
