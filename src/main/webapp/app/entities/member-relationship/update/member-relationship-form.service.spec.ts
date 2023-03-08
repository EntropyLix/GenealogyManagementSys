import { TestBed } from '@angular/core/testing';

import { sampleWithRequiredData, sampleWithNewData } from '../member-relationship.test-samples';

import { MemberRelationshipFormService } from './member-relationship-form.service';

describe('MemberRelationship Form Service', () => {
  let service: MemberRelationshipFormService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(MemberRelationshipFormService);
  });

  describe('Service methods', () => {
    describe('createMemberRelationshipFormGroup', () => {
      it('should create a new form with FormControl', () => {
        const formGroup = service.createMemberRelationshipFormGroup();

        expect(formGroup.controls).toEqual(
          expect.objectContaining({
            id: expect.any(Object),
            relationshipName: expect.any(Object),
            fromMember: expect.any(Object),
            toMember: expect.any(Object),
          })
        );
      });

      it('passing IMemberRelationship should create a new form with FormGroup', () => {
        const formGroup = service.createMemberRelationshipFormGroup(sampleWithRequiredData);

        expect(formGroup.controls).toEqual(
          expect.objectContaining({
            id: expect.any(Object),
            relationshipName: expect.any(Object),
            fromMember: expect.any(Object),
            toMember: expect.any(Object),
          })
        );
      });
    });

    describe('getMemberRelationship', () => {
      it('should return NewMemberRelationship for default MemberRelationship initial value', () => {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const formGroup = service.createMemberRelationshipFormGroup(sampleWithNewData);

        const memberRelationship = service.getMemberRelationship(formGroup) as any;

        expect(memberRelationship).toMatchObject(sampleWithNewData);
      });

      it('should return NewMemberRelationship for empty MemberRelationship initial value', () => {
        const formGroup = service.createMemberRelationshipFormGroup();

        const memberRelationship = service.getMemberRelationship(formGroup) as any;

        expect(memberRelationship).toMatchObject({});
      });

      it('should return IMemberRelationship', () => {
        const formGroup = service.createMemberRelationshipFormGroup(sampleWithRequiredData);

        const memberRelationship = service.getMemberRelationship(formGroup) as any;

        expect(memberRelationship).toMatchObject(sampleWithRequiredData);
      });
    });

    describe('resetForm', () => {
      it('passing IMemberRelationship should not enable id FormControl', () => {
        const formGroup = service.createMemberRelationshipFormGroup();
        expect(formGroup.controls.id.disabled).toBe(true);

        service.resetForm(formGroup, sampleWithRequiredData);

        expect(formGroup.controls.id.disabled).toBe(true);
      });

      it('passing NewMemberRelationship should disable id FormControl', () => {
        const formGroup = service.createMemberRelationshipFormGroup(sampleWithRequiredData);
        expect(formGroup.controls.id.disabled).toBe(true);

        service.resetForm(formGroup, { id: null });

        expect(formGroup.controls.id.disabled).toBe(true);
      });
    });
  });
});
