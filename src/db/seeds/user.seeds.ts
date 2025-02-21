import { UserM } from '../../users/model/user.model';
import { UserRole } from '../../common/enums/user-role.enum';

export const UserSeed: UserM[] = [
  {
    email: process.env.ADMIN_EMAIL as string,
    password: process.env.ADMIN_PASSWORD as string, 
    role: UserRole.ADMIN,
  },
  {
    email: process.env.USER_EMAIL as string,
    password: process.env.USER_PASSWORD as string, 
    role: UserRole.USER,
  },
];
