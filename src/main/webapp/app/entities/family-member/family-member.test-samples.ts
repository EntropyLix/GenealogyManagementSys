import dayjs from 'dayjs/esm';

import { IFamilyMember, NewFamilyMember } from './family-member.model';

export const sampleWithRequiredData: IFamilyMember = {
  id: '76db00cd-a25f-4580-a8d8-04557739366f',
  name: 'index',
  gender: 'Kids',
  age: 56710,
  address: 'Pula Ranch withdrawal',
  birthDate: dayjs('2023-02-08T11:43'),
};

export const sampleWithPartialData: IFamilyMember = {
  id: '6f6741b8-6898-41a9-912f-acdf169ec549',
  name: 'Shore',
  gender: 'Cambridgeshire Krone',
  age: 74478,
  address: 'program Metal',
  birthDate: dayjs('2023-02-08T01:35'),
};

export const sampleWithFullData: IFamilyMember = {
  id: '26c8f667-bc21-4fc7-9ce9-c838cc1388d7',
  name: 'Movies',
  gender: 'world-class',
  age: 42484,
  address: 'Home Cambridgeshire',
  birthDate: dayjs('2023-02-08T00:06'),
};

export const sampleWithNewData: NewFamilyMember = {
  name: 'Officer',
  gender: 'uniform',
  age: 6290,
  address: 'Licensed bi-directional',
  birthDate: dayjs('2023-02-07T21:17'),
  id: null,
};

Object.freeze(sampleWithNewData);
Object.freeze(sampleWithRequiredData);
Object.freeze(sampleWithPartialData);
Object.freeze(sampleWithFullData);
