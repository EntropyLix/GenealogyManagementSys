import dayjs from 'dayjs/esm';
import { IFamily } from 'app/entities/family/family.model';
import { IMemberRelationship } from 'app/entities/member-relationship/member-relationship.model';

export interface IFamilyMember {
  id: string;
  name?: string | null;
  gender?: string | null;
  age?: number | null;
  address?: string | null;
  birthDate?: dayjs.Dayjs | null;
  family?: Pick<IFamily, 'id'> | null;
  fromMember?: Pick<IMemberRelationship, 'id' | 'toMember'> | null;
  toMember?: Pick<IMemberRelationship, 'id' | 'fromMember'> | null;
}

export type NewFamilyMember = Omit<IFamilyMember, 'id'> & { id: null };
