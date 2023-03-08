import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize, map } from 'rxjs/operators';

import { FamilyMemberFormService, FamilyMemberFormGroup } from './family-member-form.service';
import { IFamilyMember } from '../family-member.model';
import { FamilyMemberService } from '../service/family-member.service';
import { IFamily } from 'app/entities/family/family.model';
import { FamilyService } from 'app/entities/family/service/family.service';
import { IMemberRelationship } from 'app/entities/member-relationship/member-relationship.model';
import { MemberRelationshipService } from 'app/entities/member-relationship/service/member-relationship.service';

@Component({
  selector: 'jhi-family-member-update',
  templateUrl: './family-member-update.component.html',
})
export class FamilyMemberUpdateComponent implements OnInit {
  isSaving = false;
  familyMember: IFamilyMember | null = null;

  familiesSharedCollection: IFamily[] = [];
  memberRelationshipsSharedCollection: IMemberRelationship[] = [];

  editForm: FamilyMemberFormGroup = this.familyMemberFormService.createFamilyMemberFormGroup();

  constructor(
    protected familyMemberService: FamilyMemberService,
    protected familyMemberFormService: FamilyMemberFormService,
    protected familyService: FamilyService,
    protected memberRelationshipService: MemberRelationshipService,
    protected activatedRoute: ActivatedRoute
  ) {}

  compareFamily = (o1: IFamily | null, o2: IFamily | null): boolean => this.familyService.compareFamily(o1, o2);

  compareMemberRelationship = (o1: IMemberRelationship | null, o2: IMemberRelationship | null): boolean =>
    this.memberRelationshipService.compareMemberRelationship(o1, o2);

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ familyMember }) => {
      this.familyMember = familyMember;
      if (familyMember) {
        this.updateForm(familyMember);
      }

      this.loadRelationshipsOptions();
    });
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const familyMember = this.familyMemberFormService.getFamilyMember(this.editForm);
    if (familyMember.id !== null) {
      this.subscribeToSaveResponse(this.familyMemberService.update(familyMember));
    } else {
      this.subscribeToSaveResponse(this.familyMemberService.create(familyMember));
    }
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<IFamilyMember>>): void {
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

  protected updateForm(familyMember: IFamilyMember): void {
    this.familyMember = familyMember;
    this.familyMemberFormService.resetForm(this.editForm, familyMember);

    this.familiesSharedCollection = this.familyService.addFamilyToCollectionIfMissing<IFamily>(
      this.familiesSharedCollection,
      familyMember.family
    );
    this.memberRelationshipsSharedCollection =
      this.memberRelationshipService.addMemberRelationshipToCollectionIfMissing<IMemberRelationship>(
        this.memberRelationshipsSharedCollection,
        familyMember.fromMember,
        familyMember.toMember
      );
  }

  protected loadRelationshipsOptions(): void {
    this.familyService
      .query()
      .pipe(map((res: HttpResponse<IFamily[]>) => res.body ?? []))
      .pipe(map((families: IFamily[]) => this.familyService.addFamilyToCollectionIfMissing<IFamily>(families, this.familyMember?.family)))
      .subscribe((families: IFamily[]) => (this.familiesSharedCollection = families));

    this.memberRelationshipService
      .query()
      .pipe(map((res: HttpResponse<IMemberRelationship[]>) => res.body ?? []))
      .pipe(
        map((memberRelationships: IMemberRelationship[]) =>
          this.memberRelationshipService.addMemberRelationshipToCollectionIfMissing<IMemberRelationship>(
            memberRelationships,
            this.familyMember?.fromMember,
            this.familyMember?.toMember
          )
        )
      )
      .subscribe((memberRelationships: IMemberRelationship[]) => (this.memberRelationshipsSharedCollection = memberRelationships));
  }
}
