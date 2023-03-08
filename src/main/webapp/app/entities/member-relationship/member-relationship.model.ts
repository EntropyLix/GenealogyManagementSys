import { IFamilyMember } from 'app/entities/family-member/family-member.model';

export interface IMemberRelationship {
  id: string;
  relationshipName?: string | null;
  fromMember?: Pick<IFamilyMember, 'id'> | null;
  toMember?: Pick<IFamilyMember, 'id'> | null;
}

export type NewMemberRelationship = Omit<IMemberRelationship, 'id'> & { id: null };
