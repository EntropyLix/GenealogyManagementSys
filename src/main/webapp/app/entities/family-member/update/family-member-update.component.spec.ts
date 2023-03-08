import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of, Subject, from } from 'rxjs';

import { FamilyMemberFormService } from './family-member-form.service';
import { FamilyMemberService } from '../service/family-member.service';
import { IFamilyMember } from '../family-member.model';
import { IFamily } from 'app/entities/family/family.model';
import { FamilyService } from 'app/entities/family/service/family.service';
import { IMemberRelationship } from 'app/entities/member-relationship/member-relationship.model';
import { MemberRelationshipService } from 'app/entities/member-relationship/service/member-relationship.service';

import { FamilyMemberUpdateComponent } from './family-member-update.component';

describe('FamilyMember Management Update Component', () => {
  let comp: FamilyMemberUpdateComponent;
  let fixture: ComponentFixture<FamilyMemberUpdateComponent>;
  let activatedRoute: ActivatedRoute;
  let familyMemberFormService: FamilyMemberFormService;
  let familyMemberService: FamilyMemberService;
  let familyService: FamilyService;
  let memberRelationshipService: MemberRelationshipService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, RouterTestingModule.withRoutes([])],
      declarations: [FamilyMemberUpdateComponent],
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
      .overrideTemplate(FamilyMemberUpdateComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(FamilyMemberUpdateComponent);
    activatedRoute = TestBed.inject(ActivatedRoute);
    familyMemberFormService = TestBed.inject(FamilyMemberFormService);
    familyMemberService = TestBed.inject(FamilyMemberService);
    familyService = TestBed.inject(FamilyService);
    memberRelationshipService = TestBed.inject(MemberRelationshipService);

    comp = fixture.componentInstance;
  });

  describe('ngOnInit', () => {
    it('Should call Family query and add missing value', () => {
      const familyMember: IFamilyMember = { id: 'CBA' };
      const family: IFamily = { id: '4130c0e9-34fc-4a76-a16c-d221acd9a238' };
      familyMember.family = family;

      const familyCollection: IFamily[] = [{ id: '145c1bdc-11bb-4b44-9ab5-6c2f94d9323a' }];
      jest.spyOn(familyService, 'query').mockReturnValue(of(new HttpResponse({ body: familyCollection })));
      const additionalFamilies = [family];
      const expectedCollection: IFamily[] = [...additionalFamilies, ...familyCollection];
      jest.spyOn(familyService, 'addFamilyToCollectionIfMissing').mockReturnValue(expectedCollection);

      activatedRoute.data = of({ familyMember });
      comp.ngOnInit();

      expect(familyService.query).toHaveBeenCalled();
      expect(familyService.addFamilyToCollectionIfMissing).toHaveBeenCalledWith(
        familyCollection,
        ...additionalFamilies.map(expect.objectContaining)
      );
      expect(comp.familiesSharedCollection).toEqual(expectedCollection);
    });

    it('Should call MemberRelationship query and add missing value', () => {
      const familyMember: IFamilyMember = { id: 'CBA' };
      const fromMember: IMemberRelationship = { id: '3a280eb7-8cb3-475f-8f91-4e2e6a812794' };
      familyMember.fromMember = fromMember;
      const toMember: IMemberRelationship = { id: '81646c76-5384-41af-99bf-c31be6c3d374' };
      familyMember.toMember = toMember;

      const memberRelationshipCollection: IMemberRelationship[] = [{ id: '54c20e69-ad34-4cc3-85a6-48aca204421e' }];
      jest.spyOn(memberRelationshipService, 'query').mockReturnValue(of(new HttpResponse({ body: memberRelationshipCollection })));
      const additionalMemberRelationships = [fromMember, toMember];
      const expectedCollection: IMemberRelationship[] = [...additionalMemberRelationships, ...memberRelationshipCollection];
      jest.spyOn(memberRelationshipService, 'addMemberRelationshipToCollectionIfMissing').mockReturnValue(expectedCollection);

      activatedRoute.data = of({ familyMember });
      comp.ngOnInit();

      expect(memberRelationshipService.query).toHaveBeenCalled();
      expect(memberRelationshipService.addMemberRelationshipToCollectionIfMissing).toHaveBeenCalledWith(
        memberRelationshipCollection,
        ...additionalMemberRelationships.map(expect.objectContaining)
      );
      expect(comp.memberRelationshipsSharedCollection).toEqual(expectedCollection);
    });

    it('Should update editForm', () => {
      const familyMember: IFamilyMember = { id: 'CBA' };
      const family: IFamily = { id: '916bfa39-6bba-4646-83ed-9ff9c6b81c2e' };
      familyMember.family = family;
      const fromMember: IMemberRelationship = { id: 'deab3cfd-6e98-49e8-a925-60d98463e473' };
      familyMember.fromMember = fromMember;
      const toMember: IMemberRelationship = { id: 'f04ca764-480a-4818-952a-878017f763bc' };
      familyMember.toMember = toMember;

      activatedRoute.data = of({ familyMember });
      comp.ngOnInit();

      expect(comp.familiesSharedCollection).toContain(family);
      expect(comp.memberRelationshipsSharedCollection).toContain(fromMember);
      expect(comp.memberRelationshipsSharedCollection).toContain(toMember);
      expect(comp.familyMember).toEqual(familyMember);
    });
  });

  describe('save', () => {
    it('Should call update service on save for existing entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IFamilyMember>>();
      const familyMember = { id: 'ABC' };
      jest.spyOn(familyMemberFormService, 'getFamilyMember').mockReturnValue(familyMember);
      jest.spyOn(familyMemberService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ familyMember });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: familyMember }));
      saveSubject.complete();

      // THEN
      expect(familyMemberFormService.getFamilyMember).toHaveBeenCalled();
      expect(comp.previousState).toHaveBeenCalled();
      expect(familyMemberService.update).toHaveBeenCalledWith(expect.objectContaining(familyMember));
      expect(comp.isSaving).toEqual(false);
    });

    it('Should call create service on save for new entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IFamilyMember>>();
      const familyMember = { id: 'ABC' };
      jest.spyOn(familyMemberFormService, 'getFamilyMember').mockReturnValue({ id: null });
      jest.spyOn(familyMemberService, 'create').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ familyMember: null });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: familyMember }));
      saveSubject.complete();

      // THEN
      expect(familyMemberFormService.getFamilyMember).toHaveBeenCalled();
      expect(familyMemberService.create).toHaveBeenCalled();
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).toHaveBeenCalled();
    });

    it('Should set isSaving to false on error', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IFamilyMember>>();
      const familyMember = { id: 'ABC' };
      jest.spyOn(familyMemberService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ familyMember });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.error('This is an error!');

      // THEN
      expect(familyMemberService.update).toHaveBeenCalled();
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).not.toHaveBeenCalled();
    });
  });

  describe('Compare relationships', () => {
    describe('compareFamily', () => {
      it('Should forward to familyService', () => {
        const entity = { id: 'ABC' };
        const entity2 = { id: 'CBA' };
        jest.spyOn(familyService, 'compareFamily');
        comp.compareFamily(entity, entity2);
        expect(familyService.compareFamily).toHaveBeenCalledWith(entity, entity2);
      });
    });

    describe('compareMemberRelationship', () => {
      it('Should forward to memberRelationshipService', () => {
        const entity = { id: 'ABC' };
        const entity2 = { id: 'CBA' };
        jest.spyOn(memberRelationshipService, 'compareMemberRelationship');
        comp.compareMemberRelationship(entity, entity2);
        expect(memberRelationshipService.compareMemberRelationship).toHaveBeenCalledWith(entity, entity2);
      });
    });
  });
});
