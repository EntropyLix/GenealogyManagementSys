/* eslint-disable @typescript-eslint/no-unsafe-return */
/* eslint-disable @typescript-eslint/no-unnecessary-type-assertion */
import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize, map } from 'rxjs/operators';

import { GroupFormService, GroupFormGroup } from './group-form.service';
import { IGroup } from '../group.model';
import { GroupService } from '../service/group.service';
import { IUser } from 'app/entities/user/user.model';
import { UserService } from 'app/entities/user/user.service';
import { IFamily } from 'app/entities/family/family.model';
import { FamilyService } from 'app/entities/family/service/family.service';
import { GenealogyService } from 'app/genealogy/genealogy.service';
import { SessionStorageService } from 'ngx-webstorage';

@Component({
  selector: 'jhi-group-update',
  styleUrls: ['group-update.component.scss'],
  templateUrl: './group-update.component.html',
})
export class GroupUpdateComponent implements OnInit {
  isSaving = false;
  group: IGroup | null = null;

  canRead: any[];
  userName: any;
  canWrite: any[];
  hasMembers: any[];
  hasReadyFamilies: any[];
  tempHasReadyFamilies: any[];
  hasWirteFamilies: any[];

  usersSharedCollection: IUser[] = [];
  familiesSharedCollection: IFamily[] = [];

  editForm: GroupFormGroup = this.groupFormService.createGroupFormGroup();

  constructor(
    protected groupService: GroupService,
    protected groupFormService: GroupFormService,
    protected userService: UserService,
    protected familyService: FamilyService,
    private genealogyService: GenealogyService,
    private sessionStorageService: SessionStorageService,
    protected activatedRoute: ActivatedRoute
  ) {
    this.canRead = [];
    this.canWrite = [];
    this.hasMembers = [];
    this.hasReadyFamilies = [];
    this.tempHasReadyFamilies = [];
    this.hasWirteFamilies = [];
  }

  compareUser = (o1: IUser | null, o2: IUser | null): boolean => this.userService.compareUser(o1, o2);

  compareFamily = (o1: IFamily | null, o2: IFamily | null): boolean => this.familyService.compareFamily(o1, o2);

  async ngOnInit(): Promise<void> {
    this.userName = this.sessionStorageService.retrieve('account')?.login;
    await this.getGroup();
    this.activatedRoute.data.subscribe(({ group }) => {
      this.group = group;
      if (group) {
        this.updateForm(group);
        this.hasMembers = group.members as any;
        this.hasReadyFamilies = group.reads as any;
        this.hasWirteFamilies = group.writes as any;
        this.tempHasReadyFamilies = this.hasReadyFamilies.filter(
          (value: any) => !this.hasWirteFamilies.find((item: any) => item.id === value.id)
        );
      }

      this.loadRelationshipsOptions();
    });
  }

  changeReadyFamilies(moveTo: boolean): void {
    this.tempHasReadyFamilies = [];
    this.tempHasReadyFamilies = Object.assign([], this.hasReadyFamilies);
    this.hasWirteFamilies = this.hasWirteFamilies.filter((item: any) => this.hasReadyFamilies.find((value: any) => value.id === item.id));
    this.tempHasReadyFamilies = this.tempHasReadyFamilies.filter(
      (item: any) => !this.hasWirteFamilies.find((value: any) => value.id === item.id)
    );
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    // const group = this.groupFormService.getGroup(this.editForm);
    const group = { ...this.editForm.getRawValue(), members: this.hasMembers, reads: this.hasReadyFamilies, writes: this.hasWirteFamilies };
    if (group.id !== null) {
      this.subscribeToSaveResponse(this.groupService.update(group as any));
    } else {
      this.subscribeToSaveResponse(this.groupService.create(group as any));
    }
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<IGroup>>): void {
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

  protected updateForm(group: IGroup): void {
    this.group = group;
    this.groupFormService.resetForm(this.editForm, group);
    this.usersSharedCollection = this.userService.addUserToCollectionIfMissing<IUser>(this.usersSharedCollection, ...(group.members ?? []));
    this.familiesSharedCollection = this.familyService.addFamilyToCollectionIfMissing<IFamily>(
      this.familiesSharedCollection,
      ...(group.reads ?? []),
      ...(group.writes ?? [])
    );
  }

  protected loadRelationshipsOptions(): void {
    this.userService
      .query()
      .pipe(map((res: HttpResponse<IUser[]>) => res.body ?? []))
      .pipe(map((users: IUser[]) => this.userService.addUserToCollectionIfMissing<IUser>(users, ...(this.group?.members ?? []))))
      .subscribe(
        (users: IUser[]) =>
          (this.usersSharedCollection = users.filter((item: any) => !this.hasMembers.find((value: any) => value.id === item.id)))
      );

    this.familyService
      .query()
      .pipe(map((res: HttpResponse<IFamily[]>) => res.body ?? []))
      .pipe(
        map((families: IFamily[]) =>
          this.familyService.addFamilyToCollectionIfMissing<IFamily>(families, ...(this.group?.reads ?? []), ...(this.group?.writes ?? []))
        )
      )
      .subscribe(
        (families: IFamily[]) =>
          (this.familiesSharedCollection = families.filter(
            (item: any) =>
              (this.canWrite.find((value: any) => value.id === item.id) &&
                !this.hasReadyFamilies.find((value: any) => value.id === item.id)) ||
              this.userName === 'admin'
          ))
      );
  }
  private async getGroup(): Promise<any> {
    return new Promise<any>((resolve: any) => {
      this.genealogyService.queryGroup().subscribe((res: any) => {
        const group = res.filter((item: any) => (item.members as any[]).find((value: any) => value.login === this.userName));
        this.canRead = group.map((item: any) => item.reads).flat(Infinity);
        this.canWrite = group.map((item: any) => item.writes).flat(Infinity);
        resolve();
      });
    });
  }
}
