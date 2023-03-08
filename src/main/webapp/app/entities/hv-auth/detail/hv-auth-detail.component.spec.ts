import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';

import { HvAuthDetailComponent } from './hv-auth-detail.component';

describe('HvAuth Management Detail Component', () => {
  let comp: HvAuthDetailComponent;
  let fixture: ComponentFixture<HvAuthDetailComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [HvAuthDetailComponent],
      providers: [
        {
          provide: ActivatedRoute,
          useValue: { data: of({ hvAuth: { id: 'ABC' } }) },
        },
      ],
    })
      .overrideTemplate(HvAuthDetailComponent, '')
      .compileComponents();
    fixture = TestBed.createComponent(HvAuthDetailComponent);
    comp = fixture.componentInstance;
  });

  describe('OnInit', () => {
    it('Should load hvAuth on init', () => {
      // WHEN
      comp.ngOnInit();

      // THEN
      expect(comp.hvAuth).toEqual(expect.objectContaining({ id: 'ABC' }));
    });
  });
});
