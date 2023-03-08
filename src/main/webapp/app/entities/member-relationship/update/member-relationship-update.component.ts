import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize, map } from 'rxjs/operators';

import { MemberRelationshipFormService, MemberRelationshipFormGroup } from './member-relationship-form.service';
import { IMemberRelationship } from '../member-relationship.model';
import { MemberRelationshipService } from '../service/member-relationship.service';
import { IFamilyMember } from 'app/entities/family-member/family-member.model';
import { FamilyMemberService } from 'app/entities/family-member/service/family-member.service';

@Component({
  selector: 'jhi-member-relationship-update',
  templateUrl: './member-relationship-update.component.html',
})
export class MemberRelationshipUpdateComponent implements OnInit {
  isSaving = false;
  memberRelationship: IMemberRelationship | null = null;

  familyMembersSharedCollection: IFamilyMember[] = [];

  editForm: MemberRelationshipFormGroup = this.memberRelationshipFormService.createMemberRelationshipFormGroup();

  constructor(
    protected memberRelationshipService: MemberRelationshipService,
    protected memberRelationshipFormService: MemberRelationshipFormService,
    protected familyMemberService: FamilyMemberService,
    protected activatedRoute: ActivatedRoute
  ) {}

  compareFamilyMember = (o1: IFamilyMember | null, o2: IFamilyMember | null): boolean =>
    this.familyMemberService.compareFamilyMember(o1, o2);

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ memberRelationship }) => {
      this.memberRelationship = memberRelationship;
      if (memberRelationship) {
        this.updateForm(memberRelationship);
      }

      this.loadRelationshipsOptions();
    });
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const memberRelationship = this.memberRelationshipFormService.getMemberRelationship(this.editForm);
    if (memberRelationship.id !== null) {
      this.subscribeToSaveResponse(this.memberRelationshipService.update(memberRelationship));
    } else {
      this.subscribeToSaveResponse(this.memberRelationshipService.create(memberRelationship));
    }
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<IMemberRelationship>>): void {
    result.pipe(finalize(() => this.onSaveFinalize())).subscribe({
      next: () => this.onSaveSuccess(),
      error: () => this.onSaveError(),
    });
  }

  protected onSaveSuccess(): void {
    this.previousState();
  }

  protected onSaveError(): void {
    // Api for inheritance.
  }

  protected onSaveFinalize(): void {
    this.isSaving = false;
  }

  protected updateForm(memberRelationship: IMemberRelationship): void {
    this.memberRelationship = memberRelationship;
    this.memberRelationshipFormService.resetForm(this.editForm, memberRelationship);

    this.familyMembersSharedCollection = this.familyMemberService.addFamilyMemberToCollectionIfMissing<IFamilyMember>(
      this.familyMembersSharedCollection,
      memberRelationship.fromMember,
      memberRelationship.toMember
    );
  }

  protected loadRelationshipsOptions(): void {
    this.familyMemberService
      .query()
      .pipe(map((res: HttpResponse<IFamilyMember[]>) => res.body ?? []))
      .pipe(
        map((familyMembers: IFamilyMember[]) =>
          this.familyMemberService.addFamilyMemberToCollectionIfMissing<IFamilyMember>(
            familyMembers,
            this.memberRelationship?.fromMember,
            this.memberRelationship?.toMember
          )
        )
      )
      .subscribe((familyMembers: IFamilyMember[]) => (this.familyMembersSharedCollection = familyMembers));
  }
}
