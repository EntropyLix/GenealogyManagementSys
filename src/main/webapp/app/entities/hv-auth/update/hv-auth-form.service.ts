import { Injectable } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';

import { IHvAuth, NewHvAuth } from '../hv-auth.model';

/**
 * A partial Type with required key is used as form input.
 */
type PartialWithRequiredKeyOf<T extends { id: unknown }> = Partial<Omit<T, 'id'>> & { id: T['id'] };

/**
 * Type for createFormGroup and resetForm argument.
 * It accepts IHvAuth for edit and NewHvAuthFormGroupInput for create.
 */
type HvAuthFormGroupInput = IHvAuth | PartialWithRequiredKeyOf<NewHvAuth>;

type HvAuthFormDefaults = Pick<NewHvAuth, 'id'>;

type HvAuthFormGroupContent = {
  id: FormControl<IHvAuth['id'] | NewHvAuth['id']>;
  authType: FormControl<IHvAuth['authType']>;
  user: FormControl<IHvAuth['user']>;
  family: FormControl<IHvAuth['family']>;
};

export type HvAuthFormGroup = FormGroup<HvAuthFormGroupContent>;

@Injectable({ providedIn: 'root' })
export class HvAuthFormService {
  createHvAuthFormGroup(hvAuth: HvAuthFormGroupInput = { id: null }): HvAuthFormGroup {
    const hvAuthRawValue = {
      ...this.getFormDefaults(),
      ...hvAuth,
    };
    return new FormGroup<HvAuthFormGroupContent>({
      id: new FormControl(
        { value: hvAuthRawValue.id, disabled: true },
        {
          nonNullable: true,
          validators: [Validators.required],
        }
      ),
      authType: new FormControl(hvAuthRawValue.authType, {
        validators: [Validators.required],
      }),
      user: new FormControl(hvAuthRawValue.user),
      family: new FormControl(hvAuthRawValue.family),
    });
  }

  getHvAuth(form: HvAuthFormGroup): IHvAuth | NewHvAuth {
    return form.getRawValue() as IHvAuth | NewHvAuth;
  }

  resetForm(form: HvAuthFormGroup, hvAuth: HvAuthFormGroupInput): void {
    const hvAuthRawValue = { ...this.getFormDefaults(), ...hvAuth };
    form.reset(
      {
        ...hvAuthRawValue,
        id: { value: hvAuthRawValue.id, disabled: true },
      } as any /* cast to workaround https://github.com/angular/angular/issues/46458 */
    );
  }

  private getFormDefaults(): HvAuthFormDefaults {
    return {
      id: null,
    };
  }
}
