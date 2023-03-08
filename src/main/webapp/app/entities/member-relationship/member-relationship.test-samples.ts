import { IMemberRelationship, NewMemberRelationship } from './member-relationship.model';

export const sampleWithRequiredData: IMemberRelationship = {
  id: '39968ec4-3d1f-4bd4-bc45-b966a064367d',
  relationshipName: 'Awesome programming',
};

export const sampleWithPartialData: IMemberRelationship = {
  id: '0de4370d-69fc-431e-ac90-f13fde43b8ad',
  relationshipName: 'solution Car',
};

export const sampleWithFullData: IMemberRelationship = {
  id: '58aabcf8-87a8-44be-96e1-76a4a6087d64',
  relationshipName: 'Toys SMTP Hills',
};

export const sampleWithNewData: NewMemberRelationship = {
  relationshipName: 'withdrawal Product',
  id: null,
};

Object.freeze(sampleWithNewData);
Object.freeze(sampleWithRequiredData);
Object.freeze(sampleWithPartialData);
Object.freeze(sampleWithFullData);
