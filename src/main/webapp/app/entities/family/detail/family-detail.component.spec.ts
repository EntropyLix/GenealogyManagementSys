import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';

import { FamilyDetailComponent } from './family-detail.component';

describe('Family Management Detail Component', () => {
  let comp: FamilyDetailComponent;
  let fixture: ComponentFixture<FamilyDetailComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [FamilyDetailComponent],
      providers: [
        {
          provide: ActivatedRoute,
          useValue: { data: of({ family: { id: 'ABC' } }) },
        },
      ],
    })
      .overrideTemplate(FamilyDetailComponent, '')
      .compileComponents();
    fixture = TestBed.createComponent(FamilyDetailComponent);
    comp = fixture.componentInstance;
  });

  describe('OnInit', () => {
    it('Should load family on init', () => {
      // WHEN
      comp.ngOnInit();

      // THEN
      expect(comp.family).toEqual(expect.objectContaining({ id: 'ABC' }));
    });
  });
});
