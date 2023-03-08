import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize, map } from 'rxjs/operators';

import { HvAuthFormService, HvAuthFormGroup } from './hv-auth-form.service';
import { IHvAuth } from '../hv-auth.model';
import { HvAuthService } from '../service/hv-auth.service';
import { IUser } from 'app/entities/user/user.model';
import { UserService } from 'app/entities/user/user.service';
import { IFamily } from 'app/entities/family/family.model';
import { FamilyService } from 'app/entities/family/service/family.service';

@Component({
  selector: 'jhi-hv-auth-update',
  templateUrl: './hv-auth-update.component.html',
})
export class HvAuthUpdateComponent implements OnInit {
  isSaving = false;
  hvAuth: IHvAuth | null = null;

  usersSharedCollection: IUser[] = [];
  familiesSharedCollection: IFamily[] = [];

  editForm: HvAuthFormGroup = this.hvAuthFormService.createHvAuthFormGroup();

  constructor(
    protected hvAuthService: HvAuthService,
    protected hvAuthFormService: HvAuthFormService,
    protected userService: UserService,
    protected familyService: FamilyService,
    protected activatedRoute: ActivatedRoute
  ) {}

  compareUser = (o1: IUser | null, o2: IUser | null): boolean => this.userService.compareUser(o1, o2);

  compareFamily = (o1: IFamily | null, o2: IFamily | null): boolean => this.familyService.compareFamily(o1, o2);

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ hvAuth }) => {
      this.hvAuth = hvAuth;
      if (hvAuth) {
        this.updateForm(hvAuth);
      }

      this.loadRelationshipsOptions();
    });
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const hvAuth = this.hvAuthFormService.getHvAuth(this.editForm);
    if (hvAuth.id !== null) {
      this.subscribeToSaveResponse(this.hvAuthService.update(hvAuth));
    } else {
      this.subscribeToSaveResponse(this.hvAuthService.create(hvAuth));
    }
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<IHvAuth>>): void {
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

  protected updateForm(hvAuth: IHvAuth): void {
    this.hvAuth = hvAuth;
    this.hvAuthFormService.resetForm(this.editForm, hvAuth);

    this.usersSharedCollection = this.userService.addUserToCollectionIfMissing<IUser>(this.usersSharedCollection, hvAuth.user);
    this.familiesSharedCollection = this.familyService.addFamilyToCollectionIfMissing<IFamily>(
      this.familiesSharedCollection,
      hvAuth.family
    );
  }

  protected loadRelationshipsOptions(): void {
    this.userService
      .query()
      .pipe(map((res: HttpResponse<IUser[]>) => res.body ?? []))
      .pipe(map((users: IUser[]) => this.userService.addUserToCollectionIfMissing<IUser>(users, this.hvAuth?.user)))
      .subscribe((users: IUser[]) => (this.usersSharedCollection = users));

    this.familyService
      .query()
      .pipe(map((res: HttpResponse<IFamily[]>) => res.body ?? []))
      .pipe(map((families: IFamily[]) => this.familyService.addFamilyToCollectionIfMissing<IFamily>(families, this.hvAuth?.family)))
      .subscribe((families: IFamily[]) => (this.familiesSharedCollection = families));
  }
}
