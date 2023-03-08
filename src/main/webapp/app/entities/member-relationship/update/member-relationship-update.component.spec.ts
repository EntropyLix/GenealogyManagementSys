import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of, Subject, from } from 'rxjs';

import { MemberRelationshipFormService } from './member-relationship-form.service';
import { MemberRelationshipService } from '../service/member-relationship.service';
import { IMemberRelationship } from '../member-relationship.model';
import { IFamilyMember } from 'app/entities/family-member/family-member.model';
import { FamilyMemberService } from 'app/entities/family-member/service/family-member.service';

import { MemberRelationshipUpdateComponent } from './member-relationship-update.component';

describe('MemberRelationship Management Update Component', () => {
  let comp: MemberRelationshipUpdateComponent;
  let fixture: ComponentFixture<MemberRelationshipUpdateComponent>;
  let activatedRoute: ActivatedRoute;
  let memberRelationshipFormService: MemberRelationshipFormService;
  let memberRelationshipService: MemberRelationshipService;
  let familyMemberService: FamilyMemberService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, RouterTestingModule.withRoutes([])],
      declarations: [MemberRelationshipUpdateComponent],
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
      .overrideTemplate(MemberRelationshipUpdateComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(MemberRelationshipUpdateComponent);
    activatedRoute = TestBed.inject(ActivatedRoute);
    memberRelationshipFormService = TestBed.inject(MemberRelationshipFormService);
    memberRelationshipService = TestBed.inject(MemberRelationshipService);
    familyMemberService = TestBed.inject(FamilyMemberService);

    comp = fixture.componentInstance;
  });

  describe('ngOnInit', () => {
    it('Should call FamilyMember query and add missing value', () => {
      const memberRelationship: IMemberRelationship = { id: 'CBA' };
      const fromMember: IFamilyMember = { id: '23ad3e8f-f334-4298-ba85-7ae026550dc1' };
      memberRelationship.fromMember = fromMember;
      const toMember: IFamilyMember = { id: '493d4cd5-b378-4c03-bb27-e40c4bd40211' };
      memberRelationship.toMember = toMember;

      const familyMemberCollection: IFamilyMember[] = [{ id: '8bc6b8ed-3ce3-4475-ad75-c632384d8c16' }];
      jest.spyOn(familyMemberService, 'query').mockReturnValue(of(new HttpResponse({ body: familyMemberCollection })));
      const additionalFamilyMembers = [fromMember, toMember];
      const expectedCollection: IFamilyMember[] = [...additionalFamilyMembers, ...familyMemberCollection];
      jest.spyOn(familyMemberService, 'addFamilyMemberToCollectionIfMissing').mockReturnValue(expectedCollection);

      activatedRoute.data = of({ memberRelationship });
      comp.ngOnInit();

      expect(familyMemberService.query).toHaveBeenCalled();
      expect(familyMemberService.addFamilyMemberToCollectionIfMissing).toHaveBeenCalledWith(
        familyMemberCollection,
        ...additionalFamilyMembers.map(expect.objectContaining)
      );
      expect(comp.familyMembersSharedCollection).toEqual(expectedCollection);
    });

    it('Should update editForm', () => {
      const memberRelationship: IMemberRelationship = { id: 'CBA' };
      const fromMember: IFamilyMember = { id: 'bc814cff-9f70-474e-bee9-980e87f484eb' };
      memberRelationship.fromMember = fromMember;
      const toMember: IFamilyMember = { id: '3ba7083b-575d-42d3-9dc1-c8989eed184b' };
      memberRelationship.toMember = toMember;

      activatedRoute.data = of({ memberRelationship });
      comp.ngOnInit();

      expect(comp.familyMembersSharedCollection).toContain(fromMember);
      expect(comp.familyMembersSharedCollection).toContain(toMember);
      expect(comp.memberRelationship).toEqual(memberRelationship);
    });
  });

  describe('save', () => {
    it('Should call update service on save for existing entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IMemberRelationship>>();
      const memberRelationship = { id: 'ABC' };
      jest.spyOn(memberRelationshipFormService, 'getMemberRelationship').mockReturnValue(memberRelationship);
      jest.spyOn(memberRelationshipService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ memberRelationship });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: memberRelationship }));
      saveSubject.complete();

      // THEN
      expect(memberRelationshipFormService.getMemberRelationship).toHaveBeenCalled();
      expect(comp.previousState).toHaveBeenCalled();
      expect(memberRelationshipService.update).toHaveBeenCalledWith(expect.objectContaining(memberRelationship));
      expect(comp.isSaving).toEqual(false);
    });

    it('Should call create service on save for new entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IMemberRelationship>>();
      const memberRelationship = { id: 'ABC' };
      jest.spyOn(memberRelationshipFormService, 'getMemberRelationship').mockReturnValue({ id: null });
      jest.spyOn(memberRelationshipService, 'create').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ memberRelationship: null });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: memberRelationship }));
      saveSubject.complete();

      // THEN
      expect(memberRelationshipFormService.getMemberRelationship).toHaveBeenCalled();
      expect(memberRelationshipService.create).toHaveBeenCalled();
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).toHaveBeenCalled();
    });

    it('Should set isSaving to false on error', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IMemberRelationship>>();
      const memberRelationship = { id: 'ABC' };
      jest.spyOn(memberRelationshipService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ memberRelationship });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.error('This is an error!');

      // THEN
      expect(memberRelationshipService.update).toHaveBeenCalled();
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
