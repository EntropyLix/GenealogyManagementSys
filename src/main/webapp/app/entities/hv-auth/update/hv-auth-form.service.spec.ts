import { TestBed } from '@angular/core/testing';

import { sampleWithRequiredData, sampleWithNewData } from '../hv-auth.test-samples';

import { HvAuthFormService } from './hv-auth-form.service';

describe('HvAuth Form Service', () => {
  let service: HvAuthFormService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(HvAuthFormService);
  });

  describe('Service methods', () => {
    describe('createHvAuthFormGroup', () => {
      it('should create a new form with FormControl', () => {
        const formGroup = service.createHvAuthFormGroup();

        expect(formGroup.controls).toEqual(
          expect.objectContaining({
            id: expect.any(Object),
            authType: expect.any(Object),
            user: expect.any(Object),
            family: expect.any(Object),
          })
        );
      });

      it('passing IHvAuth should create a new form with FormGroup', () => {
        const formGroup = service.createHvAuthFormGroup(sampleWithRequiredData);

        expect(formGroup.controls).toEqual(
          expect.objectContaining({
            id: expect.any(Object),
            authType: expect.any(Object),
            user: expect.any(Object),
            family: expect.any(Object),
          })
        );
      });
    });

    describe('getHvAuth', () => {
      it('should return NewHvAuth for default HvAuth initial value', () => {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const formGroup = service.createHvAuthFormGroup(sampleWithNewData);

        const hvAuth = service.getHvAuth(formGroup) as any;

        expect(hvAuth).toMatchObject(sampleWithNewData);
      });

      it('should return NewHvAuth for empty HvAuth initial value', () => {
        const formGroup = service.createHvAuthFormGroup();

        const hvAuth = service.getHvAuth(formGroup) as any;

        expect(hvAuth).toMatchObject({});
      });

      it('should return IHvAuth', () => {
        const formGroup = service.createHvAuthFormGroup(sampleWithRequiredData);

        const hvAuth = service.getHvAuth(formGroup) as any;

        expect(hvAuth).toMatchObject(sampleWithRequiredData);
      });
    });

    describe('resetForm', () => {
      it('passing IHvAuth should not enable id FormControl', () => {
        const formGroup = service.createHvAuthFormGroup();
        expect(formGroup.controls.id.disabled).toBe(true);

        service.resetForm(formGroup, sampleWithRequiredData);

        expect(formGroup.controls.id.disabled).toBe(true);
      });

      it('passing NewHvAuth should disable id FormControl', () => {
        const formGroup = service.createHvAuthFormGroup(sampleWithRequiredData);
        expect(formGroup.controls.id.disabled).toBe(true);

        service.resetForm(formGroup, { id: null });

        expect(formGroup.controls.id.disabled).toBe(true);
      });
    });
  });
});
