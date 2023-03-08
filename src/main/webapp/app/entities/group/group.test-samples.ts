import { IGroup, NewGroup } from './group.model';

export const sampleWithRequiredData: IGroup = {
  id: 'd0487fa1-9f8f-4a55-8dbb-6af0bc661d96',
};

export const sampleWithPartialData: IGroup = {
  id: '6a0dc079-c31f-4b91-ac00-7997b6e6fc3d',
  name: 'Franc Palau',
};

export const sampleWithFullData: IGroup = {
  id: '15e462ca-d771-4745-8f32-6e94e37e9970',
  name: 'matrix Team-oriented',
};

export const sampleWithNewData: NewGroup = {
  id: null,
};

Object.freeze(sampleWithNewData);
Object.freeze(sampleWithRequiredData);
Object.freeze(sampleWithPartialData);
Object.freeze(sampleWithFullData);
