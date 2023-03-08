import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of, Subject, from } from 'rxjs';

import { GroupFormService } from './group-form.service';
import { GroupService } from '../service/group.service';
import { IGroup } from '../group.model';

import { IUser } from 'app/entities/user/user.model';
import { UserService } from 'app/entities/user/user.service';
import { IFamily } from 'app/entities/family/family.model';
import { FamilyService } from 'app/entities/family/service/family.service';

import { GroupUpdateComponent } from './group-update.component';

describe('Group Management Update Component', () => {
  let comp: GroupUpdateComponent;
  let fixture: ComponentFixture<GroupUpdateComponent>;
  let activatedRoute: ActivatedRoute;
  let groupFormService: GroupFormService;
  let groupService: GroupService;
  let userService: UserService;
  let familyService: FamilyService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, RouterTestingModule.withRoutes([])],
      declarations: [GroupUpdateComponent],
      providers: [
        FormBuilder,
        {
          provide: ActivatedRoute,
          useValue: {
            params: from([{}]),
          },
        },
      ],
    })
      .overrideTemplate(GroupUpdateComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(GroupUpdateComponent);
    activatedRoute = TestBed.inject(ActivatedRoute);
    groupFormService = TestBed.inject(GroupFormService);
    groupService = TestBed.inject(GroupService);
    userService = TestBed.inject(UserService);
    familyService = TestBed.inject(FamilyService);

    comp = fixture.componentInstance;
  });

  describe('ngOnInit', () => {
    it('Should call User query and add missing value', () => {
      const group: IGroup = { id: 'CBA' };
      const members: IUser[] = [{ id: '15d77ba5-80e4-4293-9f48-ab06cd5dd7bf' }];
      group.members = members;

      const userCollection: IUser[] = [{ id: '56bfe9a1-85d5-4c56-b326-84e0dcdba451' }];
      jest.spyOn(userService, 'query').mockReturnValue(of(new HttpResponse({ body: userCollection })));
      const additionalUsers = [...members];
      const expectedCollection: IUser[] = [...additionalUsers, ...userCollection];
      jest.spyOn(userService, 'addUserToCollectionIfMissing').mockReturnValue(expectedCollection);

      activatedRoute.data = of({ group });
      comp.ngOnInit();

      expect(userService.query).toHaveBeenCalled();
      expect(userService.addUserToCollectionIfMissing).toHaveBeenCalledWith(
        userCollection,
        ...additionalUsers.map(expect.objectContaining)
      );
      expect(comp.usersSharedCollection).toEqual(expectedCollection);
    });

    it('Should call Family query and add missing value', () => {
      const group: IGroup = { id: 'CBA' };
      const reads: IFamily[] = [{ id: '7b2bc945-4619-42a4-9e5c-7d0a63f40c0f' }];
      group.reads = reads;
      const writes: IFamily[] = [{ id: '7aae95d7-8d5a-422c-b0fe-1b75ced341fe' }];
      group.writes = writes;

      const familyCollection: IFamily[] = [{ id: '283218e0-9a02-40ef-8752-0bd531e1860e' }];
      jest.spyOn(familyService, 'query').mockReturnValue(of(new HttpResponse({ body: familyCollection })));
      const additionalFamilies = [...reads, ...writes];
      const expectedCollection: IFamily[] = [...additionalFamilies, ...familyCollection];
      jest.spyOn(familyService, 'addFamilyToCollectionIfMissing').mockReturnValue(expectedCollection);

      activatedRoute.data = of({ group });
      comp.ngOnInit();

      expect(familyService.query).toHaveBeenCalled();
      expect(familyService.addFamilyToCollectionIfMissing).toHaveBeenCalledWith(
        familyCollection,
        ...additionalFamilies.map(expect.objectContaining)
      );
      expect(comp.familiesSharedCollection).toEqual(expectedCollection);
    });

    it('Should update editForm', () => {
      const group: IGroup = { id: 'CBA' };
      const member: IUser = { id: 'c2e9d3f5-a031-4fb9-be39-c44845034d46' };
      group.members = [member];
      const read: IFamily = { id: '2f79f867-7bff-48b6-9d9e-8f415dd91830' };
      group.reads = [read];
      const write: IFamily = { id: '6cb0b8af-6c29-4775-bc79-e6aa817bacd9' };
      group.writes = [write];

      activatedRoute.data = of({ group });
      comp.ngOnInit();

      expect(comp.usersSharedCollection).toContain(member);
      expect(comp.familiesSharedCollection).toContain(read);
      expect(comp.familiesSharedCollection).toContain(write);
      expect(comp.group).toEqual(group);
    });
  });

  describe('save', () => {
    it('Should call update service on save for existing entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IGroup>>();
      const group = { id: 'ABC' };
      jest.spyOn(groupFormService, 'getGroup').mockReturnValue(group);
      jest.spyOn(groupService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ group });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: group }));
      saveSubject.complete();

      // THEN
      expect(groupFormService.getGroup).toHaveBeenCalled();
      expect(comp.previousState).toHaveBeenCalled();
      expect(groupService.update).toHaveBeenCalledWith(expect.objectContaining(group));
      expect(comp.isSaving).toEqual(false);
    });

    it('Should call create service on save for new entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IGroup>>();
      const group = { id: 'ABC' };
      jest.spyOn(groupFormService, 'getGroup').mockReturnValue({ id: null });
      jest.spyOn(groupService, 'create').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ group: null });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: group }));
      saveSubject.complete();

      // THEN
      expect(groupFormService.getGroup).toHaveBeenCalled();
      expect(groupService.create).toHaveBeenCalled();
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).toHaveBeenCalled();
    });

    it('Should set isSaving to false on error', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IGroup>>();
      const group = { id: 'ABC' };
      jest.spyOn(groupService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ group });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.error('This is an error!');

      // THEN
      expect(groupService.update).toHaveBeenCalled();
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).not.toHaveBeenCalled();
    });
  });

  describe('Compare relationships', () => {
    describe('compareUser', () => {
      it('Should forward to userService', () => {
        const entity = { id: 'ABC' };
        const entity2 = { id: 'CBA' };
        jest.spyOn(userService, 'compareUser');
        comp.compareUser(entity, entity2);
        expect(userService.compareUser).toHaveBeenCalledWith(entity, entity2);
      });
    });

    describe('compareFamily', () => {
      it('Should forward to familyService', () => {
        const entity = { id: 'ABC' };
        const entity2 = { id: 'CBA' };
        jest.spyOn(familyService, 'compareFamily');
        comp.compareFamily(entity, entity2);
        expect(familyService.compareFamily).toHaveBeenCalledWith(entity, entity2);
      });
    });
  });
});
