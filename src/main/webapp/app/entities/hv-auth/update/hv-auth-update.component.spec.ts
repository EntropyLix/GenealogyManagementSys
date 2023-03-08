import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of, Subject, from } from 'rxjs';

import { HvAuthFormService } from './hv-auth-form.service';
import { HvAuthService } from '../service/hv-auth.service';
import { IHvAuth } from '../hv-auth.model';

import { IUser } from 'app/entities/user/user.model';
import { UserService } from 'app/entities/user/user.service';
import { IFamily } from 'app/entities/family/family.model';
import { FamilyService } from 'app/entities/family/service/family.service';

import { HvAuthUpdateComponent } from './hv-auth-update.component';

describe('HvAuth Management Update Component', () => {
  let comp: HvAuthUpdateComponent;
  let fixture: ComponentFixture<HvAuthUpdateComponent>;
  let activatedRoute: ActivatedRoute;
  let hvAuthFormService: HvAuthFormService;
  let hvAuthService: HvAuthService;
  let userService: UserService;
  let familyService: FamilyService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, RouterTestingModule.withRoutes([])],
      declarations: [HvAuthUpdateComponent],
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
      .overrideTemplate(HvAuthUpdateComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(HvAuthUpdateComponent);
    activatedRoute = TestBed.inject(ActivatedRoute);
    hvAuthFormService = TestBed.inject(HvAuthFormService);
    hvAuthService = TestBed.inject(HvAuthService);
    userService = TestBed.inject(UserService);
    familyService = TestBed.inject(FamilyService);

    comp = fixture.componentInstance;
  });

  describe('ngOnInit', () => {
    it('Should call User query and add missing value', () => {
      const hvAuth: IHvAuth = { id: 'CBA' };
      const user: IUser = { id: '2af1a435-e908-4268-b3ec-d54170feba83' };
      hvAuth.user = user;

      const userCollection: IUser[] = [{ id: 'bccd9e05-8ad7-4a17-b1ea-2417a9aced83' }];
      jest.spyOn(userService, 'query').mockReturnValue(of(new HttpResponse({ body: userCollection })));
      const additionalUsers = [user];
      const expectedCollection: IUser[] = [...additionalUsers, ...userCollection];
      jest.spyOn(userService, 'addUserToCollectionIfMissing').mockReturnValue(expectedCollection);

      activatedRoute.data = of({ hvAuth });
      comp.ngOnInit();

      expect(userService.query).toHaveBeenCalled();
      expect(userService.addUserToCollectionIfMissing).toHaveBeenCalledWith(
        userCollection,
        ...additionalUsers.map(expect.objectContaining)
      );
      expect(comp.usersSharedCollection).toEqual(expectedCollection);
    });

    it('Should call Family query and add missing value', () => {
      const hvAuth: IHvAuth = { id: 'CBA' };
      const family: IFamily = { id: 'a7a29e44-16f7-415a-9bbe-d49a1f9383bd' };
      hvAuth.family = family;

      const familyCollection: IFamily[] = [{ id: 'e357b950-0b15-41bd-9b1a-3409a6af646b' }];
      jest.spyOn(familyService, 'query').mockReturnValue(of(new HttpResponse({ body: familyCollection })));
      const additionalFamilies = [family];
      const expectedCollection: IFamily[] = [...additionalFamilies, ...familyCollection];
      jest.spyOn(familyService, 'addFamilyToCollectionIfMissing').mockReturnValue(expectedCollection);

      activatedRoute.data = of({ hvAuth });
      comp.ngOnInit();

      expect(familyService.query).toHaveBeenCalled();
      expect(familyService.addFamilyToCollectionIfMissing).toHaveBeenCalledWith(
        familyCollection,
        ...additionalFamilies.map(expect.objectContaining)
      );
      expect(comp.familiesSharedCollection).toEqual(expectedCollection);
    });

    it('Should update editForm', () => {
      const hvAuth: IHvAuth = { id: 'CBA' };
      const user: IUser = { id: '4b6c8159-31c7-4838-9265-423418f359ea' };
      hvAuth.user = user;
      const family: IFamily = { id: '5786c032-edf1-4da3-9be2-d40a0621eb50' };
      hvAuth.family = family;

      activatedRoute.data = of({ hvAuth });
      comp.ngOnInit();

      expect(comp.usersSharedCollection).toContain(user);
      expect(comp.familiesSharedCollection).toContain(family);
      expect(comp.hvAuth).toEqual(hvAuth);
    });
  });

  describe('save', () => {
    it('Should call update service on save for existing entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IHvAuth>>();
      const hvAuth = { id: 'ABC' };
      jest.spyOn(hvAuthFormService, 'getHvAuth').mockReturnValue(hvAuth);
      jest.spyOn(hvAuthService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ hvAuth });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: hvAuth }));
      saveSubject.complete();

      // THEN
      expect(hvAuthFormService.getHvAuth).toHaveBeenCalled();
      expect(comp.previousState).toHaveBeenCalled();
      expect(hvAuthService.update).toHaveBeenCalledWith(expect.objectContaining(hvAuth));
      expect(comp.isSaving).toEqual(false);
    });

    it('Should call create service on save for new entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IHvAuth>>();
      const hvAuth = { id: 'ABC' };
      jest.spyOn(hvAuthFormService, 'getHvAuth').mockReturnValue({ id: null });
      jest.spyOn(hvAuthService, 'create').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ hvAuth: null });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: hvAuth }));
      saveSubject.complete();

      // THEN
      expect(hvAuthFormService.getHvAuth).toHaveBeenCalled();
      expect(hvAuthService.create).toHaveBeenCalled();
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).toHaveBeenCalled();
    });

    it('Should set isSaving to false on error', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IHvAuth>>();
      const hvAuth = { id: 'ABC' };
      jest.spyOn(hvAuthService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ hvAuth });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.error('This is an error!');

      // THEN
      expect(hvAuthService.update).toHaveBeenCalled();
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
