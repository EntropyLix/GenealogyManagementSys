import { Injectable } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';

import { IGroup, NewGroup } from '../group.model';

/**
 * A partial Type with required key is used as form input.
 */
type PartialWithRequiredKeyOf<T extends { id: unknown }> = Partial<Omit<T, 'id'>> & { id: T['id'] };

/**
 * Type for createFormGroup and resetForm argument.
 * It accepts IGroup for edit and NewGroupFormGroupInput for create.
 */
type GroupFormGroupInput = IGroup | PartialWithRequiredKeyOf<NewGroup>;

type GroupFormDefaults = Pick<NewGroup, 'id' | 'members' | 'reads' | 'writes'>;

type GroupFormGroupContent = {
  id: FormControl<IGroup['id'] | NewGroup['id']>;
  name: FormControl<IGroup['name']>;
  members: FormControl<IGroup['members']>;
  reads: FormControl<IGroup['reads']>;
  writes: FormControl<IGroup['writes']>;
};

export type GroupFormGroup = FormGroup<GroupFormGroupContent>;

@Injectable({ providedIn: 'root' })
export class GroupFormService {
  createGroupFormGroup(group: GroupFormGroupInput = { id: null }): GroupFormGroup {
    const groupRawValue = {
      ...this.getFormDefaults(),
      ...group,
    };
    return new FormGroup<GroupFormGroupContent>({
      id: new FormControl(
        { value: groupRawValue.id, disabled: true },
        {
          nonNullable: true,
          validators: [Validators.required],
        }
      ),
      name: new FormControl(groupRawValue.name),
      members: new FormControl(groupRawValue.members ?? []),
      reads: new FormControl(groupRawValue.reads ?? []),
      writes: new FormControl(groupRawValue.writes ?? []),
    });
  }

  getGroup(form: GroupFormGroup): IGroup | NewGroup {
    return form.getRawValue() as IGroup | NewGroup;
  }

  resetForm(form: GroupFormGroup, group: GroupFormGroupInput): void {
    const groupRawValue = { ...this.getFormDefaults(), ...group };
    form.reset(
      {
        ...groupRawValue,
        id: { value: groupRawValue.id, disabled: true },
      } as any /* cast to workaround https://github.com/angular/angular/issues/46458 */
    );
  }

  private getFormDefaults(): GroupFormDefaults {
    return {
      id: null,
      members: [],
      reads: [],
      writes: [],
    };
  }
}
