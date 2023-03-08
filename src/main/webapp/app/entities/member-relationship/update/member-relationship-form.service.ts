import { Injectable } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';

import { IMemberRelationship, NewMemberRelationship } from '../member-relationship.model';

/**
 * A partial Type with required key is used as form input.
 */
type PartialWithRequiredKeyOf<T extends { id: unknown }> = Partial<Omit<T, 'id'>> & { id: T['id'] };

/**
 * Type for createFormGroup and resetForm argument.
 * It accepts IMemberRelationship for edit and NewMemberRelationshipFormGroupInput for create.
 */
type MemberRelationshipFormGroupInput = IMemberRelationship | PartialWithRequiredKeyOf<NewMemberRelationship>;

type MemberRelationshipFormDefaults = Pick<NewMemberRelationship, 'id'>;

type MemberRelationshipFormGroupContent = {
  id: FormControl<IMemberRelationship['id'] | NewMemberRelationship['id']>;
  relationshipName: FormControl<IMemberRelationship['relationshipName']>;
  fromMember: FormControl<IMemberRelationship['fromMember']>;
  toMember: FormControl<IMemberRelationship['toMember']>;
};

export type MemberRelationshipFormGroup = FormGroup<MemberRelationshipFormGroupContent>;

@Injectable({ providedIn: 'root' })
export class MemberRelationshipFormService {
  createMemberRelationshipFormGroup(memberRelationship: MemberRelationshipFormGroupInput = { id: null }): MemberRelationshipFormGroup {
    const memberRelationshipRawValue = {
      ...this.getFormDefaults(),
      ...memberRelationship,
    };
    return new FormGroup<MemberRelationshipFormGroupContent>({
      id: new FormControl(
        { value: memberRelationshipRawValue.id, disabled: true },
        {
          nonNullable: true,
          validators: [Validators.required],
        }
      ),
      relationshipName: new FormControl(memberRelationshipRawValue.relationshipName, {
        validators: [Validators.required],
      }),
      fromMember: new FormControl(memberRelationshipRawValue.fromMember),
      toMember: new FormControl(memberRelationshipRawValue.toMember),
    });
  }

  getMemberRelationship(form: MemberRelationshipFormGroup): IMemberRelationship | NewMemberRelationship {
    return form.getRawValue() as IMemberRelationship | NewMemberRelationship;
  }

  resetForm(form: MemberRelationshipFormGroup, memberRelationship: MemberRelationshipFormGroupInput): void {
    const memberRelationshipRawValue = { ...this.getFormDefaults(), ...memberRelationship };
    form.reset(
      {
        ...memberRelationshipRawValue,
        id: { value: memberRelationshipRawValue.id, disabled: true },
      } as any /* cast to workaround https://github.com/angular/angular/issues/46458 */
    );
  }

  private getFormDefaults(): MemberRelationshipFormDefaults {
    return {
      id: null,
    };
  }
}
