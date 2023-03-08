import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';

import { FamilyMemberDetailComponent } from './family-member-detail.component';

describe('FamilyMember Management Detail Component', () => {
  let comp: FamilyMemberDetailComponent;
  let fixture: ComponentFixture<FamilyMemberDetailComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [FamilyMemberDetailComponent],
      providers: [
        {
          provide: ActivatedRoute,
          useValue: { data: of({ familyMember: { id: 'ABC' } }) },
        },
      ],
    })
      .overrideTemplate(FamilyMemberDetailComponent, '')
      .compileComponents();
    fixture = TestBed.createComponent(FamilyMemberDetailComponent);
    comp = fixture.componentInstance;
  });

  describe('OnInit', () => {
    it('Should load familyMember on init', () => {
      // WHEN
      comp.ngOnInit();

      // THEN
      expect(comp.familyMember).toEqual(expect.objectContaining({ id: 'ABC' }));
    });
  });
});
