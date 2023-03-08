import { IUser } from 'app/entities/user/user.model';
import { IFamily } from 'app/entities/family/family.model';

export interface IHvAuth {
  id: string;
  authType?: string | null;
  user?: Pick<IUser, 'id'> | null;
  family?: Pick<IFamily, 'id'> | null;
}

export type NewHvAuth = Omit<IHvAuth, 'id'> & { id: null };
