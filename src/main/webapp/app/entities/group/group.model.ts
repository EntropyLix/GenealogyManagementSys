import { IUser } from 'app/entities/user/user.model';
import { IFamily } from 'app/entities/family/family.model';

export interface IGroup {
  id: string;
  name?: string | null;
  members?: Pick<IUser, 'id' | 'login'>[] | null;
  reads?: Pick<IFamily, 'id' | 'familyName'>[] | null;
  writes?: Pick<IFamily, 'id' | 'familyName'>[] | null;
}

export type NewGroup = Omit<IGroup, 'id'> & { id: null };
