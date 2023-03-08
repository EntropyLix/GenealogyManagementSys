import { TestBed } from '@angular/core/testing';

import { sampleWithRequiredData, sampleWithNewData } from '../family-member.test-samples';

import { FamilyMemberFormService } from './family-member-form.service';

describe('FamilyMember Form Service', () => {
  let service: FamilyMemberFormService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(FamilyMemberFormService);
  });

  describe('Service methods', () => {
    describe('createFamilyMemberFormGroup', () => {
      it('should create a new form with FormControl', () => {
        const formGroup = service.createFamilyMemberFormGroup();

        expect(formGroup.controls).toEqual(
          expect.objectContaining({
            id: expect.any(Object),
            name: expect.any(Object),
            gender: expect.any(Object),
            age: expect.any(Object),
            address: expect.any(Object),
            birthDate: expect.any(Object),
            family: expect.any(Object),
            fromMember: expect.any(Object),
            toMember: expect.any(Object),
          })
        );
      });

      it('passing IFamilyMember should create a new form with FormGroup', () => {
        const formGroup = service.createFamilyMemberFormGroup(sampleWithRequiredData);

        expect(formGroup.controls).toEqual(
          expect.objectContaining({
            id: expect.any(Object),
            name: expect.any(Object),
            gender: expect.any(Object),
            age: expect.any(Object),
            address: expect.any(Object),
            birthDate: expect.any(Object),
            family: expect.any(Object),
            fromMember: expect.any(Object),
            toMember: expect.any(Object),
          })
        );
      });
    });

    describe('getFamilyMember', () => {
      it('should return NewFamilyMember for default FamilyMember initial value', () => {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const formGroup = service.createFamilyMemberFormGroup(sampleWithNewData);

        const familyMember = service.getFamilyMember(formGroup) as any;

        expect(familyMember).toMatchObject(sampleWithNewData);
      });

      it('should return NewFamilyMember for empty FamilyMember initial value', () => {
        const formGroup = service.createFamilyMemberFormGroup();

        const familyMember = service.getFamilyMember(formGroup) as any;

        expect(familyMember).toMatchObject({});
      });

      it('should return IFamilyMember', () => {
        const formGroup = service.createFamilyMemberFormGroup(sampleWithRequiredData);

        const familyMember = service.getFamilyMember(formGroup) as any;

        expect(familyMember).toMatchObject(sampleWithRequiredData);
      });
    });

    describe('resetForm', () => {
      it('passing IFamilyMember should not enable id FormControl', () => {
        const formGroup = service.createFamilyMemberFormGroup();
        expect(formGroup.controls.id.disabled).toBe(true);

        service.resetForm(formGroup, sampleWithRequiredData);

        expect(formGroup.controls.id.disabled).toBe(true);
      });

      it('passing NewFamilyMember should disable id FormControl', () => {
        const formGroup = service.createFamilyMemberFormGroup(sampleWithRequiredData);
        expect(formGroup.controls.id.disabled).toBe(true);

        service.resetForm(formGroup, { id: null });

        expect(formGroup.controls.id.disabled).toBe(true);
      });
    });
  });
});
