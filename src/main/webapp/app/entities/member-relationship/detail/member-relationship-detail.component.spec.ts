import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';

import { MemberRelationshipDetailComponent } from './member-relationship-detail.component';

describe('MemberRelationship Management Detail Component', () => {
  let comp: MemberRelationshipDetailComponent;
  let fixture: ComponentFixture<MemberRelationshipDetailComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [MemberRelationshipDetailComponent],
      providers: [
        {
          provide: ActivatedRoute,
          useValue: { data: of({ memberRelationship: { id: 'ABC' } }) },
        },
      ],
    })
      .overrideTemplate(MemberRelationshipDetailComponent, '')
      .compileComponents();
    fixture = TestBed.createComponent(MemberRelationshipDetailComponent);
    comp = fixture.componentInstance;
  });

  describe('OnInit', () => {
    it('Should load memberRelationship on init', () => {
      // WHEN
      comp.ngOnInit();

      // THEN
      expect(comp.memberRelationship).toEqual(expect.objectContaining({ id: 'ABC' }));
    });
  });
});
