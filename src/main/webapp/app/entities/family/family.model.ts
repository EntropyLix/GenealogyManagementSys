import { IFamilyMember } from 'app/entities/family-member/family-member.model';

export interface IFamily {
  id: string;
  familyName?: string | null;
  description?: string | null;
  pic?: string | null;
  members?: Pick<IFamilyMember, 'id'>[] | null;
}

export type NewFamily = Omit<IFamily, 'id'> & { id: null };
