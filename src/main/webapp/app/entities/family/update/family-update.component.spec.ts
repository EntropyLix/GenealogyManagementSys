import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of, Subject, from } from 'rxjs';

import { FamilyFormService } from './family-form.service';
import { FamilyService } from '../service/family.service';
import { IFamily } from '../family.model';
import { IFamilyMember } from 'app/entities/family-member/family-member.model';
import { FamilyMemberService } from 'app/entities/family-member/service/family-member.service';

import { FamilyUpdateComponent } from './family-update.component';

describe('Family Management Update Component', () => {
  let comp: FamilyUpdateComponent;
  let fixture: ComponentFixture<FamilyUpdateComponent>;
  let activatedRoute: ActivatedRoute;
  let familyFormService: FamilyFormService;
  let familyService: FamilyService;
  let familyMemberService: FamilyMemberService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, RouterTestingModule.withRoutes([])],
      declarations: [FamilyUpdateComponent],
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
      .overrideTemplate(FamilyUpdateComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(FamilyUpdateComponent);
    activatedRoute = TestBed.inject(ActivatedRoute);
    familyFormService = TestBed.inject(FamilyFormService);
    familyService = TestBed.inject(FamilyService);
    familyMemberService = TestBed.inject(FamilyMemberService);

    comp = fixture.componentInstance;
  });

  describe('ngOnInit', () => {
    it('Should call FamilyMember query and add missing value', () => {
      const family: IFamily = { id: 'CBA' };
      const members: IFamilyMember[] = [{ id: '31cfdc47-3e2a-4fd4-8379-974e0eadef16' }];
      family.members = members;

      const familyMemberCollection: IFamilyMember[] = [{ id: '5838b76c-3b49-4a83-9e44-e3afcee84ca1' }];
      jest.spyOn(familyMemberService, 'query').mockReturnValue(of(new HttpResponse({ body: familyMemberCollection })));
      const additionalFamilyMembers = [...members];
      const expectedCollection: IFamilyMember[] = [...additionalFamilyMembers, ...familyMemberCollection];
      jest.spyOn(familyMemberService, 'addFamilyMemberToCollectionIfMissing').mockReturnValue(expectedCollection);

      activatedRoute.data = of({ family });
      comp.ngOnInit();

      expect(familyMemberService.query).toHaveBeenCalled();
      expect(familyMemberService.addFamilyMemberToCollectionIfMissing).toHaveBeenCalledWith(
        familyMemberCollection,
        ...additionalFamilyMembers.map(expect.objectContaining)
      );
      expect(comp.familyMembersSharedCollection).toEqual(expectedCollection);
    });

    it('Should update editForm', () => {
      const family: IFamily = { id: 'CBA' };
      const member: IFamilyMember = { id: '6e64a8ba-3193-4a7f-847a-8cd02b7e73f4' };
      family.members = [member];

      activatedRoute.data = of({ family });
      comp.ngOnInit();

      expect(comp.familyMembersSharedCollection).toContain(member);
      expect(comp.family).toEqual(family);
    });
  });

  describe('save', () => {
    it('Should call update service on save for existing entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IFamily>>();
      const family = { id: 'ABC' };
      jest.spyOn(familyFormService, 'getFamily').mockReturnValue(family);
      jest.spyOn(familyService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ family });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: family }));
      saveSubject.complete();

      // THEN
      expect(familyFormService.getFamily).toHaveBeenCalled();
      expect(comp.previousState).toHaveBeenCalled();
      expect(familyService.update).toHaveBeenCalledWith(expect.objectContaining(family));
      expect(comp.isSaving).toEqual(false);
    });

    it('Should call create service on save for new entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IFamily>>();
      const family = { id: 'ABC' };
      jest.spyOn(familyFormService, 'getFamily').mockReturnValue({ id: null });
      jest.spyOn(familyService, 'create').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ family: null });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: family }));
      saveSubject.complete();

      // THEN
      expect(familyFormService.getFamily).toHaveBeenCalled();
      expect(familyService.create).toHaveBeenCalled();
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).toHaveBeenCalled();
    });

    it('Should set isSaving to false on error', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IFamily>>();
      const family = { id: 'ABC' };
      jest.spyOn(familyService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ family });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.error('This is an error!');

      // THEN
      expect(familyService.update).toHaveBeenCalled();
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).not.toHaveBeenCalled();
    });
  });

  describe('Compare relationships', () => {
    describe('compareFamilyMember', () => {
      it('Should forward to familyMemberService', () => {
        const entity = { id: 'ABC' };
        const entity2 = { id: 'CBA' };
        jest.spyOn(familyMemberService, 'compareFamilyMember');
        comp.compareFamilyMember(entity, entity2);
        expect(familyMemberService.compareFamilyMember).toHaveBeenCalledWith(entity, entity2);
      });
    });
  });
});
