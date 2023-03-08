import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize, map } from 'rxjs/operators';

import { FamilyFormService, FamilyFormGroup } from './family-form.service';
import { IFamily } from '../family.model';
import { FamilyService } from '../service/family.service';
import { IFamilyMember } from 'app/entities/family-member/family-member.model';
import { FamilyMemberService } from 'app/entities/family-member/service/family-member.service';

@Component({
  selector: 'jhi-family-update',
  templateUrl: './family-update.component.html',
})
export class FamilyUpdateComponent implements OnInit {
  isSaving = false;
  family: IFamily | null = null;

  familyMembersSharedCollection: IFamilyMember[] = [];

  editForm: FamilyFormGroup = this.familyFormService.createFamilyFormGroup();

  constructor(
    protected familyService: FamilyService,
    protected familyFormService: FamilyFormService,
    protected familyMemberService: FamilyMemberService,
    protected activatedRoute: ActivatedRoute
  ) {}

  compareFamilyMember = (o1: IFamilyMember | null, o2: IFamilyMember | null): boolean =>
    this.familyMemberService.compareFamilyMember(o1, o2);

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ family }) => {
      this.family = family;
      if (family) {
        this.updateForm(family);
      }

      this.loadRelationshipsOptions();
    });
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const family = this.familyFormService.getFamily(this.editForm);
    if (family.id !== null) {
      this.subscribeToSaveResponse(this.familyService.update(family));
    } else {
      this.subscribeToSaveResponse(this.familyService.create(family));
    }
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<IFamily>>): void {
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

  protected updateForm(family: IFamily): void {
    this.family = family;
    this.familyFormService.resetForm(this.editForm, family);

    this.familyMembersSharedCollection = this.familyMemberService.addFamilyMemberToCollectionIfMissing<IFamilyMember>(
      this.familyMembersSharedCollection,
      ...(family.members ?? [])
    );
  }

  protected loadRelationshipsOptions(): void {
    this.familyMemberService
      .query()
      .pipe(map((res: HttpResponse<IFamilyMember[]>) => res.body ?? []))
      .pipe(
        map((familyMembers: IFamilyMember[]) =>
          this.familyMemberService.addFamilyMemberToCollectionIfMissing<IFamilyMember>(familyMembers, ...(this.family?.members ?? []))
        )
      )
      .subscribe((familyMembers: IFamilyMember[]) => (this.familyMembersSharedCollection = familyMembers));
  }
}
