import { IFamily, NewFamily } from './family.model';

export const sampleWithRequiredData: IFamily = {
  id: '4fb33d34-e799-4ba7-bf0c-bc450e54514a',
  familyName: 'initiatives',
};

export const sampleWithPartialData: IFamily = {
  id: '56ebef61-5c03-4862-a277-9d04a74019f6',
  familyName: 'New connect Jewelery',
};

export const sampleWithFullData: IFamily = {
  id: '9f0a01c5-04a7-42d0-af75-14412d75ca27',
  familyName: 'Corner Intranet Aruba',
  description: 'transparent',
  pic: 'Wooden',
};

export const sampleWithNewData: NewFamily = {
  familyName: 'leading-edge',
  id: null,
};

Object.freeze(sampleWithNewData);
Object.freeze(sampleWithRequiredData);
Object.freeze(sampleWithPartialData);
Object.freeze(sampleWithFullData);
