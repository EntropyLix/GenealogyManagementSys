import { Injectable } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';

import { IFamily, NewFamily } from '../family.model';

/**
 * A partial Type with required key is used as form input.
 */
type PartialWithRequiredKeyOf<T extends { id: unknown }> = Partial<Omit<T, 'id'>> & { id: T['id'] };

/**
 * Type for createFormGroup and resetForm argument.
 * It accepts IFamily for edit and NewFamilyFormGroupInput for create.
 */
type FamilyFormGroupInput = IFamily | PartialWithRequiredKeyOf<NewFamily>;

type FamilyFormDefaults = Pick<NewFamily, 'id' | 'members'>;

type FamilyFormGroupContent = {
  id: FormControl<IFamily['id'] | NewFamily['id']>;
  familyName: FormControl<IFamily['familyName']>;
  description: FormControl<IFamily['description']>;
  pic: FormControl<IFamily['pic']>;
  members: FormControl<IFamily['members']>;
};

export type FamilyFormGroup = FormGroup<FamilyFormGroupContent>;

@Injectable({ providedIn: 'root' })
export class FamilyFormService {
  createFamilyFormGroup(family: FamilyFormGroupInput = { id: null }): FamilyFormGroup {
    const familyRawValue = {
      ...this.getFormDefaults(),
      ...family,
    };
    return new FormGroup<FamilyFormGroupContent>({
      id: new FormControl(
        { value: familyRawValue.id, disabled: true },
        {
          nonNullable: true,
          validators: [Validators.required],
        }
      ),
      familyName: new FormControl(familyRawValue.familyName, {
        validators: [Validators.required],
      }),
      description: new FormControl(familyRawValue.description),
      pic: new FormControl(familyRawValue.pic),
      members: new FormControl(familyRawValue.members ?? []),
    });
  }

  getFamily(form: FamilyFormGroup): IFamily | NewFamily {
    return form.getRawValue() as IFamily | NewFamily;
  }

  resetForm(form: FamilyFormGroup, family: FamilyFormGroupInput): void {
    const familyRawValue = { ...this.getFormDefaults(), ...family };
    form.reset(
      {
        ...familyRawValue,
        id: { value: familyRawValue.id, disabled: true },
      } as any /* cast to workaround https://github.com/angular/angular/issues/46458 */
    );
  }

  private getFormDefaults(): FamilyFormDefaults {
    return {
      id: null,
      members: [],
    };
  }
}
