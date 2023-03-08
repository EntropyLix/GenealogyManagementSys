import { IHvAuth, NewHvAuth } from './hv-auth.model';

export const sampleWithRequiredData: IHvAuth = {
  id: '720df8c1-c9dd-43a9-9fb8-f4e4f17cabd0',
  authType: 'Fresh Extensions evolve',
};

export const sampleWithPartialData: IHvAuth = {
  id: '45aa33d2-74f3-4762-a811-0e10ae0c3bba',
  authType: 'Washington deposit',
};

export const sampleWithFullData: IHvAuth = {
  id: 'a4b90401-c8a7-4de9-9007-eeb52a1db120',
  authType: 'Soft Buckinghamshire Automotive',
};

export const sampleWithNewData: NewHvAuth = {
  authType: 'Sleek iterate Berkshire',
  id: null,
};

Object.freeze(sampleWithNewData);
Object.freeze(sampleWithRequiredData);
Object.freeze(sampleWithPartialData);
Object.freeze(sampleWithFullData);
