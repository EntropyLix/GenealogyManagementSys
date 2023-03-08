import { Injectable } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';

import dayjs from 'dayjs/esm';
import { DATE_TIME_FORMAT } from 'app/config/input.constants';
import { IFamilyMember, NewFamilyMember } from '../family-member.model';

/**
 * A partial Type with required key is used as form input.
 */
type PartialWithRequiredKeyOf<T extends { id: unknown }> = Partial<Omit<T, 'id'>> & { id: T['id'] };

/**
 * Type for createFormGroup and resetForm argument.
 * It accepts IFamilyMember for edit and NewFamilyMemberFormGroupInput for create.
 */
type FamilyMemberFormGroupInput = IFamilyMember | PartialWithRequiredKeyOf<NewFamilyMember>;

/**
 * Type that converts some properties for forms.
 */
type FormValueOf<T extends IFamilyMember | NewFamilyMember> = Omit<T, 'birthDate'> & {
  birthDate?: string | null;
};

type FamilyMemberFormRawValue = FormValueOf<IFamilyMember>;

type NewFamilyMemberFormRawValue = FormValueOf<NewFamilyMember>;

type FamilyMemberFormDefaults = Pick<NewFamilyMember, 'id' | 'birthDate'>;

type FamilyMemberFormGroupContent = {
  id: FormControl<FamilyMemberFormRawValue['id'] | NewFamilyMember['id']>;
  name: FormControl<FamilyMemberFormRawValue['name']>;
  gender: FormControl<FamilyMemberFormRawValue['gender']>;
  age: FormControl<FamilyMemberFormRawValue['age']>;
  address: FormControl<FamilyMemberFormRawValue['address']>;
  birthDate: FormControl<FamilyMemberFormRawValue['birthDate']>;
  family: FormControl<FamilyMemberFormRawValue['family']>;
  fromMember: FormControl<FamilyMemberFormRawValue['fromMember']>;
  toMember: FormControl<FamilyMemberFormRawValue['toMember']>;
};

export type FamilyMemberFormGroup = FormGroup<FamilyMemberFormGroupContent>;

@Injectable({ providedIn: 'root' })
export class FamilyMemberFormService {
  createFamilyMemberFormGroup(familyMember: FamilyMemberFormGroupInput = { id: null }): FamilyMemberFormGroup {
    const familyMemberRawValue = this.convertFamilyMemberToFamilyMemberRawValue({
      ...this.getFormDefaults(),
      ...familyMember,
    });
    return new FormGroup<FamilyMemberFormGroupContent>({
      id: new FormControl(
        { value: familyMemberRawValue.id, disabled: true },
        {
          nonNullable: true,
          validators: [Validators.required],
        }
      ),
      name: new FormControl(familyMemberRawValue.name, {
        validators: [Validators.required],
      }),
      gender: new FormControl(familyMemberRawValue.gender, {
        validators: [Validators.required],
      }),
      age: new FormControl(familyMemberRawValue.age, {
        validators: [Validators.required],
      }),
      address: new FormControl(familyMemberRawValue.address, {
        validators: [Validators.required],
      }),
      birthDate: new FormControl(familyMemberRawValue.birthDate, {
        validators: [Validators.required],
      }),
      family: new FormControl(familyMemberRawValue.family),
      fromMember: new FormControl(familyMemberRawValue.fromMember),
      toMember: new FormControl(familyMemberRawValue.toMember),
    });
  }

  getFamilyMember(form: FamilyMemberFormGroup): IFamilyMember | NewFamilyMember {
    return this.convertFamilyMemberRawValueToFamilyMember(form.getRawValue() as FamilyMemberFormRawValue | NewFamilyMemberFormRawValue);
  }

  resetForm(form: FamilyMemberFormGroup, familyMember: FamilyMemberFormGroupInput): void {
    const familyMemberRawValue = this.convertFamilyMemberToFamilyMemberRawValue({ ...this.getFormDefaults(), ...familyMember });
    form.reset(
      {
        ...familyMemberRawValue,
        id: { value: familyMemberRawValue.id, disabled: true },
      } as any /* cast to workaround https://github.com/angular/angular/issues/46458 */
    );
  }

  private getFormDefaults(): FamilyMemberFormDefaults {
    const currentTime = dayjs();

    return {
      id: null,
      birthDate: currentTime,
    };
  }

  private convertFamilyMemberRawValueToFamilyMember(
    rawFamilyMember: FamilyMemberFormRawValue | NewFamilyMemberFormRawValue
  ): IFamilyMember | NewFamilyMember {
    return {
      ...rawFamilyMember,
      birthDate: dayjs(rawFamilyMember.birthDate, DATE_TIME_FORMAT),
    };
  }

  private convertFamilyMemberToFamilyMemberRawValue(
    familyMember: IFamilyMember | (Partial<NewFamilyMember> & FamilyMemberFormDefaults)
  ): FamilyMemberFormRawValue | PartialWithRequiredKeyOf<NewFamilyMemberFormRawValue> {
    return {
      ...familyMember,
      birthDate: familyMember.birthDate ? familyMember.birthDate.format(DATE_TIME_FORMAT) : undefined,
    };
  }
}
